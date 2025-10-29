const { Class, Student } = require("../models");

// Lấy tất cả lớp học
const getAllClasses = async (req, res) => {
  try {
    const { status = "active" } = req.query;

    const classes = await Class.find({ status }).sort({ className: 1 });

    res.json({
      success: true,
      data: classes,
      count: classes.length,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách lớp:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách lớp",
      error: error.message,
    });
  }
};

// Lấy lớp học theo ngày (có lịch học)
const getClassesByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();
    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const selectedDay = dayNames[dayOfWeek];

    const classes = await Class.find({
      status: "active",
      "schedule.days": selectedDay,
    }).sort({ className: 1 });

    res.json({
      success: true,
      data: classes,
      count: classes.length,
      dayOfWeek: selectedDay,
    });
  } catch (error) {
    console.error("Lỗi khi lấy lớp theo ngày:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy lớp theo ngày",
      error: error.message,
    });
  }
};

// Lấy thông tin lớp theo ID
const getClassById = async (req, res) => {
  try {
    const { classId } = req.params;

    const classInfo = await Class.findOne({ classId: classId.toLowerCase() });

    if (!classInfo) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lớp học",
      });
    }

    res.json({
      success: true,
      data: classInfo,
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin lớp:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy thông tin lớp",
      error: error.message,
    });
  }
};

// Tạo lớp học mới
const createClass = async (req, res) => {
  try {
    const {
      classId,
      className,
      homeRoomTeacher,
      academicYear,
      maxStudents = 40,
      schedule,
    } = req.body;

    if (!classId || !className || !homeRoomTeacher || !academicYear) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc",
      });
    }

    const newClass = new Class({
      classId: classId.toLowerCase(),
      className,
      homeRoomTeacher,
      academicYear,
      maxStudents,
      schedule,
    });

    const savedClass = await newClass.save();

    res.status(201).json({
      success: true,
      message: "Đã tạo lớp học thành công",
      data: savedClass,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Mã lớp đã tồn tại",
      });
    }

    console.error("Lỗi khi tạo lớp:", error);
    res.status(500).json({
      success: false,
      message: "Không thể tạo lớp học",
      error: error.message,
    });
  }
};

// Cập nhật thông tin lớp
const updateClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const updateData = req.body;

    const updatedClass = await Class.findOneAndUpdate(
      { classId: classId.toLowerCase() },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedClass) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lớp học",
      });
    }

    res.json({
      success: true,
      message: "Đã cập nhật lớp học thành công",
      data: updatedClass,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật lớp:", error);
    res.status(500).json({
      success: false,
      message: "Không thể cập nhật lớp học",
      error: error.message,
    });
  }
};

// Xóa lớp học
const deleteClass = async (req, res) => {
  try {
    const { classId } = req.params;

    // Kiểm tra xem lớp có học sinh không
    const studentCount = await Student.countDocuments({
      class: classId.toLowerCase(),
      status: "active",
    });

    if (studentCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Không thể xóa lớp vì còn ${studentCount} học sinh đang học`,
      });
    }

    const deletedClass = await Class.findOneAndDelete({
      classId: classId.toLowerCase(),
    });

    if (!deletedClass) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lớp học",
      });
    }

    res.json({
      success: true,
      message: "Đã xóa lớp học thành công",
      data: deletedClass,
    });
  } catch (error) {
    console.error("Lỗi khi xóa lớp:", error);
    res.status(500).json({
      success: false,
      message: "Không thể xóa lớp học",
      error: error.message,
    });
  }
};

module.exports = {
  getAllClasses,
  getClassesByDate,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
};
