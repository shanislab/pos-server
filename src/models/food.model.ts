import mongoose, { Schema, Document, Model } from "mongoose";

/* ================= OFFER TYPES ================= */

export type OfferType = "PERCENT" | "BOGO";

export interface IOffer {
  label: string;
  type: OfferType;
  value?: number; // required only for PERCENT
}

/* ================= IMAGE INTERFACE ================= */

export interface IImage {
  url: string;
  public_id: string;
}

/* ================= FOOD INTERFACE ================= */

export interface IFood extends Document {
  title: string;
  price: number;
  image: IImage;
  offer?: IOffer;
  createdAt: Date;
  updatedAt: Date;
}

/* ================= OFFER SCHEMA ================= */

const offerSchema = new Schema<IOffer>(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["PERCENT", "BOGO"],
      required: true,
    },
    value: {
      type: Number,
      min: 0,
      required: function (this: IOffer) {
        return this.type === "PERCENT";
      },
    },
  },
  { _id: false }
);


/* ================= IMAGE SCHEMA ================= */

const imageSchema = new Schema<IImage>(
  {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

/* ================= FOOD SCHEMA ================= */

const foodSchema = new Schema<IFood>(
  {
    title: {
      type: String,
      required: [true, "Food title is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    image: {
      type: imageSchema,
      required: true,
    },
    offer: {
      type: offerSchema,
      required: false,
    },
  },
  { timestamps: true }
);

/* ================= MODEL ================= */

const Food: Model<IFood> =
  mongoose.models.Food || mongoose.model<IFood>("Food", foodSchema);

export default Food;
