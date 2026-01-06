import express from "express";
import { createCheckout, getAllCheckouts, getCheckoutById, getOverviewData } from "../controllers/checkout.controller";

const checkOouter = express.Router();

checkOouter.post("/checkout", createCheckout);
checkOouter.get("/checkout/all", getAllCheckouts);
checkOouter.get("/overview", getOverviewData);

export default checkOouter;
