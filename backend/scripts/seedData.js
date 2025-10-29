const mongoose = require("mongoose");
const { Student, Class, Attendance } = require("../models");
require("dotenv").config();

const seedData = async () => {
  try {
    // Kết nối database
    const MONGODB_URI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/attendance_system";
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Kết nối database thành công");

    // Xóa dữ liệu cũ
    await Promise.all([
      Student.deleteMany({}),
      Class.deleteMany({}),
      Attendance.deleteMany({}),
    ]);
    console.log("🗑️ Đã xóa dữ liệu cũ");

    // Tạo dữ liệu lớp học
    const classesData = [
      {
        classId: "10a1",
        className: "10A1",
        homeRoomTeacher: "Nguyễn Văn A",
        academicYear: "2024-2025",
        maxStudents: 40,
        currentStudents: 35,
        schedule: {
          days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
          timeSlot: "7:00-11:30",
        },
        status: "active",
      },
      {
        classId: "10a2",
        className: "10A2",
        homeRoomTeacher: "Trần Thị B",
        academicYear: "2024-2025",
        maxStudents: 40,
        currentStudents: 38,
        schedule: {
          days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
          timeSlot: "7:00-11:30",
        },
        status: "active",
      },
      {
        classId: "11a1",
        className: "11A1",
        homeRoomTeacher: "Lê Văn C",
        academicYear: "2024-2025",
        maxStudents: 40,
        currentStudents: 36,
        schedule: {
          days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
          timeSlot: "13:00-17:30",
        },
        status: "active",
      },
      {
        classId: "12a1",
        className: "12A1",
        homeRoomTeacher: "Phạm Thị D",
        academicYear: "2024-2025",
        maxStudents: 40,
        currentStudents: 32,
        schedule: {
          days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
          timeSlot: "7:00-11:30",
        },
        status: "active",
      },
    ];

    const savedClasses = await Class.insertMany(classesData);
    console.log(`✅ Đã tạo ${savedClasses.length} lớp học`);

    // Tạo dữ liệu học sinh
    const studentsData = [];
    const classIds = ["10a1", "10a2", "11a1", "12a1"];
    const studentCounts = [35, 38, 36, 32];

    classIds.forEach((classId, classIndex) => {
      const studentCount = studentCounts[classIndex];
      for (let i = 1; i <= studentCount; i++) {
        const studentId = `${classId.toUpperCase()}${i
          .toString()
          .padStart(2, "0")}`;
        studentsData.push({
          studentId,
          fullName: `Học sinh ${i} - Lớp ${classId.toUpperCase()}`,
          class: classId,
          email: `${studentId.toLowerCase()}@student.edu.vn`,
          phone: `09${Math.floor(Math.random() * 100000000)
            .toString()
            .padStart(8, "0")}`,
          status: "active",
          dateOfBirth: new Date(
            2006 + Math.floor(Math.random() * 3),
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          ),
          address: `Địa chỉ học sinh ${i}`,
          parentContact: `Phụ huynh ${i} - ${classId.toUpperCase()}`,
        });
      }
    });

    const savedStudents = await Student.insertMany(studentsData);
    console.log(`✅ Đã tạo ${savedStudents.length} học sinh`);

    // Tạo dữ liệu điểm danh mẫu cho 7 ngày gần đây
    const attendanceData = [];
    const today = new Date();

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const date = new Date(today);
      date.setDate(date.getDate() - dayOffset);

      // Chỉ tạo điểm danh cho các ngày trong tuần (thứ 2-6)
      const dayOfWeek = date.getDay();
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        for (const student of savedStudents) {
          // 85% có mặt, 10% vắng có phép, 5% vắng không phép
          const rand = Math.random();
          let status,
            note = "";

          if (rand < 0.85) {
            status = "present";
          } else if (rand < 0.95) {
            status = "absent-excused";
            const excusedReasons = ["Ốm", "Có việc gia đình", "Đi khám bệnh"];
            note =
              excusedReasons[Math.floor(Math.random() * excusedReasons.length)];
          } else {
            status = "absent-unexcused";
            note = "Vắng không phép";
          }

          attendanceData.push({
            studentId: student.studentId,
            studentName: student.fullName,
            classId: student.class,
            date: new Date(date),
            session: "morning",
            status,
            note,
            recordedBy: "GV001",
            recordedAt: new Date(),
          });
        }
      }
    }

    const savedAttendance = await Attendance.insertMany(attendanceData);
    console.log(`✅ Đã tạo ${savedAttendance.length} bản ghi điểm danh`);

    console.log("🎉 Khởi tạo dữ liệu mẫu thành công!");
    console.log("📊 Thống kê:");
    console.log(`   - Số lớp: ${savedClasses.length}`);
    console.log(`   - Số học sinh: ${savedStudents.length}`);
    console.log(`   - Số bản ghi điểm danh: ${savedAttendance.length}`);
  } catch (error) {
    console.error("❌ Lỗi khi khởi tạo dữ liệu:", error);
  } finally {
    await mongoose.connection.close();
    console.log("📴 Đã đóng kết nối database");
  }
};

// Chạy script
if (require.main === module) {
  seedData();
}

module.exports = seedData;
