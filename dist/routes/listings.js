"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const Listing_1 = __importDefault(require("../models/Listing"));
const schemas_1 = require("../validation/schemas");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed'));
        }
    }
});
// Get all listings
router.get('/', async (req, res) => {
    try {
        const { category, state, district, minPrice, maxPrice, search, page = 1, limit = 12 } = req.query;
        const filter = { status: 'active' };
        if (category && category !== 'all') {
            filter.category = category;
        }
        if (state) {
            filter['location.state'] = new RegExp(state, 'i');
        }
        if (district) {
            filter['location.district'] = new RegExp(district, 'i');
        }
        if (minPrice || maxPrice) {
            filter['price.amount'] = {};
            if (minPrice) {
                filter['price.amount'].$gte = parseFloat(minPrice);
            }
            if (maxPrice) {
                filter['price.amount'].$lte = parseFloat(maxPrice);
            }
        }
        if (search) {
            filter.$or = [
                { title: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { subcategory: new RegExp(search, 'i') }
            ];
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const listings = await Listing_1.default.find(filter)
            .populate('seller', 'username profile.fullName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        const total = await Listing_1.default.countDocuments(filter);
        res.json({
            listings,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    }
    catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ error: 'Failed to fetch listings' });
    }
});
// Get single listing
router.get('/:id', async (req, res) => {
    try {
        const listing = await Listing_1.default.findById(req.params.id)
            .populate('seller', 'username profile.fullName profile.phone');
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }
        res.json(listing);
    }
    catch (error) {
        console.error('Error fetching listing:', error);
        res.status(500).json({ error: 'Failed to fetch listing' });
    }
});
// Create new listing
router.post('/', auth_1.isAuthenticated, upload.array('images', 5), async (req, res) => {
    try {
        const { error, value } = schemas_1.listingSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const images = req.files?.map(file => `/uploads/${file.filename}`) || [];
        const listing = new Listing_1.default({
            ...value,
            images,
            seller: req.user._id
        });
        await listing.save();
        await listing.populate('seller', 'username profile.fullName');
        res.status(201).json(listing);
    }
    catch (error) {
        console.error('Error creating listing:', error);
        res.status(500).json({ error: 'Failed to create listing' });
    }
});
// Update listing
router.put('/:id', auth_1.isAuthenticated, upload.array('images', 5), async (req, res) => {
    try {
        const listing = await Listing_1.default.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }
        if (listing.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to update this listing' });
        }
        const { error, value } = schemas_1.listingSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const newImages = req.files?.map(file => `/uploads/${file.filename}`) || [];
        Object.assign(listing, value);
        if (newImages.length > 0) {
            listing.images = [...listing.images, ...newImages];
        }
        await listing.save();
        await listing.populate('seller', 'username profile.fullName');
        res.json(listing);
    }
    catch (error) {
        console.error('Error updating listing:', error);
        res.status(500).json({ error: 'Failed to update listing' });
    }
});
// Delete listing
router.delete('/:id', auth_1.isAuthenticated, async (req, res) => {
    try {
        const listing = await Listing_1.default.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }
        if (listing.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to delete this listing' });
        }
        await Listing_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Listing deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting listing:', error);
        res.status(500).json({ error: 'Failed to delete listing' });
    }
});
// Get user's listings
router.get('/user/my-listings', auth_1.isAuthenticated, async (req, res) => {
    try {
        const listings = await Listing_1.default.find({ seller: req.user._id })
            .sort({ createdAt: -1 });
        res.json(listings);
    }
    catch (error) {
        console.error('Error fetching user listings:', error);
        res.status(500).json({ error: 'Failed to fetch user listings' });
    }
});
exports.default = router;
//# sourceMappingURL=listings.js.map