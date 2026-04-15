const schemaStatements = [
  `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS seats (
    id SERIAL PRIMARY KEY,
    seat_number INT UNIQUE NOT NULL,
    is_booked BOOLEAN DEFAULT false
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seat_id INT NOT NULL REFERENCES seats(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  `,
  `
  CREATE UNIQUE INDEX IF NOT EXISTS bookings_unique_seat_idx
  ON bookings (seat_id);
  `,
  `
  INSERT INTO seats (seat_number)
  SELECT s
  FROM generate_series(1, 48) AS s
  ON CONFLICT (seat_number) DO NOTHING;
  `,
];

export const ensureDatabaseSchema = async (pool) => {
  for (const statement of schemaStatements) {
    await pool.query(statement);
  }
};
