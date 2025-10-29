// AttendanceService đơn giản cho client-side (không dùng MongoDB)
export class AttendanceService {
  // Mock data cho các lớp học
  private static mockClasses = [
    {
      classId: '10a1',
      className: 'Lớp 10A1',
      homeRoomTeacher: 'Trần Thị B',
      academicYear: '2024-2025',
      maxStudents: 40,
      currentStudents: 35,
      schedule: {
        days: ['monday', 'wednesday', 'friday'],
        timeSlot: '07:00-11:30'
      },
      status: 'active'
    },
    {
      classId: '10a2',
      className: 'Lớp 10A2',
      homeRoomTeacher: 'Nguyễn Văn C',
      academicYear: '2024-2025',
      maxStudents: 40,
      currentStudents: 32,
      schedule: {
        days: ['tuesday', 'thursday', 'saturday'],
        timeSlot: '07:00-11:30'
      },
      status: 'active'
    },
    {
      classId: '11a1',
      className: 'Lớp 11A1',
      homeRoomTeacher: 'Phạm Văn E',
      academicYear: '2024-2025',
      maxStudents: 40,
      currentStudents: 38,
      schedule: {
        days: ['monday', 'wednesday', 'friday'],
        timeSlot: '13:00-17:00'
      },
      status: 'active'
    },
    {
      classId: '11a2',
      className: 'Lớp 11A2',
      homeRoomTeacher: 'Hoàng Thị F',
      academicYear: '2024-2025',
      maxStudents: 40,
      currentStudents: 36,
      schedule: {
        days: ['tuesday', 'thursday', 'saturday'],
        timeSlot: '13:00-17:00'
      },
      status: 'active'
    },
    {
      classId: '12a1',
      className: 'Lớp 12A1',
      homeRoomTeacher: 'Đỗ Văn G',
      academicYear: '2024-2025',
      maxStudents: 35,
      currentStudents: 30,
      schedule: {
        days: ['monday', 'wednesday', 'friday'],
        timeSlot: '07:00-11:30'
      },
      status: 'active'
    }
  ];

  // Mock data cho học sinh với tên thật
  private static generateStudentsForClass(classId: string, count: number) {
    // Danh sách tên học sinh thật
    const vietnameseNames = [
      'Nguyễn Văn An', 'Trần Thị Bích', 'Lê Hoàng Cường', 'Phạm Thị Dung', 'Hoàng Văn Em',
      'Ngô Thị Phương', 'Đỗ Văn Giang', 'Vũ Thị Hà', 'Bùi Văn Hùng', 'Đinh Thị Linh',
      'Cao Văn Khoa', 'Mai Thị Lan', 'Phan Văn Minh', 'Võ Thị Nga', 'Lý Văn Ơn',
      'Đặng Thị Phương', 'Nguyễn Văn Quân', 'Trần Thị Rạng', 'Lê Văn Sơn', 'Phạm Thị Tuyết',
      'Hoàng Văn Uy', 'Ngô Thị Vân', 'Đỗ Văn Xuân', 'Vũ Thị Yến', 'Bùi Văn Zin',
      'Đinh Thị Ánh', 'Cao Văn Bình', 'Mai Thị Cúc', 'Phan Văn Đức', 'Võ Thị Ê',
      'Lý Văn Phúc', 'Đặng Thị Giang', 'Nguyễn Văn Hải', 'Trần Thị Ích', 'Lê Văn Kiên',
      'Phạm Thị Loan', 'Hoàng Văn Mạnh', 'Ngô Thị Nga', 'Đỗ Văn Ôn', 'Vũ Thị Phương'
    ];

    const students = [];
    for (let i = 1; i <= count; i++) {
      // Sử dụng tên thật, nếu hết tên thì tạo tên mới
      const nameIndex = (i - 1) % vietnameseNames.length;
      let fullName = vietnameseNames[nameIndex];
      
      // Nếu vượt quá danh sách tên, thêm số phía sau
      if (i > vietnameseNames.length) {
        const suffix = Math.floor((i - 1) / vietnameseNames.length) + 1;
        fullName = `${fullName} ${suffix}`;
      }

      students.push({
        studentId: `${classId.toUpperCase()}${String(i).padStart(3, '0')}`,
        fullName: fullName,
        class: classId,
        email: `${classId}${i}@school.edu.vn`,
        phone: `098${String(i).padStart(7, '0')}`,
        status: 'active'
      });
    }
    return students;
  }

  // Mock storage for attendance records
  private static attendanceStorage: Map<string, Array<{
    studentId: string;
    studentName: string;
    classId: string;
    date: string;
    session: string;
    status: 'present' | 'absent-excused' | 'absent-unexcused';
    note: string;
    recordedBy: string;
    recordedAt: Date;
  }>> = new Map();

  // Get classes by date - only show classes that have schedule on selected date
  static async getClassesByDate(date: Date) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get day of week from date (0 = Sunday, 1 = Monday, ...)
    const dayOfWeek = date.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const selectedDay = dayNames[dayOfWeek];
    
    // Filter classes that have schedule on the selected day
    const classesWithSchedule = this.mockClasses.filter(classItem => {
      return classItem.schedule.days.includes(selectedDay);
    });
    
    console.log(`Classes with schedule on ${selectedDay}:`, classesWithSchedule.map(c => c.className));
    
    return classesWithSchedule;
  }

  // Get all classes
  static async getAllClasses() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.mockClasses;
  }

  // Get class by ID
  static async getClassById(classId: string) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.mockClasses.find(c => c.classId === classId) || null;
  }

  // Get students by class
  static async getStudentsByClass(classId: string) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const classInfo = this.mockClasses.find(c => c.classId === classId);
    if (!classInfo) {
      return [];
    }
    
    return this.generateStudentsForClass(classId, classInfo.currentStudents);
  }

  // Get attendance records by date and class
  static async getAttendanceByDateAndClass(date: Date, classId: string, session: string = 'morning') {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const dateStr = date.toISOString().split('T')[0];
    const key = `${classId}-${dateStr}-${session}`;
    
    return this.attendanceStorage.get(key) || [];
  }

  // Save multiple attendance records
  static async saveMultipleAttendance(attendanceData: Array<{
    studentId: string;
    studentName: string;
    classId: string;
    date: Date;
    session: 'morning' | 'afternoon' | 'evening';
    status: 'present' | 'absent-excused' | 'absent-unexcused';
    note?: string;
    recordedBy: string;
  }>) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Saving attendance data:', attendanceData);
    
    // Save to mock storage
    if (attendanceData.length > 0) {
      const firstRecord = attendanceData[0];
      const dateStr = firstRecord.date.toISOString().split('T')[0];
      const key = `${firstRecord.classId}-${dateStr}-${firstRecord.session}`;
      
      const records = attendanceData.map(data => ({
        studentId: data.studentId,
        studentName: data.studentName,
        classId: data.classId,
        date: dateStr,
        session: data.session,
        status: data.status,
        note: data.note || '',
        recordedBy: data.recordedBy,
        recordedAt: new Date()
      }));
      
      this.attendanceStorage.set(key, records);
      console.log('Stored attendance records for key:', key, records);
    }
    
    // Simulate successful save
    return { 
      success: true, 
      count: attendanceData.length,
      message: `Đã lưu điểm danh cho ${attendanceData.length} học sinh`
    };
  }

  // Get attendance statistics
  static async getAttendanceStats(classId: string, startDate: Date, endDate: Date) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      present: 0,
      absentExcused: 0,
      absentUnexcused: 0,
      late: 0,
      total: 0
    };
  }

  // Legacy methods for backward compatibility
  static async markAttendance(studentId: string, classId: string, status: 'present' | 'absent' | 'late') {
    console.log(`Marking ${studentId} as ${status} in class ${classId}`);
    return { success: true };
  }

  static async getAttendanceByClass(classId: string) {
    return await this.getStudentsByClass(classId);
  }

  static async saveAttendance(attendanceData: any) {
    const result = await this.saveMultipleAttendance([attendanceData]);
    return {
      success: result.success,
      attendanceId: `ATT_${Date.now()}_${attendanceData.studentId}`,
      ...attendanceData,
      recordedAt: new Date()
    };
  }

  static async getStudentAttendanceHistory(studentId: string, startDate?: Date, endDate?: Date) {
    console.log(`Getting attendance history for student ${studentId}`);
    return [];
  }

  static async getMissingAttendanceRecords(classId: string, date: Date, session: string) {
    const allStudents = await this.getStudentsByClass(classId);
    const recordedAttendance = await this.getAttendanceByDateAndClass(date, classId, session);
    
    return {
      missingStudents: allStudents,
      totalStudents: allStudents.length,
      recordedStudents: recordedAttendance.length
    };
  }
}