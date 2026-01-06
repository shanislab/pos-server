import mongoose from "mongoose";

const connectionString = process.env.CONNECTIONSTRING as string;

if (!connectionString) {
  throw new Error("❌ CONNECTIONSTRING is not defined in environment variables");
}

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(connectionString);
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
