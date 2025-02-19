import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;
console.log(MONGODB_URI);

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI không được định nghĩa trong biến môi trường");
}

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "expenseManagement",
    });
    console.log("✅ Kết nối MongoDB thành công!");
  } catch (error) {
    console.error("❌ Lỗi kết nối MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
