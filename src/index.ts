import dotenv from "dotenv";
dotenv.config(); // ✅ FIRST LINE
import express, { Application, Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/db";
import foodRouter from "./routes/food.routes";
import checkOouter from "./routes/checkout.routes";

connectDB();


const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(foodRouter);
app.use(checkOouter);

app.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to E-commerce API");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
