const mongoose = require('mongoose');

// Schema cho học sinh
const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  class: {
    type: String,
    required: true,
    lowercase: true
  },
  email: {
    type: String,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Email không hợp lệ'
    }
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /^[\+]?[0-9]{10,15}$/.test(v);
      },
      message: 'Số điện thoại không hợp lệ'
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'transferred'],
    default: 'active'
  },
  dateOfBirth: Date,
  address: String,
  parentContact: String
}, {
  timestamps: true
});

// Schema cho lớp học
const classSchema = new mongoose.Schema({
  classId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  className: {
    type: String,
    required: true
  },
  homeRoomTeacher: {
    type: String,
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  maxStudents: {
    type: Number,
    default: 40
  },
  currentStudents: {
    type: Number,
    default: 0
  },
  schedule: {
    days: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    timeSlot: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Schema cho điểm danh
const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    ref: 'Student'
  },
  studentName: {
    type: String,
    required: true
  },
  classId: {
    type: String,
    required: true,
    ref: 'Class'
  },
  date: {
    type: Date,
    required: true
  },
  session: {
    type: String,
    enum: ['morning', 'afternoon', 'evening'],
    default: 'morning'
  },
  status: {
    type: String,
    enum: ['present', 'absent-excused', 'absent-unexcused', 'late'],
    required: true
  },
  note: {
    type: String,
    default: ''
  },
  recordedBy: {
    type: String,
    required: true
  },
  recordedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
studentSchema.index({ class: 1, status: 1 });
attendanceSchema.index({ classId: 1, date: 1, session: 1 });
attendanceSchema.index({ studentId: 1, date: 1 });

module.exports = {
  Student: mongoose.model('Student', studentSchema),
  Class: mongoose.model('Class', classSchema),
  Attendance: mongoose.model('Attendance', attendanceSchema)
};