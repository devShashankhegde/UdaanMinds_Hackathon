import mongoose, { Document, Schema } from 'mongoose';

export interface IListing extends Document {
  title: string;
  description: string;
  category: 'crop' | 'tool' | 'labor' | 'storage';
  subcategory: string;
  price: {
    amount: number;
    unit: string;
    negotiable: boolean;
  };
  location: {
    state: string;
    district: string;
    pincode?: string;
  };
  contact: {
    phone: string;
    email?: string;
  };
  images: string[];
  seller: mongoose.Types.ObjectId;
  status: 'active' | 'sold' | 'inactive';
  specifications?: {
    [key: string]: string;
  };
  availability: {
    from: Date;
    to?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const listingSchema = new Schema<IListing>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ['crop', 'tool', 'labor', 'storage']
  },
  subcategory: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      required: true,
      trim: true
    },
    negotiable: {
      type: Boolean,
      default: true
    }
  },
  location: {
    state: {
      type: String,
      required: true,
      trim: true
    },
    district: {
      type: String,
      required: true,
      trim: true
    },
    pincode: {
      type: String,
      trim: true
    }
  },
  contact: {
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    }
  },
  images: [{
    type: String,
    trim: true
  }],
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'inactive'],
    default: 'active'
  },
  specifications: {
    type: Map,
    of: String
  },
  availability: {
    from: {
      type: Date,
      required: true
    },
    to: {
      type: Date
    }
  }
}, {
  timestamps: true
});

export default mongoose.model<IListing>('Listing', listingSchema);
