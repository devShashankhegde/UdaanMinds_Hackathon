import mongoose, { Document } from 'mongoose';
export interface IListing extends Document {
    title: string;
    description: string;
    category: 'crop' | 'tool' | 'labor' | 'storage';
    subcategory: string;
    price: {
        amount: number;
        unit: string;
        negotiable: boolean;
    };
    location: {
        state: string;
        district: string;
        pincode?: string;
    };
    contact: {
        phone: string;
        email?: string;
    };
    images: string[];
    seller: mongoose.Types.ObjectId;
    status: 'active' | 'sold' | 'inactive';
    specifications?: {
        [key: string]: string;
    };
    availability: {
        from: Date;
        to?: Date;
    };
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IListing, {}, {}, {}, mongoose.Document<unknown, {}, IListing> & IListing & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Listing.d.ts.map