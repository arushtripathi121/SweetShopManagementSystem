import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const SignUp = (req, res) => {
    return res.status(500).json({ success: false });
};
