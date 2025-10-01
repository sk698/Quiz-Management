import mongoose,{ Schema } from "mongoose";


const userSchema = new Schema({
    name: { 
        type: String,
        required: true,
    },
    
}, { timestamps: true })

const User = mongoose.model("User", userSchema);


export { User };