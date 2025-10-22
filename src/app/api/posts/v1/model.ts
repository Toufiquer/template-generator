import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema({
    "title": { type: String },
    "area": { type: String, enum: ['Bangladesh', 'India', 'Pakistan', 'Canada'] },
    "sub-area": [{ type: String }],
    "isActive": { type: Boolean, default: false },
    "policy": { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.models.Post || mongoose.model('Post', postSchema)
