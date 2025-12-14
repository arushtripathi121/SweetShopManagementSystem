import app from "./app.js";
import connectDB from "../config/dbConnection.js";
import dotenv from "dotenv";

dotenv.config();

if (process.env.NODE_ENV !== "test") {
  connectDB();
}

const PORT = process.env.PORT || 5000;

app.use('/', (req, res) => {
  res.send("server is working fine");
})

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
