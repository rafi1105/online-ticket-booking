const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    photoURL: {
      type: String
    },
    role: {
      type: String,
      enum: ['user', 'vendor', 'admin'],
      default: 'user'
    },
    uid: {
      type: String,
      required: true,
      unique: true
    },
    isFraud: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
