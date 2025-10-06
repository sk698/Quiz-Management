import mongoose,{ Schema } from "mongoose";


const quizSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true}
);

const Quiz = mongoose.model("Quiz", quizSchema);

export { Quiz };