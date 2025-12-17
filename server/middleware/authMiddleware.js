const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// In production, use environment variables for credentials
// For development, you can use the service account JSON file
try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.log('Firebase Admin initialization error:', error.message);
}

// Middleware to verify Firebase ID token
const verifyToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'No token provided' 
      });
    }

    // Extract token
    const token = authHeader.split('Bearer ')[1];

    if (!token) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Invalid token format' 
      });
    }

    // Verify token with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Add user info to request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Token expired' 
      });
    }
    
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Invalid token' 
    });
  }
};

// Optional middleware - verify token if present, but don't require it
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
      };
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = { verifyToken, optionalAuth };
