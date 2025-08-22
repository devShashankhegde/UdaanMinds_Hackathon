import mongoose from 'mongoose';

const buyerRequirementSchema = new mongoose.Schema({
  buyerName: String,
  crop: {
    type: String,
    required: true
  },
  grade: String,
  minQty: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: 'kg'
  },
  maxPricePerUnit: {
    type: Number,
    required: true
  },
  notes: String,
  status: {
    type: String,
    enum: ['OPEN', 'FULFILLED', 'EXPIRED'],
    default: 'OPEN'
  }
}, {
  timestamps: true
});

export default mongoose.model('BuyerRequirement', buyerRequirementSchema);
