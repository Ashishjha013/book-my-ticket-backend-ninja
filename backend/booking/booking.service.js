import pool from '../db/db.js';

const asHttpError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export const getSeats = async () => {
  const result = await pool.query('SELECT * FROM seats ORDER BY id');
  return result.rows;
};

export const bookSeat = async (userId, seatId) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const seatResult = await client.query('SELECT * FROM seats WHERE id=$1 FOR UPDATE', [seatId]);

    const seat = seatResult.rows[0];

    if (!seat) {
      throw asHttpError('Seat not found', 404);
    }

    if (seat.is_booked) {
      throw asHttpError('Seat already booked', 409);
    }

    await client.query('UPDATE seats SET is_booked=true WHERE id=$1', [seatId]);

    const bookingResult = await client.query(
      'INSERT INTO bookings(user_id, seat_id) VALUES($1, $2) RETURNING *',
      [userId, seatId],
    );

    await client.query('COMMIT');

    return bookingResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.code === '23505') {
      throw asHttpError('Seat already booked', 409);
    }
    throw error;
  } finally {
    client.release();
  }
};
