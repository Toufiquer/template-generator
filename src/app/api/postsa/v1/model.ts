import mongoose, { Schema } from 'mongoose'

const postaSchema = new Schema({
    "title": { type: String },
    "students": [
            {
                "Name": { type: String },
                "Class": { type: String },
                "Roll": { type: String }
            }
        ],
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
