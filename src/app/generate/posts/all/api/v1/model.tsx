import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema({
    "title": { type: String, required: true },
    "email": {
                    type: String,
                    required: true,
                    unique: true,
                    match: [/^w+([\.-]?w+)*@w+([\.-]?w+)*(.w{2,3})+$/, 'Please enter a valid email'],
                },
    "password": { type: String, required: true, select: false },
    "passcode": { type: String, required: true, select: false },
    "area": { type: String, required: true, enum: ['Option 1', 'Option 2'] },
    "books-list": { type: String, required: true },
    "check-list": { type: String, required: true },
    "sub-area": { type: Schema.Types.ObjectId, ref: 'AnotherModel' },
    "products-images": [{ type: String }],
    "personal-image": { type: String },
    "description": { type: String, trim: true },
    "age": { type: Number, validate: { validator: Number.isInteger, message: '{VALUE} is not an integer value' } },
    "amount": { type: Number },
    "isActive": { type: Boolean, default: false },
    "start-date": { type: Date, default: Date.now },
    "start-time": { type: String },
    "schedule-date": { start: { type: Date }, end: { type: Date } },
    "schedule-time": { start: { type: String }, end: { type: String } },
    "favorite-color": { type: String, match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please fill a valid color hex code'] },
    "number": {
                    type: String,
                    validate: {
                      validator: function(v: string) {
                        return /d{3}-d{3}-d{4}/.test(v);
                      },
                      message: (props: { value: string }) => `${props.value} is not a valid phone number!`
                    }
                },
    "profile": { type: String, trim: true },
    "test": { type: String },
    "info": { type: String },
    "shift": { type: String, enum: ['Choice A', 'Choice B'] },
    "policy": { type: Boolean, default: false },
    "hobbys": [{ type: String }]
}, { timestamps: true })

export default mongoose.models.Post || mongoose.model('Post', postSchema)

export interface IPosts {
    "title": string;
    "email": string;
    "password": string;
    "passcode": string;
    "area": string;
    "books-list": string;
    "check-list": string;
    "sub-area": string;
    "products-images": string[];
    "personal-image": string;
    "description": string;
    "age": number;
    "amount": number;
    "isActive": boolean;
    "start-date": Date;
    "start-time": string;
    "schedule-date": { start: Date; end: Date };
    "schedule-time": { start: string; end: string };
    "favorite-color": string;
    "number": string;
    "profile": string;
    "test": string;
    "info": string;
    "shift": string;
    "policy": boolean;
    "hobbys": string[];
    createdAt: Date;
    updatedAt: Date;
    _id: string;
}

export const defaultPosts = {
    "title": '',
    "email": '',
    "password": '',
    "passcode": '',
    "area": '',
    "books-list": '',
    "check-list": '',
    "sub-area": '',
    "products-images": [],
    "personal-image": '',
    "description": '',
    "age": 0,
    "amount": 0,
    "isActive": false,
    "start-date": new Date(),
    "start-time": '',
    "schedule-date": { start: new Date(), end: new Date() },
    "schedule-time": { start: "", end: "" },
    "favorite-color": '',
    "number": '',
    "profile": '',
    "test": '',
    "info": '',
    "shift": '',
    "policy": false,
    "hobbys": [],
    createdAt: new Date(),
    updatedAt: new Date(),
    _id: '',
}
