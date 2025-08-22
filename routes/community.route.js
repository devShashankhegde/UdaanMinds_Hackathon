import express from 'express';
import Question from '../models/Question.js';
import Answer from '../models/Answer.js';

const router = express.Router();

// GET /questions - list all questions
router.get('/questions', async (req, res, next) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: questions
    });
  } catch (error) {
    next(error);
  }
});

// POST /questions - create question
router.post('/questions', async (req, res, next) => {
  try {
    const { title, body, tags, authorName } = req.body;
    
    if (!title || !body) {
      return res.status(400).json({
        success: false,
        message: 'Title and body are required'
      });
    }

    const question = new Question({
      title,
      body,
      tags,
      authorName
    });

    const savedQuestion = await question.save();
    res.status(201).json({
      success: true,
      data: savedQuestion
    });
  } catch (error) {
    next(error);
  }
});

// GET /questions/:id - get question by id
router.get('/questions/:id', async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    
    res.json({
      success: true,
      data: question
    });
  } catch (error) {
    next(error);
  }
});

// POST /questions/:id/answers - create answer
router.post('/questions/:id/answers', async (req, res, next) => {
  try {
    const { body, authorName } = req.body;
    
    if (!body) {
      return res.status(400).json({
        success: false,
        message: 'Answer body is required'
      });
    }

    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    const answer = new Answer({
      question: req.params.id,
      body,
      authorName
    });

    const savedAnswer = await answer.save();
    
    // Increment answers count
    await Question.findByIdAndUpdate(req.params.id, {
      $inc: { answersCount: 1 }
    });

    res.status(201).json({
      success: true,
      data: savedAnswer
    });
  } catch (error) {
    next(error);
  }
});

// GET /questions/:id/answers - list answers for a question
router.get('/questions/:id/answers', async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    const answers = await Answer.find({ question: req.params.id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: answers
    });
  } catch (error) {
    next(error);
  }
});

export default router;
