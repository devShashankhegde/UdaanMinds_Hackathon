import mongoose, { Document } from 'mongoose';
export interface IAnswer {
    author: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    votes: number;
}
export interface IQuestion extends Document {
    title: string;
    content: string;
    author: mongoose.Types.ObjectId;
    category: string;
    tags: string[];
    answers: IAnswer[];
    votes: number;
    views: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IQuestion, {}, {}, {}, mongoose.Document<unknown, {}, IQuestion> & IQuestion & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Question.d.ts.map