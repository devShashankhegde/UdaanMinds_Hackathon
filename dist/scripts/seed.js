"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const seedData_1 = require("../data/seedData");
dotenv_1.default.config();
async function runSeed() {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/krishilink');
        console.log('Connected to MongoDB');
        await (0, seedData_1.seedDatabase)();
        await mongoose_1.default.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
    catch (error) {
        console.error('Seed script error:', error);
        process.exit(1);
    }
}
runSeed();
//# sourceMappingURL=seed.js.map