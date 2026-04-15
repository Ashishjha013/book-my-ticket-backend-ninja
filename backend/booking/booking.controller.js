import { getSeats as getSeatsService, bookSeat as bookSeatService } from './booking.service.js';

// get seats
export const getSeats = async (req, res) => {
  try {
    const seats = await getSeatsService();
    res.json(seats);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

// book seat
export const bookSeat = async (req, res) => {
  try {
    const userId = req.user.id;
    const seatId = Number(req.params.seatId);

    if (!Number.isInteger(seatId) || seatId <= 0) {
      return res.status(400).json({ message: 'Seat id must be a positive integer' });
    }

    const booking = await bookSeatService(userId, seatId);

    res.json(booking);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};
