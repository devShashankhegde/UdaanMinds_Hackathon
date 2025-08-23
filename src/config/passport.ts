import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User, { IUser } from '../models/User';

// Local Strategy
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email: string, password: string, done) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return done(null, false, { message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return done(null, false, { message: 'Invalid email or password' });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
