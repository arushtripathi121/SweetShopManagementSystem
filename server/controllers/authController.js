import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// Generates a signed JWT for the user
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Attaches auth token to cookie with proper security options
const setAuthCookie = (res, token) => {
    res.cookie("userToken", token, {
        httpOnly: true,                             // prevents JS access
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000             // 7 days
    });
};

// Sends a consistent error structure
const sendError = (res, code, message) => {
    return res.status(code).json({ success: false, message });
};




// SIGNUP -------------------------------------------------
export const SignUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Basic required field check
        if (!name || !email || !password) {
            return sendError(res, 400, "Name, email or password not present");
        }

        // Avoid duplicate accounts
        const existing = await User.findOne({ email });
        if (existing) {
            return sendError(res, 409, "User already registered");
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Issue token and set cookie
        const token = generateToken({ id: newUser._id, email });
        setAuthCookie(res, token);

        return res.status(201).json({
            success: true,
            message: "User signed up successfully"
        });

    } catch {
        // Generic fallback error
        return sendError(res, 500, "Internal server error");
    }
};




// LOGIN --------------------------------------------------
export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Quick validation check
        if (!email || !password) {
            return sendError(res, 400, "Email or password not provided");
        }

        // Look up the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return sendError(res, 401, "Invalid credentials");
        }

        // Verify password against stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendError(res, 401, "Invalid credentials");
        }

        // Create and store token
        const token = generateToken({ id: user._id, email: user.email });
        setAuthCookie(res, token);

        return res.status(200).json({
            success: true,
            message: "Login successful"
        });

    } catch {
        return sendError(res, 500, "Internal server error");
    }
};



// LOGOUT -------------------------------------------------
export const Logout = async (req, res) => {
    try {
        // Simply clear the cookie by expiring it
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
        return sendError(res, 500, "Internal server error");
    }
};
