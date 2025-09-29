import dotenv from "dotenv";
import connectDB from "./db/db.js";
import { app } from "./app.js";

dotenv.config({
    path: "./.env"
})

// console.log(process.env);

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at http://localhost:${process.env.PORT}`);
    })
})
.catch((error) => {
    console.log("Mongo db connection failed !!! ", error);
})