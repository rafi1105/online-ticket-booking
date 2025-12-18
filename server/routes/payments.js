const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { verifyToken } = require('../middleware/authMiddleware');

// Create Payment Intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, bookingId, ticketTitle, userEmail } = req.body;

    // Validate amount
    if (!amount || amount < 1) {
      return res.status(400).json({ error: 'Invalid payment amount' });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents/paisa
      currency: 'bdt', // Bangladeshi Taka
      metadata: {
        bookingId: bookingId || '',
        ticketTitle: ticketTitle || '',
        userEmail: userEmail || ''
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Payment Intent Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Confirm Payment (webhook or manual confirmation)
router.post('/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, bookingId } = req.body;

    // Retrieve the payment intent to verify status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update booking status to 'paid' in database
      const Booking = require('../models/Booking');
      const Ticket = require('../models/Ticket');
      
      if (bookingId) {
        const booking = await Booking.findByIdAndUpdate(bookingId, {
          status: 'paid',
          paymentId: paymentIntentId,
          paidAt: new Date()
        }, { new: true });

        // Reduce available seats on the ticket after successful payment
        if (booking && booking.ticketId) {
          await Ticket.findByIdAndUpdate(booking.ticketId, {
            $inc: { availableSeats: -booking.numberOfSeats }
          });
        }
      }

      res.json({ 
        success: true, 
        message: 'Payment confirmed successfully',
        paymentIntent 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Payment not completed',
        status: paymentIntent.status 
      });
    }
  } catch (error) {
    console.error('Payment Confirmation Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Payment History for a user
router.get('/history/:userEmail', verifyToken, async (req, res) => {
  try {
    const { userEmail } = req.params;
    
    // Get payments from Stripe
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100,
    });

    // Filter by user email from metadata
    const userPayments = paymentIntents.data.filter(
      pi => pi.metadata.userEmail === userEmail && pi.status === 'succeeded'
    );

    const transactions = userPayments.map(pi => ({
      id: pi.id,
      amount: pi.amount / 100, // Convert back from paisa
      ticketTitle: pi.metadata.ticketTitle,
      paymentDate: new Date(pi.created * 1000).toISOString(),
      status: pi.status,
      last4: pi.payment_method_types[0] === 'card' ? '****' : 'N/A'
    }));

    res.json(transactions);
  } catch (error) {
    console.error('Payment History Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
