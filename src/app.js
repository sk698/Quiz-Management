import express from "express";
import userRouter from "./routes/user.routes.js";
import  upload  from "./middlewares/multer.middleware.js";



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Welcome to Quiz Management System");
})

app.use("/user", upload.none(), userRouter);


export { app };