const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");

// GET: Lấy tất cả lớp học
router.get("/", classController.getAllClasses);

// GET: Lấy lớp học theo ngày (có lịch học)
router.get("/by-date/:date", classController.getClassesByDate);

// GET: Lấy thông tin lớp theo ID
router.get("/:classId", classController.getClassById);

// POST: Tạo lớp học mới
router.post("/", classController.createClass);

// PUT: Cập nhật thông tin lớp
router.put("/:classId", classController.updateClass);

// DELETE: Xóa lớp học
router.delete("/:classId", classController.deleteClass);

module.exports = router;
