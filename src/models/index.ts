import mongoose from 'mongoose';

// Class Schema
const classSchema = new mongoose.Schema({
  classId: { type: String, required: true, unique: true },
  className: { type: String, required: true },
  grade: { type: Number, required: true },
  homeRoomTeacher: { type: String, required: true },
  academicYear: { type: String, required: true },
  maxStudents: { type: Number, required: true },
  currentStudents: { type: Number, required: true },
  schedule: {
    days: [String],
    timeSlot: String
  },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Student Schema
const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  class: { type: String, required: true },
  grade: { type: Number, required: true },
  email: String,
  phone: String,
  parentPhone: String,
  address: String,
  dateOfBirth: Date,
  gender: { type: String, enum: ['male', 'female'] },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Attendance Record Schema
const attendanceRecordSchema = new mongoose.Schema({
  attendanceId: { type: String, required: true, unique: true },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  classId: { type: String, required: true },
  date: { type: Date, required: true },
  session: { type: String, required: true },
  status: { 
    type: String, 
    required: true,
    enum: ['present', 'absent-excused', 'absent-unexcused', 'late']
  },
  note: { type: String, default: '' },
  recordedBy: { type: String, required: true },
  recordedAt: { type: Date, default: Date.now },
  isEdited: { type: Boolean, default: false },
  editHistory: [{
    editedBy: String,
    editedAt: Date,
    previousStatus: String,
    reason: String
  }]
});

// Teacher Schema
const teacherSchema = new mongoose.Schema({
  teacherId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: String,
  phone: String,
  subject: String,
  role: { type: String, enum: ['teacher', 'homeroom_teacher', 'admin'] },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Export models
export const Class = mongoose.models.Class || mongoose.model('Class', classSchema);
export const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);
export const AttendanceRecord = mongoose.models.AttendanceRecord || mongoose.model('AttendanceRecord', attendanceRecordSchema);
export const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', teacherSchema);

// Export interfaces
export interface IClass extends mongoose.Document {
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

export interface IStudent extends mongoose.Document {
  studentId: string;
  fullName: string;
  class: string;
  grade: number;
  email?: string;
  phone?: string;
  parentPhone?: string;
  address?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female';
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAttendanceRecord extends mongoose.Document {
  attendanceId: string;
  studentId: string;
  studentName: string;
  classId: string;
  date: Date;
  session: string;
  status: 'present' | 'absent-excused' | 'absent-unexcused' | 'late';
  note: string;
  recordedBy: string;
  recordedAt: Date;
  isEdited: boolean;
  editHistory: Array<{
    editedBy: string;
    editedAt: Date;
    previousStatus: string;
    reason: string;
  }>;
}

export interface ITeacher extends mongoose.Document {
  teacherId: string;
  fullName: string;
  email?: string;
  phone?: string;
  subject?: string;
  role: 'teacher' | 'homeroom_teacher' | 'admin';
  status: string;
  createdAt: Date;
  updatedAt: Date;
}