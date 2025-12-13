import express from "express";
import { SignUp, Login, Logout } from "../controllers/AuthController";


const authRouter = express.Router();

authRouter.post("/signup", SignUp);
authRouter.post("/login", Login);
authRouter.post("/logout", Logout);

export default authRouter;
