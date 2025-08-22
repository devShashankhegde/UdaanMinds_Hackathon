import mongoose from 'mongoose';

const toolAssetSchema = new mongoose.Schema({
  ownerName: String,
  name: {
    type: String,
    required: true
  },
  category: String,
  hourlyRate: Number,
  location: String
}, {
  timestamps: true
});

export default mongoose.model('ToolAsset', toolAssetSchema);
