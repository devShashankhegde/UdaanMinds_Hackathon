import express from 'express';
import MandiPrice from '../models/MandiPrice.js';
import FarmerListing from '../models/FarmerListing.js';
import BuyerRequirement from '../models/BuyerRequirement.js';

const router = express.Router();

// Mandi Prices routes
router.get('/mandi-prices', async (req, res, next) => {
  try {
    const mandiPrices = await MandiPrice.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: mandiPrices
    });
  } catch (error) {
    next(error);
  }
});

router.post('/mandi-prices', async (req, res, next) => {
  try {
    const { mandiName, location, crop, grade, unit, minPrice, maxPrice, modalPrice } = req.body;
    
    if (!mandiName || !crop) {
      return res.status(400).json({
        success: false,
        message: 'Mandi name and crop are required'
      });
    }

    const mandiPrice = new MandiPrice({
      mandiName,
      location,
      crop,
      grade,
      unit,
      minPrice,
      maxPrice,
      modalPrice
    });

    const savedMandiPrice = await mandiPrice.save();
    res.status(201).json({
      success: true,
      data: savedMandiPrice
    });
  } catch (error) {
    next(error);
  }
});

// Farmer Listings routes
router.get('/farmer-listings', async (req, res, next) => {
  try {
    const { crop, grade, minPrice, maxPrice } = req.query;
    let query = {};
    
    if (crop) query.crop = crop;
    if (grade) query.grade = grade;
    if (minPrice || maxPrice) {
      query.pricePerUnit = {};
      if (minPrice) query.pricePerUnit.$gte = Number(minPrice);
      if (maxPrice) query.pricePerUnit.$lte = Number(maxPrice);
    }

    const farmerListings = await FarmerListing.find(query).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: farmerListings
    });
  } catch (error) {
    next(error);
  }
});

router.post('/farmer-listings', async (req, res, next) => {
  try {
    const { sellerName, crop, grade, quantity, unit, pricePerUnit, description } = req.body;
    
    if (!crop || !quantity || !pricePerUnit) {
      return res.status(400).json({
        success: false,
        message: 'Crop, quantity, and price per unit are required'
      });
    }

    const farmerListing = new FarmerListing({
      sellerName,
      crop,
      grade,
      quantity,
      unit,
      pricePerUnit,
      description
    });

    const savedFarmerListing = await farmerListing.save();
    res.status(201).json({
      success: true,
      data: savedFarmerListing
    });
  } catch (error) {
    next(error);
  }
});

// Buyer Requirements routes
router.get('/buyer-requirements', async (req, res, next) => {
  try {
    const buyerRequirements = await BuyerRequirement.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: buyerRequirements
    });
  } catch (error) {
    next(error);
  }
});

router.post('/buyer-requirements', async (req, res, next) => {
  try {
    const { buyerName, crop, grade, minQty, unit, maxPricePerUnit, notes } = req.body;
    
    if (!crop || !minQty || !maxPricePerUnit) {
      return res.status(400).json({
        success: false,
        message: 'Crop, minimum quantity, and maximum price per unit are required'
      });
    }

    const buyerRequirement = new BuyerRequirement({
      buyerName,
      crop,
      grade,
      minQty,
      unit,
      maxPricePerUnit,
      notes
    });

    const savedBuyerRequirement = await buyerRequirement.save();
    res.status(201).json({
      success: true,
      data: savedBuyerRequirement
    });
  } catch (error) {
    next(error);
  }
});

export default router;
