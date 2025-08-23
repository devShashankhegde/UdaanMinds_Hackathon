import mongoose, { Document, Schema } from 'mongoose';

export interface IMarketPrice extends Document {
  crop: string;
  variety?: string;
  market: string;
  state: string;
  district: string;
  price: {
    min: number;
    max: number;
    modal: number;
    unit: string;
  };
  date: Date;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

const marketPriceSchema = new Schema<IMarketPrice>({
  crop: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  variety: {
    type: String,
    trim: true
  },
  market: {
    type: String,
    required: true,
    trim: true
  },
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
  price: {
    min: {
      type: Number,
      required: true,
      min: 0
    },
    max: {
      type: Number,
      required: true,
      min: 0
    },
    modal: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      required: true,
      default: 'per quintal'
    }
  },
  date: {
    type: Date,
    required: true
  },
  source: {
    type: String,
    required: true,
    default: 'manual'
  }
}, {
  timestamps: true
});

// Index for efficient queries
marketPriceSchema.index({ crop: 1, date: -1 });
marketPriceSchema.index({ state: 1, district: 1, date: -1 });

export default mongoose.model<IMarketPrice>('MarketPrice', marketPriceSchema);
