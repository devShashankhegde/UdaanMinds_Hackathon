import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('farmer', 'buyer', 'service_provider').required(),
  profile: Joi.object({
    fullName: Joi.string().required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/),
    location: Joi.string(),
    farmSize: Joi.string(),
    cropTypes: Joi.array().items(Joi.string())
  }).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const questionSchema = Joi.object({
  title: Joi.string().max(200).required(),
  content: Joi.string().required(),
  category: Joi.string().valid('crops', 'livestock', 'equipment', 'weather', 'pest_control', 'soil', 'irrigation', 'marketing', 'general').required(),
  tags: Joi.array().items(Joi.string())
});

export const answerSchema = Joi.object({
  content: Joi.string().required()
});

export const listingSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().max(1000).required(),
  category: Joi.string().valid('crop', 'tool', 'labor', 'storage').required(),
  subcategory: Joi.string().required(),
  price: Joi.object({
    amount: Joi.number().min(0).required(),
    unit: Joi.string().required(),
    negotiable: Joi.boolean()
  }).required(),
  location: Joi.object({
    state: Joi.string().required(),
    district: Joi.string().required(),
    pincode: Joi.string()
  }).required(),
  contact: Joi.object({
    phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
    email: Joi.string().email()
  }).required(),
  specifications: Joi.object(),
  availability: Joi.object({
    from: Joi.date().required(),
    to: Joi.date()
  }).required()
});
