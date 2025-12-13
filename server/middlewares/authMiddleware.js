import jwt from "jsonwebtoken";
import User from "../models/User.js";

// auth middleware
export const isAuthenticated = async (req, res, next) => {
    try {
        // read token from cookie
        const token = req.cookies.userToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // fetch user
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }

        // attach user to request
        req.user = user;

        next();

    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Authentication failed"
        });
    }
};
