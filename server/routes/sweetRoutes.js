import express from "express";
import {
    addSweet,
    getAllSweets,
    searchSweets,
    updateSweet,
    deleteSweet,
    getSweetById
} from "../controllers/sweetController.js";

import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";

const sweetRouter = express.Router();

// Public routes
sweetRouter.get("/", getAllSweets);
sweetRouter.get("/search", searchSweets);
sweetRouter.get("/:id", getSweetById);


// Admin-only protected routes
sweetRouter.post("/", isAuthenticated, isAdmin, addSweet);
sweetRouter.put("/:id", isAuthenticated, isAdmin, updateSweet);
sweetRouter.delete("/:id", isAuthenticated, isAdmin, deleteSweet);

export default sweetRouter;
