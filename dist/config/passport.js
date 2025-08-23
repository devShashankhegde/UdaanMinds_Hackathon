"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const User_1 = __importDefault(require("../models/User"));
// Local Strategy
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User_1.default.findOne({ email: email.toLowerCase() });
        if (!user) {
            return done(null, false, { message: 'Invalid email or password' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return done(null, false, { message: 'Invalid email or password' });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
}));
// Serialize user for session
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
// Deserialize user from session
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await User_1.default.findById(id).select('-password');
        done(null, user);
    }
    catch (error) {
        done(error);
    }
});
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map