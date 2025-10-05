import mongoose, { Schema } from 'mongoose'

const mvSchema = new Schema({
    "title": { type: String }
}, { timestamps: true })

export default mongoose.models.Mv || mongoose.model('Mv', mvSchema)
