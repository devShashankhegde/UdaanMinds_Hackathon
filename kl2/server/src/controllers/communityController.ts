import { Request, Response } from 'express';
import Question, { IQuestion } from '../models/Question';
import { AuthRequest } from '../middleware/auth';

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string;
    const search = req.query.search as string;

    const query: any = {};
    if (category && category !== 'all') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { question: { $regex: search, $options: 'i' } }
      ];
    }

    const questions = await Question.find(query)
      .populate('userId', 'name location')
      .populate('answers.userId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Question.countDocuments(query);

    res.json({
      questions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { title, question, category, tags } = req.body;

    const newQuestion = new Question({
      userId: req.user?.userId,
      title,
      question,
      category,
      tags: tags || []
    });

    await newQuestion.save();
    await newQuestion.populate('userId', 'name location');

    res.status(201).json({
      message: 'Question created successfully',
      question: newQuestion
    });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getQuestion = async (req: Request, res: Response) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('userId', 'name location')
      .populate('answers.userId', 'name location');

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Increment views
    question.views += 1;
    await question.save();

    res.json({ question });
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const answerQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { answer } = req.body;
    const questionId = req.params.id;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    question.answers.push({
      userId: req.user?.userId as any,
      answer,
      isAccepted: false,
      votes: 0,
      createdAt: new Date()
    });

    await question.save();
    await question.populate('answers.userId', 'name location');

    res.status(201).json({
      message: 'Answer added successfully',
      question
    });
  } catch (error) {
    console.error('Answer question error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Check if user owns the question
    if (question.userId.toString() !== req.user?.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this question' });
    }

    await Question.findByIdAndDelete(req.params.id);

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
