const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Seed demo accounts endpoint
router.post('/demo-accounts', async (req, res) => {
  try {
    const demoAccounts = [
      {
        name: 'Admin User',
        email: 'admin@ticketbari.com',
        photoURL: 'https://i.pravatar.cc/150?u=admin',
        role: 'admin',
        uid: 'demo-admin-uid-' + Date.now()
      },
      {
        name: 'Vendor User',
        email: 'vendor@ticketbari.com',
        photoURL: 'https://i.pravatar.cc/150?u=vendor',
        role: 'vendor',
        uid: 'demo-vendor-uid-' + Date.now()
      },
      {
        name: 'Normal User',
        email: 'user@ticketbari.com',
        photoURL: 'https://i.pravatar.cc/150?u=user',
        role: 'user',
        uid: 'demo-user-uid-' + Date.now()
      }
    ];

    const results = [];
    
    for (const account of demoAccounts) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: account.email });
      
      if (existingUser) {
        results.push({
          email: account.email,
          status: 'already_exists',
          role: existingUser.role
        });
      } else {
        // Create new user in MongoDB
        const newUser = new User(account);
        await newUser.save();
        results.push({
          email: account.email,
          status: 'created',
          role: account.role
        });
      }
    }

    res.json({
      message: 'Demo accounts processed successfully',
      results: results
    });
  } catch (error) {
    console.error('Error seeding demo accounts:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
