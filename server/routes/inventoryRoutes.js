import express from "express";
import {
    purchaseSweet,
    restockSweet
} from "../controllers/inventoryController.js";

const inventoryRouter = express.Router();

inventoryRouter.post("/:id/purchase", purchaseSweet);
inventoryRouter.post("/:id/restock", restockSweet);

export default inventoryRouter;
