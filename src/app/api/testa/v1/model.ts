import mongoose, { Schema } from 'mongoose'

const testaSchema = new Schema(
    {
        title: { type: String },
        students: [
            {
                Name: { type: String },
                Class: { type: String },
                Roll: { type: Number },
            },
        ],
    },
    { timestamps: true }
)

export default mongoose.models.Testa || mongoose.model('Testa', testaSchema)
