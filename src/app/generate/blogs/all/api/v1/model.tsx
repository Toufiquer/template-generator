import mongoose, { Schema, Document } from 'mongoose';

const blogsSchema = new Schema(
    {
    title: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^w+([\.-]?w+)*@w+([\.-]?w+)*(\.w{2,3})+$/, 'Please fill a valid email address']
    },
    password: { type: String, required: true, select: false },
    passcode: { type: String, required: true, select: false },
    area: { type: String, required: true },
    'books-list': [{ type: String }],
    'check-list': [{ type: Schema.Types.ObjectId, ref: 'AnotherModel' }],
    'sub-area': { type: Schema.Types.ObjectId, ref: 'AnotherModel' },
    'products-images': [{ type: String }],
    'personal-image': { type: String },
    description: { type: String, trim: true },
    age: {
        type: Number,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value'
        }
    },
    amount: { type: Number },
    isActive: { type: Boolean, default: false },
    'start-date': { type: Date, default: Date.now },
    'start-time': { type: String },
    'schedule-date': { start: { type: Date }, end: { type: Date } },
    'schedule-time': { start: { type: String }, end: { type: String } },
    'favorite-color': { type: String, match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please fill a valid color hex code'] },
    number: { type: String },
    profile: { type: String, trim: true },
    test: { type: String },
    info: { type: String },
    shift: { type: String },
    policy: { type: Boolean, default: false },
    hobbys: [{ type: String }]
    },
    { timestamps: true }
);

export default mongoose.models.Blog ||
    mongoose.model('Blog', blogsSchema);

export interface IBlogs extends Document {
    title: string;
    email: string;
    password: string;
    passcode: string;
    area: string;
    'books-list': string[];
    'check-list': any[];
    'sub-area': any;
    'products-images': string[];
    'personal-image': string;
    description: string;
    age: number;
    amount: number;
    isActive: boolean;
    'start-date': Date;
    'start-time': string;
    'schedule-date': { start: Date; end: Date; };
    'schedule-time': { start: string; end: string; };
    'favorite-color': string;
    number: string;
    profile: string;
    test: string;
    info: string;
    shift: string;
    policy: boolean;
    hobbys: string[];
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}