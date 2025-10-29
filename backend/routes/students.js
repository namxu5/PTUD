const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

// GET: Tìm kiếm học sinh
router.get("/search", studentController.searchStudents);

// GET: Lấy tất cả học sinh
router.get("/", studentController.getAllStudents);

// GET: Lấy học sinh theo lớp
router.get("/class/:classId", studentController.getStudentsByClass);

// GET: Lấy thông tin học sinh theo ID
router.get("/:studentId", studentController.getStudentById);

// POST: Tạo học sinh mới
router.post("/", studentController.createStudent);

// PUT: Cập nhật thông tin học sinh
router.put("/:studentId", studentController.updateStudent);

// DELETE: Xóa học sinh
router.delete("/:studentId", studentController.deleteStudent);

module.exports = router;
