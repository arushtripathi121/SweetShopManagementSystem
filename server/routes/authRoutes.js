import express from "express";
import { SignUp } from "../controllers/AuthController";
const authRouter = express.Router();

authRouter.post('/signup', SignUp);

export default authRouter;