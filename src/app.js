import express from 'express';
import cors from 'cors';
import authRoutes from './auth/auth.routes.js';
import bookingRoutes from './booking/booking.routes.js';
import pool from './db/db.js';

const app = express();

app.use(cors());

app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Database unavailable' });
  }
});

app.get('/', (req, res) => {
  res.send('Server running');
});

app.use('/auth', authRoutes);
app.use('/booking', bookingRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Internal server error' });
});

export default app;
