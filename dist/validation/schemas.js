"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listingSchema = exports.answerSchema = exports.questionSchema = exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerSchema = joi_1.default.object({
    username: joi_1.default.string().alphanum().min(3).max(30).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
    role: joi_1.default.string().valid('farmer', 'buyer', 'service_provider').required(),
    profile: joi_1.default.object({
        fullName: joi_1.default.string().required(),
        phone: joi_1.default.string().pattern(/^[0-9]{10}$/),
        location: joi_1.default.string(),
        farmSize: joi_1.default.string(),
        cropTypes: joi_1.default.array().items(joi_1.default.string())
    }).required()
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required()
});
exports.questionSchema = joi_1.default.object({
    title: joi_1.default.string().max(200).required(),
    content: joi_1.default.string().required(),
    category: joi_1.default.string().valid('crops', 'livestock', 'equipment', 'weather', 'pest_control', 'soil', 'irrigation', 'marketing', 'general').required(),
    tags: joi_1.default.array().items(joi_1.default.string())
});
exports.answerSchema = joi_1.default.object({
    content: joi_1.default.string().required()
});
exports.listingSchema = joi_1.default.object({
    title: joi_1.default.string().max(100).required(),
    description: joi_1.default.string().max(1000).required(),
    category: joi_1.default.string().valid('crop', 'tool', 'labor', 'storage').required(),
    subcategory: joi_1.default.string().required(),
    price: joi_1.default.object({
        amount: joi_1.default.number().min(0).required(),
        unit: joi_1.default.string().required(),
        negotiable: joi_1.default.boolean()
    }).required(),
    location: joi_1.default.object({
        state: joi_1.default.string().required(),
        district: joi_1.default.string().required(),
        pincode: joi_1.default.string()
    }).required(),
    contact: joi_1.default.object({
        phone: joi_1.default.string().pattern(/^[0-9]{10}$/).required(),
        email: joi_1.default.string().email()
    }).required(),
    specifications: joi_1.default.object(),
    availability: joi_1.default.object({
        from: joi_1.default.date().required(),
        to: joi_1.default.date()
    }).required()
});
//# sourceMappingURL=schemas.js.map