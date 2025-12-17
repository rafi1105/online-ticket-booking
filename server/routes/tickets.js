const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const { verifyToken, optionalAuth } = require('../middleware/authMiddleware');

// Get all tickets (optional auth - public but can be personalized)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { type, from, to } = req.query;
    let query = { status: 'active' };

    if (type) query.type = type;
    if (from) query.from = new RegExp(from, 'i');
    if (to) query.to = new RegExp(to, 'i');

    const tickets = await Ticket.find(query).populate('vendorId', 'name email');
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single ticket (optional auth)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('vendorId', 'name email');
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create ticket (vendor only - requires authentication)
router.post('/', verifyToken, async (req, res) => {
  try {
    // Add the authenticated user's uid as vendorId
    const ticketData = {
      ...req.body,
      vendorId: req.user.uid
    };
    
    const ticket = new Ticket(ticketData);
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update ticket (requires authentication)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json(ticket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete ticket
router.delete('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
