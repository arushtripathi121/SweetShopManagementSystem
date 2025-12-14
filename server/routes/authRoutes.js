import express from "express";
import { SignUp, Login, Logout } from "../controllers/authController.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";


const authRouter = express.Router();

authRouter.post("/signup", SignUp);
authRouter.post("/login", Login);
authRouter.get("/logout", Logout);

authRouter.get("/me", isAuthenticated, (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user
    });
});

export default authRouter;
