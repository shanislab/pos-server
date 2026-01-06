import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Request } from "express";
import cloudinary from "../config/clouddb";

/* ================= STORAGE CONFIG ================= */

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req: Request, file: Express.Multer.File) => {
    const isPdf = file.mimetype === "application/pdf";

    return {
      folder: "products",
      resource_type: isPdf ? "raw" : "image", // PDF vs Image
      type: "upload",
      format: isPdf ? "pdf" : undefined,
      public_id: file.originalname.split(".")[0],
    };
  },
});

/* ================= MULTER MIDDLEWARE ================= */

const upload = multer({ storage });

export default upload;
