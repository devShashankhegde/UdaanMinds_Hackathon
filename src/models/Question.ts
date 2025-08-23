import mongoose, { Document, Schema } from 'mongoose';

export interface IAnswer {
  author: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  votes: number;
}

export interface IQuestion extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  category: string;
  tags: string[];
  answers: IAnswer[];
  votes: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const answerSchema = new Schema<IAnswer>({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  votes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const questionSchema = new Schema<IQuestion>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['crops', 'livestock', 'equipment', 'weather', 'pest_control', 'soil', 'irrigation', 'marketing', 'general']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  answers: [answerSchema],
  votes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model<IQuestion>('Question', questionSchema);
