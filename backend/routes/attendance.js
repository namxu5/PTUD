const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");

// GET: Lấy danh sách điểm danh theo lớp và ngày
router.get(
  "/class/:classId/date/:date",
  attendanceController.getAttendanceByClassAndDate
);

// GET: Lấy thống kê điểm danh cho một lớp trong một ngày cụ thể
router.get(
  "/stats/class/:classId/date/:date",
  attendanceController.getAttendanceStatsForClass
);

// GET: Thống kê điểm danh theo lớp và khoảng thời gian
router.get("/stats/:classId", attendanceController.getAttendanceStats);

// GET: Lịch sử điểm danh của một học sinh
router.get(
  "/student/:studentId",
  attendanceController.getStudentAttendanceHistory
);

// POST: Lưu điểm danh cho nhiều học sinh
router.post("/bulk", attendanceController.saveMultipleAttendance);

// POST: Lưu điểm danh cho một học sinh
router.post("/", attendanceController.saveSingleAttendance);

// POST: Xác nhận điểm danh
router.post("/confirm", attendanceController.confirmAttendance);

// DELETE: Xóa điểm danh
router.delete("/:id", attendanceController.deleteAttendance);

module.exports = router;
