import mongoose, { Schema, Document } from 'mongoose';

const blogSchema = new Schema(
    {
    title1: { type: String, required: true, trim: true },
    title2: { type: String, required: true, trim: true },
    'manager-md1': {
        title1: { type: String, required: true, trim: true },
        title2: { type: String, required: true, trim: true }
    },
    'manager-md2': {
        title1: { type: String, required: true, trim: true },
        title2: { type: String, required: true, trim: true }
    }
    },
    { timestamps: true }
);

export default mongoose.models.Blog ||
    mongoose.model('Blog', blogSchema);

export interface IBlogs extends Document {
    title1: string;
    title2: string;
    'manager-md1': {
        title1: string;
        title2: string
    };
    'manager-md2': {
        title1: string;
        title2: string
    };
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}