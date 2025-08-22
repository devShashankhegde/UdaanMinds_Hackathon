import express from 'express';
import { getTools, createTool, getTool, updateTool, deleteTool, getUserTools } from '../controllers/serviceController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/tools', getTools);
router.post('/tools', authenticateToken, createTool);
router.get('/tools/my-tools', authenticateToken, getUserTools);
router.get('/tools/:id', getTool);
router.put('/tools/:id', authenticateToken, updateTool);
router.delete('/tools/:id', authenticateToken, deleteTool);

export default router;
