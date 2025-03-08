import Knex from 'knex';
import ClientPgLite from 'knex-pglite';
import { PGlite } from '@electric-sql/pglite'

// XXX: Important to ensure `postgres.wasm` and `postgres.data` are imported and copied to `dist/`.
const pglite = new PGlite();

let inst = null;
export function createKnex() {
  if (inst === null) {
    inst = Knex({
      client: ClientPgLite,
      dialect: 'postgres',
      // In-memory
      connection: {
        // TODO: Try pglite.clone(),
        pglite,
      },
    });
  }

  return inst;
}
