const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'TicketBari API Server is running!' });
});

// Import routes
const ticketRoutes = require('./routes/tickets');
const bookingRoutes = require('./routes/bookings');
const userRoutes = require('./routes/users');
const seedRoutes = require('./routes/seed');
const paymentRoutes = require('./routes/payments');

// Use routes
app.use('/api/tickets', ticketRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/payments', paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
