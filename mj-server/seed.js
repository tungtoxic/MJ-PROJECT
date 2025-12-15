const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Era = require("./models/Era"); // Gọi cái khuôn ra

// Nạp cấu hình từ file .env để lấy mật khẩu DB
dotenv.config();

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🔌 Đã kết nối MongoDB để chuẩn bị nạp dữ liệu..."))
  .catch((err) => {
    console.error("Lỗi kết nối:", err);
    process.exit(1);
  });

// Đọc file data.json
const data = JSON.parse(fs.readFileSync("./data.json", "utf-8"));

// Hàm nạp dữ liệu
const importData = async () => {
  try {
    // 1. Xóa sạch dữ liệu cũ (để tránh bị trùng lặp khi chạy nhiều lần)
    await Era.deleteMany();
    console.log("🗑️  Đã xóa dữ liệu cũ...");

    // 2. Nạp dữ liệu mới
    await Era.create(data);
    console.log("✅ ĐÃ NẠP THÀNH CÔNG! Dữ liệu MJ đã lên mây.");

    // 3. Ngắt kết nối và thoát
    process.exit();
  } catch (error) {
    console.error("❌ Lỗi khi nạp:", error);
    process.exit(1);
  }
};

// Chạy hàm nạp
importData();
