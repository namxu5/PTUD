const { Attendance, Student, Class } = require("../models");

// Lấy danh sách điểm danh theo lớp và ngày
const getAttendanceByClassAndDate = async (req, res) => {
  try {
    const { classId, date } = req.params;
    const { session = "morning" } = req.query;

    const attendanceRecords = await Attendance.find({
      classId: classId.toLowerCase(),
      date: new Date(date),
      session,
    }).sort({ studentId: 1 });

    res.json({
      success: true,
      data: attendanceRecords,
      count: attendanceRecords.length,
    });
  } catch (error) {
    console.error("Lỗi khi lấy điểm danh:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy dữ liệu điểm danh",
      error: error.message,
    });
  }
};

// Lưu điểm danh cho nhiều học sinh (bulk save)
const saveMultipleAttendance = async (req, res) => {
  try {
    const { attendanceData } = req.body;

    if (!Array.isArray(attendanceData) || attendanceData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu điểm danh không hợp lệ",
      });
    }

    // Xóa các bản ghi cũ cho cùng ngày, lớp và ca học
    const firstRecord = attendanceData[0];
    await Attendance.deleteMany({
      classId: firstRecord.classId.toLowerCase(),
      date: new Date(firstRecord.date),
      session: firstRecord.session,
    });

    // Thêm bản ghi mới
    const savedRecords = await Attendance.insertMany(
      attendanceData.map((record) => ({
        ...record,
        classId: record.classId.toLowerCase(),
        date: new Date(record.date),
      }))
    );

    res.json({
      success: true,
      message: `Đã lưu điểm danh cho ${savedRecords.length} học sinh`,
      data: savedRecords,
      count: savedRecords.length,
    });
  } catch (error) {
    console.error("Lỗi khi lưu điểm danh:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lưu điểm danh",
      error: error.message,
    });
  }
};

// Lưu điểm danh cho một học sinh
const saveSingleAttendance = async (req, res) => {
  try {
    const {
      studentId,
      studentName,
      classId,
      date,
      session = "morning",
      status,
      note = "",
      recordedBy,
    } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!studentId || !classId || !date || !status || !recordedBy) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc",
      });
    }

    // Xóa bản ghi cũ nếu có
    await Attendance.deleteOne({
      studentId,
      classId: classId.toLowerCase(),
      date: new Date(date),
      session,
    });

    // Tạo bản ghi mới
    const attendance = new Attendance({
      studentId,
      studentName,
      classId: classId.toLowerCase(),
      date: new Date(date),
      session,
      status,
      note,
      recordedBy,
    });

    const savedAttendance = await attendance.save();

    res.json({
      success: true,
      message: "Đã lưu điểm danh thành công",
      data: savedAttendance,
    });
  } catch (error) {
    console.error("Lỗi khi lưu điểm danh:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lưu điểm danh",
      error: error.message,
    });
  }
};

// Thống kê điểm danh theo lớp và khoảng thời gian
const getAttendanceStats = async (req, res) => {
  try {
    const { classId } = req.params;
    const { startDate, endDate, session = "morning" } = req.query;

    const query = {
      classId: classId.toLowerCase(),
      session,
    };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const stats = await Attendance.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      present: 0,
      "absent-excused": 0,
      "absent-unexcused": 0,
      late: 0,
    };

    stats.forEach((stat) => {
      result[stat._id] = stat.count;
    });

    res.json({
      success: true,
      data: result,
      total: Object.values(result).reduce((sum, count) => sum + count, 0),
    });
  } catch (error) {
    console.error("Lỗi khi lấy thống kê:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy thống kê điểm danh",
      error: error.message,
    });
  }
};

// Lấy thống kê điểm danh cho một lớp trong một ngày cụ thể
const getAttendanceStatsForClass = async (req, res) => {
  try {
    const { classId, date } = req.params;
    const { session = "morning" } = req.query;

    const attendanceRecords = await Attendance.find({
      classId: classId.toLowerCase(),
      date: new Date(date),
      session,
    });

    if (attendanceRecords.length === 0) {
      return res.json({
        success: true,
        data: null,
        message: "Chưa có dữ liệu điểm danh",
      });
    }

    const presentCount = attendanceRecords.filter(
      (record) => record.status === "present"
    ).length;
    const totalCount = attendanceRecords.length;

    res.json({
      success: true,
      data: {
        presentCount,
        totalCount,
        absentCount: totalCount - presentCount,
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy thống kê lớp:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy thống kê lớp",
      error: error.message,
    });
  }
};

// Lịch sử điểm danh của một học sinh
const getStudentAttendanceHistory = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate, session, limit = 100 } = req.query;

    const query = { studentId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (session) {
      query.session = session;
    }

    const attendanceHistory = await Attendance.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: attendanceHistory,
      count: attendanceHistory.length,
    });
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử điểm danh:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy lịch sử điểm danh",
      error: error.message,
    });
  }
};

// Xóa điểm danh
const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAttendance = await Attendance.findByIdAndDelete(id);

    if (!deletedAttendance) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bản ghi điểm danh",
      });
    }

    res.json({
      success: true,
      message: "Đã xóa điểm danh thành công",
      data: deletedAttendance,
    });
  } catch (error) {
    console.error("Lỗi khi xóa điểm danh:", error);
    res.status(500).json({
      success: false,
      message: "Không thể xóa điểm danh",
      error: error.message,
    });
  }
};

// Xác nhận điểm danh (confirm attendance)
const confirmAttendance = async (req, res) => {
  try {
    const { classId, date, session = "morning" } = req.body;

    if (!classId || !date) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin lớp học hoặc ngày",
      });
    }

    // Kiểm tra xem có học sinh nào chưa được điểm danh không
    const pendingAttendance = await Attendance.find({
      classId: classId.toLowerCase(),
      date: new Date(date),
      session,
      status: "pending",
    });

    if (pendingAttendance.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Còn ${pendingAttendance.length} học sinh chưa được điểm danh`,
      });
    }

    // Lấy tất cả bản ghi điểm danh cho lớp này trong ngày
    const attendanceRecords = await Attendance.find({
      classId: classId.toLowerCase(),
      date: new Date(date),
      session,
    });

    res.json({
      success: true,
      message: "Điểm danh đã được xác nhận",
      data: {
        classId,
        date,
        session,
        totalStudents: attendanceRecords.length,
        confirmed: true,
        confirmedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Lỗi khi xác nhận điểm danh:", error);
    res.status(500).json({
      success: false,
      message: "Không thể xác nhận điểm danh",
      error: error.message,
    });
  }
};

module.exports = {
  getAttendanceByClassAndDate,
  saveMultipleAttendance,
  saveSingleAttendance,
  getAttendanceStats,
  getAttendanceStatsForClass,
  getStudentAttendanceHistory,
  deleteAttendance,
  confirmAttendance,
};
