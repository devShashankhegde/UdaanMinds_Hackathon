"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const community_1 = __importDefault(require("./routes/community"));
const market_1 = __importDefault(require("./routes/market"));
const listings_1 = __importDefault(require("./routes/listings"));
// Import passport configuration
require("./config/passport");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Database connection
mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/krishilink')
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production' ? false : true,
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Session configuration
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    store: connect_mongo_1.default.create({
        mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/krishilink'
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));
// Passport middleware
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Serve static files
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Routes
app.use('/auth', auth_1.default);
app.use('/community', community_1.default);
app.use('/market-prices', market_1.default);
app.use('/listings', listings_1.default);
// Serve frontend pages
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/home.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/login.html'));
});
app.get('/register', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/register.html'));
});
app.get('/community', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/community.html'));
});
app.get('/pricing', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/pricing.html'));
});
app.get('/services', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/services.html'));
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
app.listen(PORT, () => {
    console.log(`KrishiLink server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to access the application`);
});
//# sourceMappingURL=server.js.map