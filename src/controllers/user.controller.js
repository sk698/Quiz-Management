import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse..js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const options = {
        httpOnly: true,
        secure: true,
    }

const generateAccessandRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
    
        const accessToken = user.generateAccessToken();
    
        const refreshToken = user.generateRefreshToken();
        
        user.refreshToken = refreshToken;
    
        await user.save({validateBeforeSave: false});

        return { accessToken, refreshToken };
    
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    
    }
}


const registerUser = asyncHandler( async (req, res) => {
    
    const {fullName, email, username, password } = req.body;

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }
    
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    
    if(existedUser){
        if (existedUser.username === username) {
        throw new ApiError(409, "username already exists");
        }
        if (existedUser.email === email) {
        throw new ApiError(409, "email already exists");
        }
    }
    

    
   
    const user = await User.create({
        fullName,
        email, 
        password,
        username: username.toLowerCase()
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    
    const { accessToken, refreshToken } = await generateAccessandRefreshTokens(user._id);

    const data = {
        user: createdUser,
        accessToken,
        refreshToken
    };
    
    


    return res.status(201).json(
        new ApiResponse(
            201, 
            data, 
            "User registered successfully"
        )
    );
});


const loginUser = asyncHandler( async (req, res) => {
    const { username, password, email } = req.body;

    if(!username && !email) {
        throw new ApiError(400, 'Username or email required');
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if(!user){
         throw new ApiError(404, 'User not found');
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, 'Invalid credentials');
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select('-password -refreshToken -__v -createdAt -updatedAt')

    return res
    .status(200)
    .cookie('refreshToken', refreshToken, options)
    .cookie('accessToken', accessToken, options)
    .json(
        new ApiResponse(
            200, 
            { 
                user: loggedInUser, accessToken, refreshToken
            },
            'User logged in successfully'
        )
    )
});

const logoutUser = asyncHandler( async (req, res) => {
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            },
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .clearCookie('refreshToken', options)
    .clearCookie('accessToken', options)
    .json(
        new ApiResponse(
            200, 
            {},
            'User logged out successfully'
        )
    )
})

const refreshAccessToken = asyncHandler( async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    
    if(!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized: No token provided")
    };

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    const user = await User.findById(decodedToken?._id)
    
    if( !user ){
        throw new ApiError(401, "Invalid refresh token");
    }
    
    if( user?.refreshToken !== incomingRefreshToken ){
        throw new ApiError(401, "Refresh token is expired or used");
    }
    
    const {newrefreshToken, newaccessToken} = await generateAccessandRefreshTokens(user._id);

    return res
    .status(200)
    .cookie('refreshToken', newrefreshToken, options)
    .cookie('accessToken', newaccessToken, options)
    .json(
        new ApiResponse(
            200, 
            { 
             accessToken: newaccessToken, 
             refreshToken: newrefreshToken
            },
            'Token refreshed successfully'
        )
    )
});

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body;
    
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

export { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword

};