import dotenv from 'dotenv';
import pool from './db/db.js';
import app from './app.js';
import { ensureDatabaseSchema } from './db/schema.js';

dotenv.config({
  quiet: true,
});

const port = Number(process.env.PORT || 8080);

const start = async () => {
  try {
    await ensureDatabaseSchema(pool);
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Startup failed:', error.message);
    process.exit(1);
  }
};

start();
