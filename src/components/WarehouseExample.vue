<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { createKnex } from '@/database';

const knex = createKnex();

function withLoggedSteps(qb, ...relations: string[]) {
  qb.crossJoin('logged_steps');
  qb.select('logged_steps.json_payload');
  const pairs = relations
    .map(rel => `'${rel}', (SELECT jsonb_agg(${rel}) FROM ${rel})`)
    .join(', ');
  qb.with(
    'logged_steps',
    knex.raw(`SELECT jsonb_build_object(${pairs}) AS json_payload`)
  );
}

const loading = ref(false);
const result = ref('???');

async function loadResult() {
  try {
    loading.value = true;
    const rows = await knex
      .with(
        'raw_data',
        ['warehouse', 'product', 'quantity'],
        knex.raw(`
          VALUES
            ('S1', 'Cocoa beans', 40),
            ('S2', 'Cocoa beans', 10),
            ('S2', 'Sugar', 20),
            ('S3', 'Vanilla', 75)
        `)
      )
      .with(
        'step1',
        knex.raw(`
          SELECT product,
                SUM(quantity) AS quantity
          FROM raw_data
          GROUP BY product
        `)
      )
      .with(
        'step2',
        knex.raw(`
          SELECT
              product,
              quantity,
              CASE
                  WHEN quantity < 50 THEN 'Reorder'
                  ELSE 'Sufficient'
              END AS stock_status
          FROM step1
        `)
      )
      .with(
        'step3',
        knex.raw(`
          SELECT
              product
              FROM step2
          WHERE stock_status = 'Reorder'
        `)
      )
      .from('step3')
      .modify(withLoggedSteps, 'step1', 'step2')
      .select('step3.*');

    result.value = JSON.stringify(rows, null, 2);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }

}

// 
// onUnmounted(async () => {
//   await knex.destroy();
// });
</script>

<template>
  <div class="buttons-constainer">
    <InkButton :loading="loading" :disabled="loading" @click="loadResult();" />
  </div>
  <div class="output">
    <h2>Stock Status</h2>
    <code>
      <pre>{{ result }}</pre>
    </code>
  </div>
</template>

<style scoped>
.buttons-constainer {
  display: flex;
  justify-content: end;
}
</style>
