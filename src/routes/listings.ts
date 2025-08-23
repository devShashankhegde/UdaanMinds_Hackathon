import express from 'express';
import multer from 'multer';
import path from 'path';
import Listing from '../models/Listing';
import { listingSchema } from '../validation/schemas';
import { isAuthenticated, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all listings
router.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const {
      category,
      state,
      district,
      minPrice,
      maxPrice,
      search,
      page = 1,
      limit = 12
    } = req.query;

    const filter: any = { status: 'active' };

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (state) {
      filter['location.state'] = new RegExp(state as string, 'i');
    }

    if (district) {
      filter['location.district'] = new RegExp(district as string, 'i');
    }

    if (minPrice || maxPrice) {
      filter['price.amount'] = {};
      if (minPrice) {
        filter['price.amount'].$gte = parseFloat(minPrice as string);
      }
      if (maxPrice) {
        filter['price.amount'].$lte = parseFloat(maxPrice as string);
      }
    }

    if (search) {
      filter.$or = [
        { title: new RegExp(search as string, 'i') },
        { description: new RegExp(search as string, 'i') },
        { subcategory: new RegExp(search as string, 'i') }
      ];
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const listings = await Listing.find(filter)
      .populate('seller', 'username profile.fullName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string));

    const total = await Listing.countDocuments(filter);

    res.json({
      listings,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// Get single listing
router.get('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('seller', 'username profile.fullName profile.phone');

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json(listing);
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
});

// Create new listing
router.post('/', isAuthenticated, upload.array('images', 5), async (req: AuthenticatedRequest, res) => {
  try {
    const { error, value } = listingSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const images = (req.files as Express.Multer.File[])?.map(file => `/uploads/${file.filename}`) || [];

    const listing = new Listing({
      ...value,
      images,
      seller: req.user._id
    });

    await listing.save();
    await listing.populate('seller', 'username profile.fullName');

    res.status(201).json(listing);
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// Update listing
router.put('/:id', isAuthenticated, upload.array('images', 5), async (req: AuthenticatedRequest, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this listing' });
    }

    const { error, value } = listingSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const newImages = (req.files as Express.Multer.File[])?.map(file => `/uploads/${file.filename}`) || [];
    
    Object.assign(listing, value);
    if (newImages.length > 0) {
      listing.images = [...listing.images, ...newImages];
    }

    await listing.save();
    await listing.populate('seller', 'username profile.fullName');

    res.json(listing);
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

// Delete listing
router.delete('/:id', isAuthenticated, async (req: AuthenticatedRequest, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this listing' });
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

// Get user's listings
router.get('/user/my-listings', isAuthenticated, async (req: AuthenticatedRequest, res) => {
  try {
    const listings = await Listing.find({ seller: req.user._id })
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    console.error('Error fetching user listings:', error);
    res.status(500).json({ error: 'Failed to fetch user listings' });
  }
});

export default router;
