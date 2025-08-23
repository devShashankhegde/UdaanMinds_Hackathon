"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Question_1 = __importDefault(require("../models/Question"));
const schemas_1 = require("../validation/schemas");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get all questions
router.get('/questions', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const category = req.query.category;
        const skip = (page - 1) * limit;
        const filter = {};
        if (category && category !== 'all') {
            filter.category = category;
        }
        const questions = await Question_1.default.find(filter)
            .populate('author', 'username profile.fullName')
            .populate('answers.author', 'username profile.fullName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const total = await Question_1.default.countDocuments(filter);
        res.json({
            questions,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});
// Get single question
router.get('/questions/:id', async (req, res) => {
    try {
        const question = await Question_1.default.findById(req.params.id)
            .populate('author', 'username profile.fullName')
            .populate('answers.author', 'username profile.fullName');
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        // Increment views
        question.views += 1;
        await question.save();
        res.json(question);
    }
    catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ error: 'Failed to fetch question' });
    }
});
// Create new question
router.post('/questions', auth_1.isAuthenticated, async (req, res) => {
    try {
        const { error, value } = schemas_1.questionSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const question = new Question_1.default({
            ...value,
            author: req.user._id
        });
        await question.save();
        await question.populate('author', 'username profile.fullName');
        res.status(201).json(question);
    }
    catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ error: 'Failed to create question' });
    }
});
// Add answer to question
router.post('/questions/:id/answers', auth_1.isAuthenticated, async (req, res) => {
    try {
        const { error, value } = schemas_1.answerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const question = await Question_1.default.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        const answer = {
            author: req.user._id,
            content: value.content,
            createdAt: new Date(),
            votes: 0
        };
        question.answers.push(answer);
        await question.save();
        await question.populate('answers.author', 'username profile.fullName');
        res.status(201).json(question);
    }
    catch (error) {
        console.error('Error adding answer:', error);
        res.status(500).json({ error: 'Failed to add answer' });
    }
});
exports.default = router;
//# sourceMappingURL=community.js.map