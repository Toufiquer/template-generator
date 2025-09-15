import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema({
    "title": { type: String, },
    "email": {
                    type: String,
                     match:  [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
                },
    "password": { type: String, select: false },
    "passcode": { type: String, select: false },
    "area": { type: String, enum: ['Option 1', 'Option 2'] },
    "books-list": { type: String },
    "check-list": { type: String },
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
    "hobbys": [{ type: String }],
    "ideas": { type: String }
}, { timestamps: true })

export default mongoose.models.Post || mongoose.model('Post', postSchema)
 
