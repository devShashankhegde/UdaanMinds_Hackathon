import express from 'express';
import passport from 'passport';
import User from '../models/User';
import { registerSchema, loginSchema } from '../validation/schemas';
import { isAuthenticated, isNotAuthenticated, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Register
router.post('/register', async (req: AuthenticatedRequest, res) => {
  try {
    // Check if user is already authenticated
    if (req.isAuthenticated()) {
      return res.status(400).json({ error: 'You are already logged in' });
    }

    const { error, value } = registerSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { username, email, password, role, profile } = value;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email or username already exists' });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role,
      profile
    });

    await user.save();

    // Auto login after registration
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Registration successful but login failed' });
      }
      
      res.status(201).json({
        message: 'Registration successful',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          profile: user.profile
        }
      });
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', (req: AuthenticatedRequest, res, next) => {
  // Check if user is already authenticated
  if (req.isAuthenticated()) {
    return res.status(400).json({ error: 'You are already logged in' });
  }

  const { error } = loginSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  passport.authenticate('local', (err: any, user: any, info: any) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return res.status(401).json({ error: info.message || 'Login failed' });
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      
      res.json({
        message: 'Login successful',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          profile: user.profile
        }
      });
    });
  })(req, res, next);
});

// Logout
router.get('/logout', isAuthenticated, (req: AuthenticatedRequest, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logout successful' });
  });
});

// Get current user
router.get('/me', isAuthenticated, (req: AuthenticatedRequest, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      profile: req.user.profile
    }
  });
});

export default router;
