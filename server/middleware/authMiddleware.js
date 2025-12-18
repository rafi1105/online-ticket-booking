const admin = require('firebase-admin');

// Track if Firebase Admin is initialized
let firebaseInitialized = false;

// Initialize Firebase Admin SDK
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'online-ticket-bookings'
    });
    firebaseInitialized = true;
    console.log('Firebase Admin initialized with project:', process.env.FIREBASE_PROJECT_ID || 'online-ticket-bookings');
  } else {
    firebaseInitialized = true;
  }
} catch (error) {
  console.log('Firebase Admin initialization error:', error.message);
}

// Helper function to decode JWT without verification (for development)
const decodeJwtPayload = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = Buffer.from(parts[1], 'base64').toString('utf8');
    return JSON.parse(payload);
  } catch (error) {
    return null;
  }
};

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

    // If Firebase Admin is initialized, verify token properly
    if (firebaseInitialized) {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
      };
    } else {
      // Development mode: decode JWT payload without verification
      const decoded = decodeJwtPayload(token);
      if (!decoded || !decoded.user_id) {
        return res.status(401).json({ 
          error: 'Unauthorized', 
          message: 'Invalid token' 
        });
      }
      req.user = {
        uid: decoded.user_id,
        email: decoded.email,
        emailVerified: decoded.email_verified,
      };
    }

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
      
      if (firebaseInitialized) {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          emailVerified: decodedToken.email_verified,
        };
      } else {
        // Development mode
        const decoded = decodeJwtPayload(token);
        if (decoded && decoded.user_id) {
          req.user = {
            uid: decoded.user_id,
            email: decoded.email,
            emailVerified: decoded.email_verified,
          };
        }
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = { verifyToken, optionalAuth };
