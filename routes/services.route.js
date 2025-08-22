import express from 'express';
import ToolAsset from '../models/ToolAsset.js';
import LaborService from '../models/LaborService.js';
import FarmManagementService from '../models/FarmManagementService.js';

const router = express.Router();

// Tools routes
router.get('/tools', async (req, res, next) => {
  try {
    const tools = await ToolAsset.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: tools
    });
  } catch (error) {
    next(error);
  }
});

router.post('/tools', async (req, res, next) => {
  try {
    const { ownerName, name, category, hourlyRate, location } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Tool name is required'
      });
    }

    const tool = new ToolAsset({
      ownerName,
      name,
      category,
      hourlyRate,
      location
    });

    const savedTool = await tool.save();
    res.status(201).json({
      success: true,
      data: savedTool
    });
  } catch (error) {
    next(error);
  }
});

// Labor routes
router.get('/labor', async (req, res, next) => {
  try {
    const laborServices = await LaborService.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: laborServices
    });
  } catch (error) {
    next(error);
  }
});

router.post('/labor', async (req, res, next) => {
  try {
    const { providerName, serviceType, rateType, rate, location } = req.body;
    
    if (!serviceType || !rate) {
      return res.status(400).json({
        success: false,
        message: 'Service type and rate are required'
      });
    }

    const laborService = new LaborService({
      providerName,
      serviceType,
      rateType,
      rate,
      location
    });

    const savedLaborService = await laborService.save();
    res.status(201).json({
      success: true,
      data: savedLaborService
    });
  } catch (error) {
    next(error);
  }
});

// Management routes
router.get('/management', async (req, res, next) => {
  try {
    const managementServices = await FarmManagementService.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: managementServices
    });
  } catch (error) {
    next(error);
  }
});

router.post('/management', async (req, res, next) => {
  try {
    const { managerName, serviceModel, feeOrShare, cropsSupported } = req.body;

    const managementService = new FarmManagementService({
      managerName,
      serviceModel,
      feeOrShare,
      cropsSupported
    });

    const savedManagementService = await managementService.save();
    res.status(201).json({
      success: true,
      data: savedManagementService
    });
  } catch (error) {
    next(error);
  }
});

export default router;
