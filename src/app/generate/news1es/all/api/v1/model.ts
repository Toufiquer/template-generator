import mongoose, { Schema } from 'mongoose'

const news1Schema = new Schema({
    "title1": { type: String, required: true },
    "title2": { type: String, required: true },
    "title3": { type: String, required: true },
    "title4": { type: String, required: true },
    "title5": { type: String, required: true },
    "title6": { type: String, required: true }
}, { timestamps: true })

export default mongoose.models.News1 || mongoose.model('News1', news1Schema)
 
