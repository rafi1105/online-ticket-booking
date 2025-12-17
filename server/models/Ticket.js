const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['bus', 'train', 'launch', 'plane']
    },
    company: {
      type: String,
      required: true
    },
    from: {
      type: String,
      required: true
    },
    to: {
      type: String,
      required: true
    },
    departureTime: {
      type: String,
      required: true
    },
    arrivalTime: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    availableSeats: {
      type: Number,
      required: true
    },
    totalSeats: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    features: [String],
    status: {
      type: String,
      enum: ['active', 'cancelled', 'completed'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Ticket', ticketSchema);
