import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "../routes/authRoutes";
import sweetRouter from "../routes/sweetRoutes";
import inventoryRouter from "../routes/inventoryRoutes";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth/", authRouter);
app.use("/api/v1/sweet/", sweetRouter);
app.use("/api/v1/inventory/", inventoryRouter);

export default app;
