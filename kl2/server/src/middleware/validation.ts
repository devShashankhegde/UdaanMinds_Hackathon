import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 50 characters'
    }),
    email: Joi.string().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Please enter a valid email address'
    }),
    password: Joi.string().min(6).required().messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters'
    }),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Please enter a valid 10-digit phone number'
    }),
    userType: Joi.string().valid('seller', 'buyer', 'both').required().messages({
      'any.only': 'User type must be seller, buyer, or both',
      'string.empty': 'User type is required'
    }),
    location: Joi.object({
      state: Joi.string().required().messages({
        'string.empty': 'State is required'
      }),
      district: Joi.string().required().messages({
        'string.empty': 'District is required'
      }),
      village: Joi.string().required().messages({
        'string.empty': 'Village is required'
      })
    }).required()
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors,
      message: errors[0]
    });
  }
  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const validateQuestion = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(200).required(),
    question: Joi.string().min(10).max(2000).required(),
    category: Joi.string().valid('farming', 'pricing', 'tools', 'weather', 'other'),
    tags: Joi.array().items(Joi.string().max(50))
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const validateListing = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    cropType: Joi.string().max(100).required(),
    variety: Joi.string().max(100),
    quantity: Joi.number().min(0.1).required(),
    unit: Joi.string().valid('kg', 'quintal', 'ton'),
    quality: Joi.string().valid('Grade A', 'Grade B', 'Grade C').required(),
    expectedPrice: Joi.number().min(0).required(),
    negotiable: Joi.boolean(),
    description: Joi.string().max(1000),
    harvestDate: Joi.date(),
    location: Joi.object({
      state: Joi.string().required(),
      district: Joi.string().required(),
      village: Joi.string().required()
    }).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
