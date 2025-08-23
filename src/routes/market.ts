import express from 'express';
import MarketPrice from '../models/MarketPrice';

const router = express.Router();

// Get market prices
router.get('/', async (req, res) => {
  try {
    const {
      crop,
      state,
      district,
      startDate,
      endDate,
      limit = 50,
      page = 1
    } = req.query;

    const filter: any = {};
    
    if (crop) {
      filter.crop = new RegExp(crop as string, 'i');
    }
    
    if (state) {
      filter.state = new RegExp(state as string, 'i');
    }
    
    if (district) {
      filter.district = new RegExp(district as string, 'i');
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate as string);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate as string);
      }
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const prices = await MarketPrice.find(filter)
      .sort({ date: -1, crop: 1 })
      .skip(skip)
      .limit(parseInt(limit as string));

    const total = await MarketPrice.countDocuments(filter);

    // Get unique crops, states, and districts for filters
    const crops = await MarketPrice.distinct('crop');
    const states = await MarketPrice.distinct('state');

    res.json({
      prices,
      filters: {
        crops: crops.sort(),
        states: states.sort()
      },
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Error fetching market prices:', error);
    res.status(500).json({ error: 'Failed to fetch market prices' });
  }
});

// Get price trends for a specific crop
router.get('/trends/:crop', async (req, res) => {
  try {
    const { crop } = req.params;
    const { days = 30, state, district } = req.query;

    const filter: any = {
      crop: new RegExp(crop, 'i'),
      date: {
        $gte: new Date(Date.now() - parseInt(days as string) * 24 * 60 * 60 * 1000)
      }
    };

    if (state) {
      filter.state = new RegExp(state as string, 'i');
    }

    if (district) {
      filter.district = new RegExp(district as string, 'i');
    }

    const trends = await MarketPrice.find(filter)
      .sort({ date: 1 })
      .select('date price market state district');

    res.json(trends);
  } catch (error) {
    console.error('Error fetching price trends:', error);
    res.status(500).json({ error: 'Failed to fetch price trends' });
  }
});

export default router;
