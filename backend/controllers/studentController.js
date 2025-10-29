const { Student, Class } = require("../models");

// Lấy tất cả học sinh
const getAllStudents = async (req, res) => {
  try {
    const { status = "active", class: classFilter, limit = 100 } = req.query;

    const query = { status };
    if (classFilter) {
      query.class = classFilter.toLowerCase();
    }

    const students = await Student.find(query)
      .sort({ class: 1, fullName: 1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: students,
      count: students.length,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách học sinh:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách học sinh",
      error: error.message,
    });
  }
};

// Lấy học sinh theo lớp
const getStudentsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const { status = "active" } = req.query;

    const students = await Student.find({
      class: classId.toLowerCase(),
      status,
    }).sort({ fullName: 1 });

    res.json({
      success: true,
      data: students,
      count: students.length,
    });
  } catch (error) {
    console.error("Lỗi khi lấy học sinh theo lớp:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách học sinh theo lớp",
      error: error.message,
    });
  }
};

// Lấy thông tin học sinh theo ID
const getStudentById = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findOne({
      studentId: studentId.toUpperCase(),
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy học sinh",
      });
    }

    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin học sinh:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy thông tin học sinh",
      error: error.message,
    });
  }
};

// Tạo học sinh mới
const createStudent = async (req, res) => {
  try {
    const {
      studentId,
      fullName,
      class: studentClass,
      email,
      phone,
      dateOfBirth,
      address,
      parentContact,
    } = req.body;

    if (!studentId || !fullName || !studentClass) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc (mã học sinh, tên, lớp)",
      });
    }

    // Kiểm tra lớp có tồn tại không
    const classExists = await Class.findOne({
      classId: studentClass.toLowerCase(),
    });
    if (!classExists) {
      return res.status(400).json({
        success: false,
        message: "Lớp học không tồn tại",
      });
    }

    const newStudent = new Student({
      studentId: studentId.toUpperCase(),
      fullName,
      class: studentClass.toLowerCase(),
      email,
      phone,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      address,
      parentContact,
    });

    const savedStudent = await newStudent.save();

    // Cập nhật số lượng học sinh trong lớp
    await Class.findOneAndUpdate(
      { classId: studentClass.toLowerCase() },
      { $inc: { currentStudents: 1 } }
    );

    res.status(201).json({
      success: true,
      message: "Đã tạo học sinh thành công",
      data: savedStudent,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Mã học sinh đã tồn tại",
      });
    }

    console.error("Lỗi khi tạo học sinh:", error);
    res.status(500).json({
      success: false,
      message: "Không thể tạo học sinh",
      error: error.message,
    });
  }
};

// Cập nhật thông tin học sinh
const updateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const updateData = req.body;

    // Nếu thay đổi lớp, kiểm tra lớp mới có tồn tại không
    if (updateData.class) {
      const classExists = await Class.findOne({
        classId: updateData.class.toLowerCase(),
      });
      if (!classExists) {
        return res.status(400).json({
          success: false,
          message: "Lớp học mới không tồn tại",
        });
      }
      updateData.class = updateData.class.toLowerCase();
    }

    // Xử lý ngày sinh
    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }

    const oldStudent = await Student.findOne({
      studentId: studentId.toUpperCase(),
    });
    if (!oldStudent) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy học sinh",
      });
    }

    const updatedStudent = await Student.findOneAndUpdate(
      { studentId: studentId.toUpperCase() },
      updateData,
      { new: true, runValidators: true }
    );

    // Nếu thay đổi lớp, cập nhật số lượng học sinh
    if (updateData.class && oldStudent.class !== updateData.class) {
      // Giảm số lượng lớp cũ
      await Class.findOneAndUpdate(
        { classId: oldStudent.class },
        { $inc: { currentStudents: -1 } }
      );
      // Tăng số lượng lớp mới
      await Class.findOneAndUpdate(
        { classId: updateData.class },
        { $inc: { currentStudents: 1 } }
      );
    }

    res.json({
      success: true,
      message: "Đã cập nhật học sinh thành công",
      data: updatedStudent,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật học sinh:", error);
    res.status(500).json({
      success: false,
      message: "Không thể cập nhật học sinh",
      error: error.message,
    });
  }
};

// Xóa học sinh
const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const deletedStudent = await Student.findOneAndDelete({
      studentId: studentId.toUpperCase(),
    });

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy học sinh",
      });
    }

    // Giảm số lượng học sinh trong lớp
    await Class.findOneAndUpdate(
      { classId: deletedStudent.class },
      { $inc: { currentStudents: -1 } }
    );

    res.json({
      success: true,
      message: "Đã xóa học sinh thành công",
      data: deletedStudent,
    });
  } catch (error) {
    console.error("Lỗi khi xóa học sinh:", error);
    res.status(500).json({
      success: false,
      message: "Không thể xóa học sinh",
      error: error.message,
    });
  }
};

// Tìm kiếm học sinh
const searchStudents = async (req, res) => {
  try {
    const { query, class: classFilter, limit = 50 } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Thiếu từ khóa tìm kiếm",
      });
    }

    const searchQuery = {
      status: "active",
      $or: [
        { fullName: { $regex: query, $options: "i" } },
        { studentId: { $regex: query.toUpperCase(), $options: "i" } },
      ],
    };

    if (classFilter) {
      searchQuery.class = classFilter.toLowerCase();
    }

    const students = await Student.find(searchQuery)
      .sort({ class: 1, fullName: 1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: students,
      count: students.length,
      query: query,
    });
  } catch (error) {
    console.error("Lỗi khi tìm kiếm học sinh:", error);
    res.status(500).json({
      success: false,
      message: "Không thể tìm kiếm học sinh",
      error: error.message,
    });
  }
};

module.exports = {
  getAllStudents,
  getStudentsByClass,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  searchStudents,
};
