import { Question } from "../models/question.model.js";
import { Quiz } from "../models/quiz.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse..js";
import { asyncHandler } from "../utils/asyncHandler.js";


const addQuestionToQuiz = asyncHandler(async (req, res) => {
    const { quizId } = req.params;
    let questiondata = req.body;

    if(!Array.isArray(questiondata)){
        questiondata = [questiondata];
    }

    if (!questiondata || questiondata.length === 0) {
        throw new ApiError(400, "Question is required");
    }

    const quiz = await Quiz.findById(quizId);

    if(!quiz){
        throw new ApiError(404, "Quiz not found");
    }

    const createdQuestion = [];

    for (const q of questiondata) {
        const { text, options } = q;
        if (!text || !options) {
            throw new ApiError(400, "Each question must have text and at least two options");
        }
        const question = await Question.create({
            quiz: quizId,
            text,
            options,
        });

        if(!question){
            throw new ApiError(500, "Failed to create question");
        }
        createdQuestion.push(question);
    }


    const responseData = createdQuestion.length === 1 ? createdQuestion[0] : createdQuestion;

    return res.status(201).json(
        new ApiResponse(
            201,
            responseData,
            "Question(s) added to quiz successfully"
        )
    );

});

const getAllQuestions = asyncHandler(async (req, res) => {
    const { quizId } = req.params;

    const questions = await Question.find({ quiz: quizId })
        .select("text options._id options.text")
        .sort({ createdAt: 1 });

    if (!questions.length) {
        throw new ApiError(404, "No questions found for this quiz");
    }

    res.status(200).json(
        new ApiResponse(200, questions, "Questions retrieved successfully")
    );
});

export { 
    addQuestionToQuiz,
    getAllQuestions,
};