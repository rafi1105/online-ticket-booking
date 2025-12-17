const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Ticket = require('../models/Ticket');
const { verifyToken } = require('../middleware/authMiddleware');

// Get all bookings (admin only - requires authentication)
router.get('/', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('ticketId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get bookings by user (requires authentication)
router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    // Ensure user can only access their own bookings
    if (req.params.userId !== req.user.uid) {
      return res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
    }
    
    const bookings = await Booking.find({ userId: req.params.userId })
      .populate('ticketId')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create booking (requires authentication)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { ticketId, numberOfSeats } = req.body;
    
    // Check ticket availability
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    if (ticket.availableSeats < numberOfSeats) {
      return res.status(400).json({ error: 'Not enough seats available' });
    }

    // Create booking
    const booking = new Booking(req.body);
    await booking.save();

    // Update available seats
    ticket.availableSeats -= numberOfSeats;
    await ticket.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update booking status
router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Cancel booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Restore seats
    const ticket = await Ticket.findById(booking.ticketId);
    if (ticket) {
      ticket.availableSeats += booking.numberOfSeats;
      await ticket.save();
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
