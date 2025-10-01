import { Router } from "express";
import { addQuestionToQuiz, getAllQuestions,
    // getQuestionById,
    // updateQuestion,
    // deleteQuestion
} from "../controllers/qustion.controller.js";
import { createQuiz, deleteQuiz, getAllQuizzes, submitQuiz} from "../controllers/quiz.controller.js";


const router = Router();

// Create a new quiz
router.post("/create", createQuiz);
router.post("/:quizId/questions/add", addQuestionToQuiz)
router.delete("/:quizId/delete", deleteQuiz);
// router.patch("/:quizId", updateQuestion);
// router.delete("/:id", deleteQuestion);  


// for Users to attempt quiz
router.get("/", getAllQuizzes);
router.get("/:quizId", getAllQuestions);
router.post("/:quizId/submit", submitQuiz);



export default router;