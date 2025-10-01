import mongoose,{ Schema } from "mongoose";


const quizSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
}, {timestamps: true}
);

const Quiz = mongoose.model("Quiz", quizSchema);

export { Quiz };