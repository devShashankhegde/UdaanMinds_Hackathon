import mongoose from 'mongoose';

const farmManagementServiceSchema = new mongoose.Schema({
  managerName: String,
  serviceModel: String,
  feeOrShare: String,
  cropsSupported: [String]
}, {
  timestamps: true
});

export default mongoose.model('FarmManagementService', farmManagementServiceSchema);
