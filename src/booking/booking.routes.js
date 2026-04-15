import express from 'express';
import { bookSeat, getSeats } from './booking.controller.js';
import { protect } from '../auth/auth.middleware.js';

const router = express.Router();

// view seats
router.get('/seats', getSeats);

// book seat (protected)
router.post('/book/:seatId', protect, bookSeat);

export default router;
