const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['Bus', 'Train', 'Launch', 'Plane']
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
    arrivalTime: {
      type: String
    },
    duration: {
      type: String
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
      type: Number
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80'
    },
    features: [String],
    vendorId: {
      type: String,
      required: true
    },
    vendorName: {
      type: String
    },
    vendorEmail: {
      type: String
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'approved', 'rejected', 'cancelled', 'completed'],
      default: 'pending'
    },
    rejectionReason: {
      type: String
    },
    isAdvertised: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Ticket', ticketSchema);
