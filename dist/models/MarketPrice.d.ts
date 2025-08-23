import mongoose, { Document } from 'mongoose';
export interface IMarketPrice extends Document {
    crop: string;
    variety?: string;
    market: string;
    state: string;
    district: string;
    price: {
        min: number;
        max: number;
        modal: number;
        unit: string;
    };
    date: Date;
    source: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IMarketPrice, {}, {}, {}, mongoose.Document<unknown, {}, IMarketPrice> & IMarketPrice & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=MarketPrice.d.ts.map