import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// Signup Controller
export const SignUp = async (req, res) => {
    try {

        // Extract user input
        const { name, email, password } = req.body;

        // Basic field validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email or password not present"
            });
        }

        // Check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({
                success: false,
                message: "User already registered"
            });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser._id, email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Set token in secure cookie
        res.cookie("userToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            success: true,
            message: "User signed up successfully"
        });

    } catch {
        // Fallback error handling
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



// Login Controller
export const Login = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email or password not provided"
            });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Verify password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Set authentication cookie
        res.cookie("userToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Login successful"
        });

    } catch {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



// Logout Controller
export const Logout = async (req, res) => {
    try {

        // Expire the cookie immediately
        res.cookie("userToken", "", {
            httpOnly: true,
            expires: new Date(0),
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });

    } catch {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
