import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "../routes/authRoutes.js";
import sweetRouter from "../routes/sweetRoutes.js";
import inventoryRouter from "../routes/inventoryRoutes.js";


dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth/", authRouter);
app.use("/api/v1/sweet/", sweetRouter);
app.use("/api/v1/inventory/", inventoryRouter);

export default app;
