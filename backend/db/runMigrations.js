import pool from './db.js';
import { ensureDatabaseSchema } from './schema.js';

const run = async () => {
  try {
    await ensureDatabaseSchema(pool);
    console.log('Database migration complete');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
};

run();
