const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static("public"));

// Set view engine cho EJS (nếu cần trang web)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Connect to MongoDB
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/attendance_system";
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Kết nối MongoDB thành công");
    console.log(`📊 Database: ${MONGODB_URI}`);
  })
  .catch((err) => {
    console.error("❌ Lỗi kết nối MongoDB:", err);
    process.exit(1);
  });

// Import routes
const attendanceRoutes = require("./routes/attendance");
const classRoutes = require("./routes/classes");
const studentRoutes = require("./routes/students");

// API Routes
app.use("/api/attendance", attendanceRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/students", studentRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Attendance System API is running",
    timestamp: new Date().toISOString(),
    status: "healthy",
  });
});

// Root endpoint với thông tin API
app.get("/", (req, res) => {
  res.json({
    message: "Hệ thống quản lý điểm danh - API Server",
    version: "1.0.0",
    endpoints: {
      attendance: "/api/attendance",
      classes: "/api/classes",
      students: "/api/students",
      health: "/api/health",
    },
    documentation: {
      attendance: {
        "GET /api/attendance/class/:classId/date/:date":
          "Lấy điểm danh theo lớp và ngày",
        "GET /api/attendance/stats/class/:classId/date/:date":
          "Thống kê điểm danh cho lớp trong ngày",
        "GET /api/attendance/stats/:classId":
          "Thống kê điểm danh theo khoảng thời gian",
        "GET /api/attendance/student/:studentId": "Lịch sử điểm danh học sinh",
        "POST /api/attendance/bulk": "Lưu điểm danh nhiều học sinh",
        "POST /api/attendance": "Lưu điểm danh một học sinh",
        "POST /api/attendance/confirm": "Xác nhận điểm danh",
        "DELETE /api/attendance/:id": "Xóa điểm danh",
      },
      classes: {
        "GET /api/classes": "Lấy tất cả lớp học",
        "GET /api/classes/by-date/:date": "Lấy lớp học theo ngày",
        "GET /api/classes/:classId": "Lấy thông tin lớp",
        "POST /api/classes": "Tạo lớp mới",
        "PUT /api/classes/:classId": "Cập nhật lớp",
        "DELETE /api/classes/:classId": "Xóa lớp",
      },
      students: {
        "GET /api/students": "Lấy tất cả học sinh",
        "GET /api/students/search": "Tìm kiếm học sinh",
        "GET /api/students/class/:classId": "Lấy học sinh theo lớp",
        "GET /api/students/:studentId": "Lấy thông tin học sinh",
        "POST /api/students": "Tạo học sinh mới",
        "PUT /api/students/:studentId": "Cập nhật học sinh",
        "DELETE /api/students/:studentId": "Xóa học sinh",
      },
    },
  });
});

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);

  // Lỗi MongoDB
  if (err.name === "MongoError" || err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Lỗi cơ sở dữ liệu",
      error:
        process.env.NODE_ENV === "development" ? err.message : "Database error",
    });
  }

  // Lỗi Cast (MongoDB ObjectId không hợp lệ)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "ID không hợp lệ",
      error: "Invalid ID format",
    });
  }

  // Lỗi server chung
  res.status(500).json({
    success: false,
    message: "Đã xảy ra lỗi server",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler cho API
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint không tồn tại",
    path: req.originalUrl,
  });
});

// 404 handler chung
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Trang không tìm thấy",
    path: req.originalUrl,
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("📴 SIGTERM received. Shutting down gracefully...");
  mongoose.connection.close(() => {
    console.log("📴 MongoDB connection closed.");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("📴 SIGINT received. Shutting down gracefully...");
  mongoose.connection.close(() => {
    console.log("📴 MongoDB connection closed.");
    process.exit(0);
  });
});

app.listen(PORT, () => {
  console.log("🚀 =================================");
  console.log("🚀 Server đang chạy thành công!");
  console.log("🚀 =================================");
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📅 Started at: ${new Date().toLocaleString("vi-VN")}`);
  console.log("🚀 =================================");
});

module.exports = app;
