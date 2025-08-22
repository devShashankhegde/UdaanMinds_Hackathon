import mongoose, { Document, Schema } from 'mongoose';

interface IAnswer {
  userId: mongoose.Types.ObjectId;
  answer: string;
  isAccepted: boolean;
  votes: number;
  createdAt: Date;
}

export interface IQuestion extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  question: string;
  category: 'farming' | 'pricing' | 'tools' | 'weather' | 'other';
  tags: string[];
  answers: IAnswer[];
  views: number;
  votes: number;
  isResolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AnswerSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
    maxlength: [2000, 'Answer cannot be more than 2000 characters']
  },
  isAccepted: {
    type: Boolean,
    default: false
  },
  votes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const QuestionSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  question: {
    type: String,
    required: [true, 'Question is required'],
    maxlength: [2000, 'Question cannot be more than 2000 characters']
  },
  category: {
    type: String,
    enum: ['farming', 'pricing', 'tools', 'weather', 'other'],
    default: 'other'
  },
  tags: [{
    type: String,
    maxlength: [50, 'Tag cannot be more than 50 characters']
  }],
  answers: [AnswerSchema],
  views: {
    type: Number,
    default: 0
  },
  votes: {
    type: Number,
    default: 0
  },
  isResolved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model<IQuestion>('Question', QuestionSchema);
