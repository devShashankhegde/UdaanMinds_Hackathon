import mongoose from 'mongoose';

const laborServiceSchema = new mongoose.Schema({
  providerName: String,
  serviceType: {
    type: String,
    required: true
  },
  rateType: String,
  rate: {
    type: Number,
    required: true
  },
  location: String
}, {
  timestamps: true
});

export default mongoose.model('LaborService', laborServiceSchema);
