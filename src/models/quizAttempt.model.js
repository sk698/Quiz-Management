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
        submittedAnswers: [ 
        {
            questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
            optionId: { type: mongoose.Schema.Types.ObjectId }
        }
    ],
    submittedAt: { type: Date, default: Date.now }
    
});

quizAttemptSchema.index({ user: 1, quiz: 1 }, { unique: true });

export const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);