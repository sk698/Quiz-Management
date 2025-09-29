import { User } from "../models/user.model.js";

const createUser = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }
        const newUser = await User.create({
            name
        });
        return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
        }
    }

export { createUser };