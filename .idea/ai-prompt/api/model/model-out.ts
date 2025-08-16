import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema({
    title1: {
        type: String,
        required: true,
    },
    title2: {
        type: String,
        required: true,
    },
    'chief-executive-officer-ceo1': {
        title1: {
            type: String,
            required: true,
        },
        title2: {
            type: String,
            required: true,
        },
    },
    'chief-executive-officer-ceo2': {
        title1: {
            type: String,
            required: true,
        },
        title2: {
            type: String,
            required: true,
        },
    },
})

export default mongoose.models.Post || mongoose.model('Post', postSchema)

export interface IPosts {
    title1: string
    title2: string
    'chief-executive-officer-ceo1': {
        title1: string
        title2: string
    }
    'chief-executive-officer-ceo2': {
        title1: string
        title2: string
    }
    createdAt: Date
    updatedAt: Date
    _id: string
}
export const defaultPosts = {
    title1: '',
    title2: '',
    'chief-executive-officer-ceo1': {
        title1: '',
        title2: '',
    },
    'chief-executive-officer-ceo2': {
        title1: '',
        title2: '',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
