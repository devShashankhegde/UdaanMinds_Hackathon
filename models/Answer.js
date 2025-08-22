import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  body: {
    type: String,
    required: true
  },
  authorName: String
}, {
  timestamps: true
});

export default mongoose.model('Answer', answerSchema);
