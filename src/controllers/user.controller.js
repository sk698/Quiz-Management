import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse..js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createUser = asyncHandler( async (req, res) => {
    
    
    const { name } = req.body;
    if (!name) {
        throw new ApiError(400, "Name is required");
    }
    const newUser = await User.create({
        name
    });
    console.log("hello");
    return res.status(201).json(
        new ApiResponse(
            201,
            newUser, 
            "User created successfully"  
        )
    );
});

export { createUser };