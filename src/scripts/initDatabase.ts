import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const dbName = 'attendance_db';

interface ClassData {
  classId: string;
  className: string;
  grade: number;
  homeRoomTeacher: string;
  academicYear: string;
  maxStudents: number;
  currentStudents: number;
  schedule: {
    days: string[];
    timeSlot: string;
  };
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface StudentData {
  studentId: string;
  fullName: string;
  class: string;
  grade: number;
  email: string;
  phone: string;
  parentPhone: string;
  address: string;
  dateOfBirth: Date;
  gender: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AttendanceRecord {
  attendanceId: string;
  studentId: string;
  studentName: string;
  classId: string;
  date: Date;
  session: string;
  status: string;
  note: string;
  recordedBy: string;
  recordedAt: Date;
  isEdited: boolean;
  editHistory: any[];
}

async function initializeDatabase() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    // Drop the entire database first to avoid conflicts
    await client.db(dbName).dropDatabase();
    console.log('🗑️ Dropped existing database');
    
    const db = client.db(dbName);
    
    // Insert classes data
    const classesData: ClassData[] = [
      {
        classId: '10a1',
        className: 'Lớp 10A1',
        grade: 10,
        homeRoomTeacher: 'Trần Thị B',
        academicYear: '2024-2025',
        maxStudents: 40,
        currentStudents: 35,
        schedule: {
          days: ['monday', 'wednesday', 'friday'],
          timeSlot: '07:00-11:30'
        },
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        classId: '10a2',
        className: 'Lớp 10A2',
        grade: 10,
        homeRoomTeacher: 'Nguyễn Văn C',
        academicYear: '2024-2025',
        maxStudents: 40,
        currentStudents: 32,
        schedule: {
          days: ['tuesday', 'thursday', 'saturday'],
          timeSlot: '07:00-11:30'
        },
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        classId: '11a1',
        className: 'Lớp 11A1',
        grade: 11,
        homeRoomTeacher: 'Phạm Văn E',
        academicYear: '2024-2025',
        maxStudents: 40,
        currentStudents: 38,
        schedule: {
          days: ['monday', 'wednesday', 'friday'],
          timeSlot: '13:00-17:00'
        },
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        classId: '11a2',
        className: 'Lớp 11A2',
        grade: 11,
        homeRoomTeacher: 'Hoàng Thị F',
        academicYear: '2024-2025',
        maxStudents: 40,
        currentStudents: 36,
        schedule: {
          days: ['tuesday', 'thursday', 'saturday'],
          timeSlot: '13:00-17:00'
        },
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        classId: '12a1',
        className: 'Lớp 12A1',
        grade: 12,
        homeRoomTeacher: 'Đỗ Văn G',
        academicYear: '2024-2025',
        maxStudents: 35,
        currentStudents: 30,
        schedule: {
          days: ['monday', 'wednesday', 'friday'],
          timeSlot: '07:00-11:30'
        },
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await db.collection('classes').insertMany(classesData);
    console.log('✅ Inserted classes data');
    
    // Insert students data
    const studentsData: StudentData[] = [];
    
    // Generate students for each class
    classesData.forEach((classInfo, classIndex) => {
      const studentCount = classInfo.currentStudents;
      
      for (let i = 1; i <= studentCount; i++) {
        const studentId = `${classInfo.classId.toUpperCase()}${String(i).padStart(3, '0')}`;
        const student: StudentData = {
          studentId,
          fullName: `Học sinh ${i} - ${classInfo.className}`,
          class: classInfo.classId,
          grade: classInfo.grade,
          email: `${studentId.toLowerCase()}@school.edu.vn`,
          phone: `098${String(classIndex + 1)}${String(i).padStart(5, '0')}`,
          parentPhone: `097${String(classIndex + 1)}${String(i).padStart(5, '0')}`,
          address: `Địa chỉ ${i}, Quận ${classIndex + 1}, TP.HCM`,
          dateOfBirth: new Date(2006 + classInfo.grade - 10, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          gender: i % 2 === 0 ? 'female' : 'male',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        studentsData.push(student);
      }
    });
    
    await db.collection('students').insertMany(studentsData);
    console.log('✅ Inserted students data');
    
    // Insert sample attendance records
    const attendanceRecords: AttendanceRecord[] = [];
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Add some sample attendance for yesterday
    studentsData.slice(0, 50).forEach((student, index) => {
      const record: AttendanceRecord = {
        attendanceId: `ATT_${yesterday.getFullYear()}${String(yesterday.getMonth() + 1).padStart(2, '0')}${String(yesterday.getDate()).padStart(2, '0')}_${student.studentId}_MORNING`,
        studentId: student.studentId,
        studentName: student.fullName,
        classId: student.class,
        date: yesterday,
        session: 'morning',
        status: index % 10 === 0 ? 'absent-excused' : index % 15 === 0 ? 'absent-unexcused' : 'present',
        note: index % 10 === 0 ? 'Ốm - Có giấy phép' : index % 15 === 0 ? 'Vắng không phép' : '',
        recordedBy: 'GV001',
        recordedAt: new Date(yesterday.getTime() + Math.random() * 8 * 60 * 60 * 1000),
        isEdited: false,
        editHistory: []
      };
      attendanceRecords.push(record);
    });
    
    await db.collection('attendancerecords').insertMany(attendanceRecords);
    console.log('✅ Inserted attendance records');
    
    // Insert teachers data
    const teachersData = [
      {
        teacherId: 'GV001',
        fullName: 'Nguyễn Văn A',
        email: 'gv001@school.edu.vn',
        phone: '0901234567',
        subject: 'Toán',
        role: 'teacher',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        teacherId: 'GV002',
        fullName: 'Trần Thị B',
        email: 'gv002@school.edu.vn',
        phone: '0901234568',
        subject: 'Văn',
        role: 'homeroom_teacher',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        teacherId: 'GV003',
        fullName: 'Nguyễn Văn C',
        email: 'gv003@school.edu.vn',
        phone: '0901234569',
        subject: 'Anh',
        role: 'homeroom_teacher',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await db.collection('teachers').insertMany(teachersData);
    console.log('✅ Inserted teachers data');
    
    console.log('\n🎉 Database initialization completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Classes: ${classesData.length}`);
    console.log(`   - Students: ${studentsData.length}`);
    console.log(`   - Attendance Records: ${attendanceRecords.length}`);
    console.log(`   - Teachers: ${teachersData.length}`);
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    await client.close();
  }
}

// Run the initialization
initializeDatabase().catch(console.error);