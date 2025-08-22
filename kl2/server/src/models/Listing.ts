import mongoose, { Document, Schema } from 'mongoose';

export interface IListing extends Document {
  sellerId: mongoose.Types.ObjectId;
  cropType: string;
  variety?: string;
  quantity: number;
  unit: 'kg' | 'quintal' | 'ton';
  quality: 'Grade A' | 'Grade B' | 'Grade C';
  expectedPrice: number;
  negotiable: boolean;
  images: string[];
  description?: string;
  harvestDate?: Date;
  location: {
    state: string;
    district: string;
    village: string;
  };
  status: 'active' | 'sold' | 'expired' | 'removed';
  views: number;
  contactCount: number;
  expiryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema: Schema = new Schema({
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cropType: {
    type: String,
    required: [true, 'Crop type is required'],
    maxlength: [100, 'Crop type cannot be more than 100 characters']
  },
  variety: {
    type: String,
    maxlength: [100, 'Variety cannot be more than 100 characters']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0.1, 'Quantity must be at least 0.1']
  },
  unit: {
    type: String,
    enum: ['kg', 'quintal', 'ton'],
    default: 'kg'
  },
  quality: {
    type: String,
    enum: ['Grade A', 'Grade B', 'Grade C'],
    required: [true, 'Quality is required']
  },
  expectedPrice: {
    type: Number,
    required: [true, 'Expected price is required'],
    min: [0, 'Price must be positive']
  },
  negotiable: {
    type: Boolean,
    default: true
  },
  images: [{
    type: String
  }],
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  harvestDate: {
    type: Date
  },
  location: {
    state: {
      type: String,
      required: [true, 'State is required']
    },
    district: {
      type: String,
      required: [true, 'District is required']
    },
    village: {
      type: String,
      required: [true, 'Village is required']
    }
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'expired', 'removed'],
    default: 'active'
  },
  views: {
    type: Number,
    default: 0
  },
  contactCount: {
    type: Number,
    default: 0
  },
  expiryDate: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  }
}, {
  timestamps: true
});

export default mongoose.model<IListing>('Listing', ListingSchema);
