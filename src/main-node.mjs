import Knex from 'knex';
import ClientPGLite from 'knex-pglite';

async function main() {
  const knex = Knex({
    client: ClientPGLite,
    // In memory database
    connection: {},
  });


  // A helper to add a logged_steps CTE that aggregates the specified relations as JSON.
  function withLoggedSteps(qb, ...relations) {
    // Ensure we select the JSON payload later on.
    // Build key-value pairs for the JSON object.
    const pairs = relations
      .map(rel => `'${rel}', (SELECT jsonb_agg(${rel}) FROM ${rel})`)
      .join(', ');
    // Add the logged_steps CTE.
    qb.select(knex.raw(`(SELECT jsonb_build_object(${pairs})) AS json_payload`)

    );
  }

  // Build the query using multiple CTEs.
  knex
    // Step 1: Define our fantasy data.
    .with(
      'fantasy_data',
      knex.raw(`
      VALUES
        ('Alice', 'Curious adventurer', 'Wonderland'),
        ('White Rabbit', 'Nervous guide', 'Wonderland'),
        ('Cheshire Cat', 'Mysterious feline', 'Wonderland'),
        ('Mad Hatter', 'Eccentric host', 'Wonderland'),
        ('Queen of Hearts', 'Imperious ruler', 'Wonderland')
    `)
    )
    // Step 2: Parse the data with proper column names.
    .with(
      'parsed_data',
      knex.raw(`
      SELECT
        column1 AS name,
        column2 AS role,
        column3 AS realm
      FROM fantasy_data
    `)
    )
    // Step 3: Categorize the characters.
    .with(
      'categorized_characters',
      knex.raw(`
      SELECT
        name,
        role,
        realm,
        CASE
          WHEN name = 'Alice' THEN 'Protagonist'
          WHEN name = 'Queen of Hearts' THEN 'Antagonist'
          ELSE 'Supporting'
        END AS character_type
      FROM parsed_data
    `)
    )
    // Final query: select from categorized_characters and include our logged_steps.
    .from('categorized_characters')
    // Use our helper to add the logged_steps CTE dynamically.
    .modify(withLoggedSteps, 'categorized_characters', 'parsed_data')
    // (Optional) Also select all columns from categorized_characters.
    .select('categorized_characters.*')
    .then(rows => {
      console.log(JSON.stringify(rows, null, 2));
    })
    .catch(err => {
      console.error(err);
    });

  await knex.destroy();
}

main();
