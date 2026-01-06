// src/routes/food.routes.ts
import express from "express";
import {
  addFood,
  getAllFoods,
  updateFood,
  deleteFood,
} from "../controllers/food.controller";
import upload from "../middleware/multer.middleware";

const foodRouter = express.Router();

// Use multer middleware for image upload
foodRouter.post("/food/add", upload.single("image"), addFood);
foodRouter.get("/food/all", getAllFoods);
foodRouter.put("/food/edit/:id", upload.single("image"), updateFood);
foodRouter.delete("/food/delete/:id", deleteFood);

export default foodRouter;
