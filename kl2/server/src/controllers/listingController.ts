import { Request, Response } from 'express';
import Listing, { IListing } from '../models/Listing';
import { AuthRequest } from '../middleware/auth';

export const getListings = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const cropType = req.query.cropType as string;
    const quality = req.query.quality as string;
    const state = req.query.state as string;
    const district = req.query.district as string;
    const minPrice = req.query.minPrice as string;
    const maxPrice = req.query.maxPrice as string;

    const query: any = { status: 'active' };
    
    if (cropType) {
      query.cropType = { $regex: cropType, $options: 'i' };
    }
    if (quality) {
      query.quality = quality;
    }
    if (state) {
      query['location.state'] = { $regex: state, $options: 'i' };
    }
    if (district) {
      query['location.district'] = { $regex: district, $options: 'i' };
    }
    if (minPrice || maxPrice) {
      query.expectedPrice = {};
      if (minPrice) query.expectedPrice.$gte = parseFloat(minPrice);
      if (maxPrice) query.expectedPrice.$lte = parseFloat(maxPrice);
    }

    const listings = await Listing.find(query)
      .populate('sellerId', 'name phone location')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Listing.countDocuments(query);

    res.json({
      listings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createListing = async (req: AuthRequest, res: Response) => {
  try {
    const listingData = {
      ...req.body,
      sellerId: req.user?.userId
    };

    const listing = new Listing(listingData);
    await listing.save();
    await listing.populate('sellerId', 'name phone location');

    res.status(201).json({
      message: 'Listing created successfully',
      listing
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getListing = async (req: Request, res: Response) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('sellerId', 'name phone location');

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Increment views
    listing.views += 1;
    await listing.save();

    res.json({ listing });
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateListing = async (req: AuthRequest, res: Response) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Check if user owns the listing
    if (listing.sellerId.toString() !== req.user?.userId) {
      return res.status(403).json({ error: 'Not authorized to update this listing' });
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('sellerId', 'name phone location');

    res.json({
      message: 'Listing updated successfully',
      listing: updatedListing
    });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteListing = async (req: AuthRequest, res: Response) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Check if user owns the listing
    if (listing.sellerId.toString() !== req.user?.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this listing' });
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getSellerListings = async (req: AuthRequest, res: Response) => {
  try {
    const listings = await Listing.find({ sellerId: req.user?.userId })
      .sort({ createdAt: -1 });

    res.json({ listings });
  } catch (error) {
    console.error('Get seller listings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const contactSeller = async (req: AuthRequest, res: Response) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('sellerId', 'name phone email');

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Increment contact count
    listing.contactCount += 1;
    await listing.save();

    // Type assertion for populated sellerId
    const seller = listing.sellerId as any;

    res.json({
      message: 'Contact information retrieved',
      seller: {
        name: seller.name,
        phone: seller.phone,
        email: seller.email
      }
    });
  } catch (error) {
    console.error('Contact seller error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
