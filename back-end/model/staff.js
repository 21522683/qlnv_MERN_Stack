import mongoose from "mongoose"
import { Schema, ObjectId } from "mongoose"
export default mongoose.model('Staff',
    new Schema({
        name: String,
        avatar: {
            url: String,
            public_id: String,
        },
        birthday: Date,
        gender: String,
    })
)