import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema({
    "student": { type: String, required: true },
    "admin": { type: String, required: true },
    "moderator": { type: String, required: true },
    "mentor": { type: String, required: true },
    "instructor": { type: String, required: true }
}, { timestamps: true })

export default mongoose.models.Post || mongoose.model('Post', postSchema)

export interface IPosts {
    "student": string;
    "admin": string;
    "moderator": string;
    "mentor": string;
    "instructor": string;
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const defaultPosts = {
    "student": '',
    "admin": '',
    "moderator": '',
    "mentor": '',
    "instructor": '',
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
