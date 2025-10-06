import { Quiz } from "../models/quiz.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse..js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Question } from "../models/question.model.js";
import { QuizAttempt } from "../models/quizAttempt.model.js";

const createQuiz = asyncHandler(async (req, res) => {
    const { title } = req.body;

    if (!title) {
        throw new ApiError(400, "Title is required");
    }

    const quiz = await Quiz.create({
        title,
    });

    if (!quiz) {
        throw new ApiError(500, "Failed to create the quiz");
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            quiz,
            "Quiz created successfully"
        )
    );
});

const getAllQuizzes = asyncHandler(async (req, res) => {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.status(200).json(
        new ApiResponse(200, quizzes, "Quizzes retrieved successfully")
    );
});

const deleteQuiz = asyncHandler(async (req, res) => {
    const { quizId } = req.params;
    const questions = await Question.deleteMany({quiz: quizId})
    if (!questions){
        throw new ApiError(404, "Error while deleting question")
    }

    const submission = await QuizAttempt.deleteMany({quiz: quizId})
    if (!submission){
        throw new ApiError(404, "Error while deleting submission")
    }
    
    const quiz = await Quiz.findByIdAndDelete(quizId);

    if (!quiz) {
        throw new ApiError(404, "Quiz not found");
    }

    
    
    res.status(200).json(
        new ApiResponse(200, quiz, "Quiz deleted successfully")
    );
});

const submitQuiz = asyncHandler(async (req, res) => {
    const { quizId } = req.params;
    const { answers } = req.body;


    const userId = req.user?._id; 
    
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
        throw new ApiError(400, "Answers are required and should be a non-empty array");
    }
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        throw new ApiError(404, "Quiz not found");
    }
    
    const questions = await Question.find({ quiz: quizId });
    const total = questions.length;
    let score = 0;

    answers.forEach(answer => {
        const question = questions.find(q => q._id.toString() === answer.questionId);
        if (!question) return; 

        const OptionId = question.options.id(answer.OptionId); 
        if (OptionId && OptionId.isCorrect) {
            score++;
        }
    });

    const quizAttempt = await QuizAttempt.create({
        user: userId,
        quiz: quizId,
        score: score,
        totalQuestions: total,
    });

    if (!quizAttempt) {
        throw new ApiError(500, "Failed to save the quiz attempt");
    }

  
    return res.status(200).json(
        new ApiResponse(
            200,
            quizAttempt,
            "Quiz submitted and results saved successfully"
        )
    );
});

export {
    createQuiz,
    getAllQuizzes,
    deleteQuiz,
    submitQuiz
};