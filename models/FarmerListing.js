import mongoose from 'mongoose';

const farmerListingSchema = new mongoose.Schema({
  sellerName: String,
  crop: {
    type: String,
    required: true
  },
  grade: String,
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: 'kg'
  },
  pricePerUnit: {
    type: Number,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['ACTIVE', 'SOLD', 'EXPIRED'],
    default: 'ACTIVE'
  }
}, {
  timestamps: true
});

export default mongoose.model('FarmerListing', farmerListingSchema);
