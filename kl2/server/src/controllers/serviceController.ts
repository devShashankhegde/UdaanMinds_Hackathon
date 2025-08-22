import { Request, Response } from 'express';
import Tool, { ITool } from '../models/Tool';
import { AuthRequest } from '../middleware/auth';

export const getTools = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const category = req.query.category as string;
    const toolType = req.query.toolType as string;
    const state = req.query.state as string;

    const query: any = { availability: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    if (toolType && toolType !== 'all') {
      query.toolType = toolType;
    }
    if (state) {
      query['location.state'] = { $regex: state, $options: 'i' };
    }

    const tools = await Tool.find(query)
      .populate('ownerId', 'name phone location')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Tool.countDocuments(query);

    res.json({
      tools,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get tools error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createTool = async (req: AuthRequest, res: Response) => {
  try {
    const toolData = {
      ...req.body,
      ownerId: req.user?.userId
    };

    const tool = new Tool(toolData);
    await tool.save();
    await tool.populate('ownerId', 'name phone location');

    res.status(201).json({
      message: 'Tool listing created successfully',
      tool
    });
  } catch (error) {
    console.error('Create tool error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getTool = async (req: Request, res: Response) => {
  try {
    const tool = await Tool.findById(req.params.id)
      .populate('ownerId', 'name phone location');

    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }

    res.json({ tool });
  } catch (error) {
    console.error('Get tool error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateTool = async (req: AuthRequest, res: Response) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }

    // Check if user owns the tool
    if (tool.ownerId.toString() !== req.user?.userId) {
      return res.status(403).json({ error: 'Not authorized to update this tool' });
    }

    const updatedTool = await Tool.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('ownerId', 'name phone location');

    res.json({
      message: 'Tool updated successfully',
      tool: updatedTool
    });
  } catch (error) {
    console.error('Update tool error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteTool = async (req: AuthRequest, res: Response) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }

    // Check if user owns the tool
    if (tool.ownerId.toString() !== req.user?.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this tool' });
    }

    await Tool.findByIdAndDelete(req.params.id);

    res.json({ message: 'Tool deleted successfully' });
  } catch (error) {
    console.error('Delete tool error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getUserTools = async (req: AuthRequest, res: Response) => {
  try {
    const tools = await Tool.find({ ownerId: req.user?.userId })
      .sort({ createdAt: -1 });

    res.json({ tools });
  } catch (error) {
    console.error('Get user tools error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
