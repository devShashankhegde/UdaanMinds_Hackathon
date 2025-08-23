"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const MarketPrice_1 = __importDefault(require("../models/MarketPrice"));
const router = express_1.default.Router();
// Get market prices
router.get('/', async (req, res) => {
    try {
        const { crop, state, district, startDate, endDate, limit = 50, page = 1 } = req.query;
        const filter = {};
        if (crop) {
            filter.crop = new RegExp(crop, 'i');
        }
        if (state) {
            filter.state = new RegExp(state, 'i');
        }
        if (district) {
            filter.district = new RegExp(district, 'i');
        }
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) {
                filter.date.$gte = new Date(startDate);
            }
            if (endDate) {
                filter.date.$lte = new Date(endDate);
            }
        }
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const prices = await MarketPrice_1.default.find(filter)
            .sort({ date: -1, crop: 1 })
            .skip(skip)
            .limit(parseInt(limit));
        const total = await MarketPrice_1.default.countDocuments(filter);
        // Get unique crops, states, and districts for filters
        const crops = await MarketPrice_1.default.distinct('crop');
        const states = await MarketPrice_1.default.distinct('state');
        res.json({
            prices,
            filters: {
                crops: crops.sort(),
                states: states.sort()
            },
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    }
    catch (error) {
        console.error('Error fetching market prices:', error);
        res.status(500).json({ error: 'Failed to fetch market prices' });
    }
});
// Get price trends for a specific crop
router.get('/trends/:crop', async (req, res) => {
    try {
        const { crop } = req.params;
        const { days = 30, state, district } = req.query;
        const filter = {
            crop: new RegExp(crop, 'i'),
            date: {
                $gte: new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000)
            }
        };
        if (state) {
            filter.state = new RegExp(state, 'i');
        }
        if (district) {
            filter.district = new RegExp(district, 'i');
        }
        const trends = await MarketPrice_1.default.find(filter)
            .sort({ date: 1 })
            .select('date price market state district');
        res.json(trends);
    }
    catch (error) {
        console.error('Error fetching price trends:', error);
        res.status(500).json({ error: 'Failed to fetch price trends' });
    }
});
exports.default = router;
//# sourceMappingURL=market.js.map