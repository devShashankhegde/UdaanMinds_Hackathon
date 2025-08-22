import mongoose, { Document, Schema } from 'mongoose';

export interface ITool extends Document {
  ownerId: mongoose.Types.ObjectId;
  toolName: string;
  category: 'tractor' | 'harvester' | 'plough' | 'sprayer' | 'other';
  toolType: 'rent' | 'sale';
  price: number;
  priceUnit: 'per_hour' | 'per_day' | 'total';
  description?: string;
  images: string[];
  condition: 'new' | 'good' | 'fair' | 'poor';
  availability: boolean;
  location: {
    state: string;
    district: string;
    village: string;
  };
  specifications: {
    brand?: string;
    model?: string;
    year?: number;
    power?: string;
  };
  createdAt: Date;
}

const ToolSchema: Schema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toolName: {
    type: String,
    required: [true, 'Tool name is required'],
    maxlength: [100, 'Tool name cannot be more than 100 characters']
  },
  category: {
    type: String,
    enum: ['tractor', 'harvester', 'plough', 'sprayer', 'other'],
    required: [true, 'Category is required']
  },
  toolType: {
    type: String,
    enum: ['rent', 'sale'],
    required: [true, 'Tool type is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  priceUnit: {
    type: String,
    enum: ['per_hour', 'per_day', 'total'],
    default: 'per_day'
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  images: [{
    type: String
  }],
  condition: {
    type: String,
    enum: ['new', 'good', 'fair', 'poor'],
    required: [true, 'Condition is required']
  },
  availability: {
    type: Boolean,
    default: true
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
  specifications: {
    brand: String,
    model: String,
    year: Number,
    power: String
  }
}, {
  timestamps: true
});

export default mongoose.model<ITool>('Tool', ToolSchema);
