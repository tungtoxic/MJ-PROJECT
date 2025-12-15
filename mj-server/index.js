const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Gọi Model Era vào để sử dụng
const Era = require("./models/Era");
const Bio = require("./models/Bio");
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://LINK-VERCEL-CUA-BAN.vercel.app"],
    credentials: true,
  })
); // Cho phép React gọi vào

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Server đã kết nối với MongoDB!"))
  .catch((err) => console.error("❌ Lỗi kết nối:", err));

// --- PHẦN QUAN TRỌNG: CÁC API (ROUTES) ---
app.get("/", (req, res) => {
  res.send("<h1>Server MJ đang chạy ngon lành!</h1>");
});
// 1. API Lấy toàn bộ dữ liệu Kỷ nguyên (Cho trang chủ)
// Khi React gọi vào: http://localhost:5000/api/eras
app.get("/api/eras", async (req, res) => {
  try {
    const eras = await Era.find(); // Lệnh này tương đương: "Lấy tất cả từ bảng Era"
    res.json(eras); // Trả về dạng JSON cho React
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. API Lấy chi tiết 1 Kỷ nguyên theo tên (Ví dụ: Lấy riêng Bad)
// Khi React gọi: http://localhost:5000/api/eras/Bad
app.get("/api/eras/:name", async (req, res) => {
  try {
    const era = await Era.findOne({ name: req.params.name });
    if (!era)
      return res.status(404).json({ message: "Không tìm thấy kỷ nguyên này" });
    res.json(era);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/bios", async (req, res) => {
  try {
    // Sắp xếp theo chapterId tăng dần (1, 2, 3...)
    const bios = await Bio.find().sort({ chapterId: 1 });
    res.json(bios);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Chạy server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
