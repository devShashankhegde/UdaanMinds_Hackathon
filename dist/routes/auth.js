"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const User_1 = __importDefault(require("../models/User"));
const schemas_1 = require("../validation/schemas");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Register
router.post('/register', auth_1.isNotAuthenticated, async (req, res) => {
    try {
        const { error, value } = schemas_1.registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const { username, email, password, role, profile } = value;
        // Check if user already exists
        const existingUser = await User_1.default.findOne({
            $or: [{ email }, { username }]
        });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email or username already exists' });
        }
        // Create new user
        const user = new User_1.default({
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
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Login
router.post('/login', auth_1.isNotAuthenticated, (req, res, next) => {
    const { error } = schemas_1.loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    passport_1.default.authenticate('local', (err, user, info) => {
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
router.get('/logout', auth_1.isAuthenticated, (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logout successful' });
    });
});
// Get current user
router.get('/me', auth_1.isAuthenticated, (req, res) => {
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
exports.default = router;
//# sourceMappingURL=auth.js.map