const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    userEmail: {
      type: String,
      required: true
    },
    userName: {
      type: String
    },
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true
    },
    ticketTitle: {
      type: String,
      required: true
    },
    ticketImage: {
      type: String
    },
    transportType: {
      type: String
    },
    from: {
      type: String,
      required: true
    },
    to: {
      type: String,
      required: true
    },
    departureDate: {
      type: String,
      required: true
    },
    departureTime: {
      type: String,
      required: true
    },
    numberOfSeats: {
      type: Number,
      required: true,
      min: 1
    },
    pricePerSeat: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'paid'],
      default: 'pending'
    },
    paymentId: {
      type: String
    },
    paidAt: {
      type: Date
    },
    bookedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
