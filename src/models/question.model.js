import mongoose, { Schema } from "mongoose";


const optionSchema = new Schema({
    text: {
        type: String,
        required: true,
        trim: true,
    },
    isCorrect: {
        type: Boolean,
        required: true,
        default: false,
    }
})

const questionSchema = new Schema({
    quiz: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
    },
    options: [optionSchema],
}, { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);

export { Question };
