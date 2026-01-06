import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem {
  title: string;
  image?: string;
  price: number;
  qty: number;
  offer?: {
    label: string;
    type?: "BOGO" | "PERCENT";
    value?: number;
  };
  discountAmount?: number;
}

export interface ICheckout extends Document {
  items: ICartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: "CASH" | "CARD" | "ONLINE";
  status: "PENDING" | "PAID" | "FAILED";
  createdAt: Date;
}

const CartItemSchema: Schema = new Schema({
  title: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
  offer: {
    label: String,
    type: { type: String, enum: ["BOGO", "PERCENT"] },
    value: Number,
  },
  discountAmount: { type: Number, default: 0 },
});

const CheckoutSchema: Schema = new Schema(
  {
    items: { type: [CartItemSchema], required: true },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["CASH", "CARD", "ONLINE"], default: "CASH" },
        status: { type: String, enum: ["PENDING", "PAID", "FAILED"], default: "PENDING" },
  },
  { timestamps: true }
);

export default mongoose.model<ICheckout>("Checkout", CheckoutSchema);
