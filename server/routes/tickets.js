const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Ticket = require('../models/Ticket');
const { verifyToken, optionalAuth } = require('../middleware/authMiddleware');

// Get all tickets (optional auth - public but can be personalized)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { type, from, to, status } = req.query;
    // Default to showing active/approved tickets for public view
    let query = { status: { $in: ['active', 'approved'] } };

    // Allow admin to see all tickets or filter by status
    if (status) {
      if (status === 'all') {
        delete query.status;
      } else {
        query.status = status;
      }
    }

    if (type) query.type = type;
    if (from) query.from = new RegExp(from, 'i');
    if (to) query.to = new RegExp(to, 'i');

    const tickets = await Ticket.find(query).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get advertised tickets for homepage carousel
router.get('/featured/advertised', async (req, res) => {
  try {
    const tickets = await Ticket.find({ 
      isAdvertised: true,
      status: { $in: ['active', 'approved'] }
    }).sort({ createdAt: -1 }).limit(6);
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tickets by vendor (requires authentication)
router.get('/vendor/:vendorId', verifyToken, async (req, res) => {
  try {
    const tickets = await Ticket.find({ vendorId: req.params.vendorId })
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single ticket (optional auth)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ticket ID format' });
    }
    
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
    console.log('Creating ticket with data:', req.body);
    
    // Add the authenticated user's uid as vendorId
    const ticketData = {
      ...req.body,
      vendorId: req.user?.uid || req.body.vendorId
    };
    
    const ticket = new Ticket(ticketData);
    await ticket.save();
    console.log('Ticket created successfully:', ticket._id);
    res.status(201).json(ticket);
  } catch (error) {
    console.error('Error creating ticket:', error.message);
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
