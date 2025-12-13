import express from "express";
import {
    addSweet,
    getAllSweets,
    searchSweets,
    updateSweet,
    deleteSweet,
} from "../controllers/sweetController.js";

const sweetRouter = express.Router();

sweetRouter.post("/", addSweet);
sweetRouter.get("/", getAllSweets);
sweetRouter.get("/search", searchSweets);
sweetRouter.put("/:id", updateSweet);
sweetRouter.delete("/:id", deleteSweet);

export default sweetRouter;
