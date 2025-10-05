import mongoose, { Schema } from 'mongoose'

const mv2Schema = new Schema({
    "title": { type: String }
}, { timestamps: true })

export default mongoose.models.Mv2 || mongoose.model('Mv2', mv2Schema)
