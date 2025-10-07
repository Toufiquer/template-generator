import mongoose, { Schema } from 'mongoose'

const postaSchema = new Schema({
    "complexValue": {
        "id": { type: String },
        "title": { type: String },
        "parent": {
            "id": { type: String },
            "title": { type: String },
            "child": {
                "id": { type: String },
                "title": { type: String },
                "child": { type: String },
                "note": { type: String }
            },
            "note": { type: String }
        },
        "note": { type: String }
    }
}, { timestamps: true })

export default mongoose.models.Posta || mongoose.model('Posta', postaSchema)
