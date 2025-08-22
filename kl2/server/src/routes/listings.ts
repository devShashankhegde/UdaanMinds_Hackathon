import express from 'express';
import { getListings, createListing, getListing, updateListing, deleteListing, getSellerListings, contactSeller } from '../controllers/listingController';
import { validateListing } from '../middleware/validation';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = express.Router();

router.get('/', getListings);
router.post('/', authenticateToken, authorizeRole(['seller', 'both']), validateListing, createListing);
router.get('/my-listings', authenticateToken, getSellerListings);
router.get('/:id', getListing);
router.put('/:id', authenticateToken, updateListing);
router.delete('/:id', authenticateToken, deleteListing);
router.post('/:id/contact', authenticateToken, authorizeRole(['buyer', 'both']), contactSeller);

export default router;
