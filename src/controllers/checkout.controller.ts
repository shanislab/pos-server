import { Request, Response } from "express";
import Checkout, { ICheckout } from "../models/checkout.model";

/* ================= CREATE ORDER ================= */
export const createCheckout = async (req: Request, res: Response) => {
  try {
    const { items, subtotal, discount, tax, total, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const newCheckout: ICheckout = new Checkout({
      items,
      subtotal,
      discount,
      tax,
      total,
      paymentMethod,
      status: "PAID", // assuming payment successful; change if integrating payment gateway
    });

    const savedOrder = await newCheckout.save();
    return res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Checkout Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ================= GET ALL ORDERS WITH PAGINATION ================= */
export const getAllCheckouts = async (_req: Request, res: Response) => {
  try {
    // Get page and limit from query params, default page=1, limit=10
    const page = parseInt(_req.query.page as string) || 1;
    const limit = parseInt(_req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Fetch total count for pagination info
    const totalOrders = await Checkout.countDocuments();

    // Fetch paginated orders
    const orders = await Checkout.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total: totalOrders,
        page,
        limit,
        totalPages: Math.ceil(totalOrders / limit),
      },
    });
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


/* ================= GET SINGLE ORDER ================= */
export const getCheckoutById = async (req: Request, res: Response) => {
  try {
    const order = await Checkout.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    console.error("Fetch Order Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// overview data
export const getOverviewData = async (req: Request, res: Response) => {
  try {
    /* ================= SUMMARY CARDS ================= */
    const summary = await Checkout.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$total" },
          totalProductsSold: {
            $sum: {
              $reduce: {
                input: "$items",
                initialValue: 0,
                in: { $add: ["$$value", "$$this.qty"] },
              },
            },
          },
        },
      },
    ]);

    /* ================= MONTHLY SALES & ORDERS ================= */
    const monthlyStats = await Checkout.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          sales: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const salesData = monthlyStats.map((m) => ({
      month: monthNames[m._id.month - 1],
      sales: m.sales,
      orders: m.orders,
    }));

    /* ================= TOP SELLING PRODUCT ================= */
    const topProduct = await Checkout.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.title",
          totalSold: { $sum: "$items.qty" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 1 },
    ]);

    /* ================= BEST REVENUE MONTH ================= */
    const bestMonth = monthlyStats.reduce(
      (best, curr) => (curr.sales > best.sales ? curr : best),
      monthlyStats[0]
    );

    /* ================= RESPONSE ================= */
    res.status(200).json({
      success: true,
      data: {
        overviewCards: {
          totalOrders: summary[0]?.totalOrders || 0,
          revenue: summary[0]?.totalRevenue || 0,
          productsSold: summary[0]?.totalProductsSold || 0,

          // ⚠️ No user model provided → mocked value
          newCustomers: Math.floor((summary[0]?.totalOrders || 0) * 0.25),
        },

        salesData,

        insights: {
          topSellingProduct: topProduct[0]
            ? {
                title: topProduct[0]._id,
                units: topProduct[0].totalSold,
              }
            : null,

          bestRevenueMonth: bestMonth
            ? {
                month: monthNames[bestMonth._id.month - 1],
                revenue: bestMonth.sales,
              }
            : null,
        },
      },
    });
  } catch (error) {
    console.error("Overview Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load overview data",
    });
  }
};