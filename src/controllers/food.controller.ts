// src/controllers/food.controller.ts
import cloudinary from "../config/clouddb";
import { Request, Response } from "express";
import Food from "../models/food.model";

export const addFood = async (req: Request, res: Response) => {
  console.log("req.body:", req.body);
  console.log("req.file:", req.file);

  try {
    const { title, price, offer } = req.body;

    if (!title || !price) {
      return res.status(400).json({
        success: false,
        message: "Title and price are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const priceNum = Number(price);
    if (isNaN(priceNum)) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid number",
      });
    }

    // Parse offer safely
    let parsedOffer;
    if (offer) {
      parsedOffer = JSON.parse(offer);

      // Extra safety validation
      if (!parsedOffer.type || !parsedOffer.label) {
        return res.status(400).json({
          success: false,
          message: "Invalid offer format",
        });
      }

      if (
        parsedOffer.type === "PERCENT" &&
        typeof parsedOffer.value !== "number"
      ) {
        return res.status(400).json({
          success: false,
          message: "Percent offer must have a numeric value",
        });
      }
    }

    const food = await Food.create({
      title,
      price: priceNum,
      offer: parsedOffer,
      image: {
        url: (req.file as any).path,       // Cloudinary URL
        public_id: (req.file as any).filename, // Cloudinary public_id
      },
    });

    res.status(201).json({
      success: true,
      message: "Food added successfully",
      data: food,
    });

    console.log("Food created:", food);
  } catch (error: any) {
    console.error("Add food error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add food",
    });
  }
};



/* ================= GET ALL FOODS ================= */
export const getAllFoods = async (req: Request, res: Response) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: foods.length,
      data: foods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch foods",
    });
  }
};

/* ================= UPDATE FOOD ================= */
export const updateFood = async (req: Request, res: Response) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }

    // Parse offer if sent
    let parsedOffer;
    if (req.body.offer) {
      parsedOffer = JSON.parse(req.body.offer);
    }

    // Delete old image if new uploaded
    if (req.file && food.image?.public_id) {
      await cloudinary.uploader.destroy(food.image.public_id);
    }

    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title ?? food.title,
        price: req.body.price ?? food.price,
        // rating: req.body.rating ?? food.rating,
        offer: parsedOffer ?? food.offer,
        ...(req.file && {
          image: {
            url: (req.file as any).path,
            public_id: (req.file as any).filename,
          },
        }),
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Food updated successfully",
      data: updatedFood,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update food",
    });
  }
};

/* ================= DELETE FOOD ================= */
export const deleteFood = async (req: Request, res: Response) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }

    // Delete image from Cloudinary
    if (food.image?.public_id) {
      await cloudinary.uploader.destroy(food.image.public_id);
    }

    await food.deleteOne();

    res.status(200).json({
      success: true,
      message: "Food deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete food",
    });
  }
};
