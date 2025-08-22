import mongoose from 'mongoose';

const mandiPriceSchema = new mongoose.Schema({
  mandiName: {
    type: String,
    required: true
  },
  location: String,
  crop: {
    type: String,
    required: true
  },
  grade: String,
  unit: {
    type: String,
    default: 'kg'
  },
  minPrice: Number,
  maxPrice: Number,
  modalPrice: Number,
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('MandiPrice', mandiPriceSchema);
