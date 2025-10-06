import mongoose, { Schema } from "mongoose";

const quizAttemptSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        quiz: {
            type: Schema.Types.ObjectId,
            ref: "Quiz",
            required: true,
            index: true,
        },

        score: {
            type: Number,
            required: true,
            min: 0,
        },

        totalQuestions: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

export const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);