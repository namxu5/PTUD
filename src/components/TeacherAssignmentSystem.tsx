import { useState } from 'react';
import { AssignmentTable } from './AssignmentTable';
import { AssignmentDialog } from './AssignmentDialog';
import { Toaster } from './ui/sonner';
import { toast } from 'sonner@2.0.3';
import { BookOpen, Users, GraduationCap } from 'lucide-react';

export interface Class {
  id: string;
  name: string;
  grade: number;
  subjects: Subject[];
}

export interface Subject {
  id: string;
  name: string;
  block?: 'tu_nhien' | 'xa_hoi' | 'khac';
  assignedTeacher?: Teacher;
}

export interface Teacher {
  id: string;
  name: string;
  specialization: string[];
  currentHours: number;
  maxHours: number;
  currentGrades: number[];
}

// Mock data
export const mockClasses: Class[] = [
  {
    id: '1',
    name: '10A1',
    grade: 10,
    subjects: [
      // Môn bắt buộc (không thuộc khối)
      { id: 's1', name: 'Toán', block: 'khac' },
      { id: 's2', name: 'Văn', block: 'khac' },
      { id: 's3', name: 'Tiếng Anh', block: 'khac' },
      { id: 's42', name: 'Giáo dục thể chất', block: 'khac' },
      { id: 's43', name: 'GDQP-AN', block: 'khac' },
      { id: 's44', name: 'Hoạt động trải nghiệm', block: 'khac' },
      { id: 's45', name: 'Giáo dục địa phương', block: 'khac' },

      // Khối tự nhiên (A1/A2)
      { id: 's4', name: 'Vật lý', block: 'tu_nhien' },
      { id: 's5', name: 'Hóa học', block: 'tu_nhien' },
      { id: 's36', name: 'Sinh học', block: 'tu_nhien' },
      { id: 's40', name: 'Tin học', block: 'khac' },
      { id: 's41', name: 'Công nghệ', block: 'khac' },
    ],
  },
  {
    id: '2',
    name: '10A2',
    grade: 10,
    subjects: [
      // Môn bắt buộc (không thuộc khối)
      { id: 's6', name: 'Toán', block: 'khac'},
      { id: 's7', name: 'Văn', block: 'khac' },
      { id: 's8', name: 'Tiếng Anh', block: 'khac' },
      { id: 's53', name: 'Giáo dục thể chất', block: 'khac' },
      { id: 's54', name: 'GDQP-AN', block: 'khac' },
      { id: 's55', name: 'Hoạt động trải nghiệm', block: 'khac' },
      { id: 's56', name: 'Giáo dục địa phương', block: 'khac' },

      // Khối tự nhiên
      { id: 's9', name: 'Vật lý', block: 'tu_nhien' },
      { id: 's10', name: 'Hóa học', block: 'tu_nhien' },
      { id: 's47', name: 'Sinh học', block: 'tu_nhien' },
      { id: 's51', name: 'Tin học', block: 'khac' },
      { id: 's52', name: 'Công nghệ', block: 'khac' },
    ],
  },
  {
    id: '3',
    name: '10A3',
    grade: 10,
    subjects: [
      // Môn bắt buộc (không thuộc khối)
      { id: 's11', name: 'Toán', block: 'khac' },
      { id: 's12', name: 'Văn', block: 'khac' },
      { id: 's13', name: 'Tiếng Anh', block: 'khac' },
      { id: 's66', name: 'Giáo dục thể chất', block: 'khac' },
      { id: 's67', name: 'GDQP-AN', block: 'khac' },
      { id: 's68', name: 'Hoạt động trải nghiệm', block: 'khac' },
      { id: 's69', name: 'Giáo dục địa phương', block: 'khac' },

      // Khối xã hội (A3/A4)
      { id: 's14', name: 'Lịch sử', block: 'xa_hoi' },
      { id: 's15', name: 'Địa lý', block: 'xa_hoi' },
      { id: 's58', name: 'GDCD', block: 'xa_hoi' },
      { id: 's62', name: 'Tin học', block: 'khac' },
      { id: 's63', name: 'Công nghệ', block: 'khac' },
    ],
  },
  {
    id: '4',
    name: '10A4',
    grade: 10,
    subjects: [
      // Môn bắt buộc (không thuộc khối)
      { id: 's11', name: 'Toán', block: 'khac' },
      { id: 's12', name: 'Văn', block: 'khac' },
      { id: 's13', name: 'Tiếng Anh', block: 'khac' },
      { id: 's66', name: 'Giáo dục thể chất', block: 'khac' },
      { id: 's67', name: 'GDQP-AN', block: 'khac' },
      { id: 's68', name: 'Hoạt động trải nghiệm', block: 'khac' },
      { id: 's69', name: 'Giáo dục địa phương', block: 'khac' },

      // Khối xã hội (A3/A4)
      { id: 's14', name: 'Lịch sử', block: 'xa_hoi' },
      { id: 's15', name: 'Địa lý', block: 'xa_hoi' },
      { id: 's58', name: 'GDCD', block: 'xa_hoi' },
      { id: 's62', name: 'Tin học', block: 'khac' },
      { id: 's63', name: 'Công nghệ', block: 'khac' },
    ],
  },

  {
    id: '5',
    name: '11A1',
    grade: 11,
    subjects: [
      // Môn bắt buộc (không thuộc khối)
      { id: 's16', name: 'Toán', block: 'khac' },
      { id: 's17', name: 'Văn', block: 'khac' },
      { id: 's18', name: 'Tiếng Anh', block: 'khac' },
      { id: 's76', name: 'Giáo dục thể chất', block: 'khac' },
      { id: 's77', name: 'GDQP-AN', block: 'khac' },
      { id: 's78', name: 'Hoạt động trải nghiệm', block: 'khac' },
      { id: 's79', name: 'Giáo dục địa phương', block: 'khac' },

      // Khối tự nhiên
      { id: 's19', name: 'Vật lý', block: 'tu_nhien' },
      { id: 's20', name: 'Hóa học', block: 'tu_nhien' },
      { id: 's69', name: 'Sinh học', block: 'tu_nhien' },
      { id: 's73', name: 'Tin học', block: 'khac' },
      { id: 's74', name: 'Công nghệ', block: 'khac' },
    ],
  },
  {
    id: '6',
    name: '11A2',
    grade: 11,
    subjects: [
      // Môn bắt buộc (không thuộc khối)
      { id: 's21', name: 'Toán', block: 'khac' },
      { id: 's22', name: 'Văn', block: 'khac' },
      { id: 's23', name: 'Tiếng Anh', block: 'khac' },
      { id: 's80', name: 'Giáo dục thể chất', block: 'khac' },
      { id: 's81', name: 'GDQP-AN', block: 'khac' },
      { id: 's82', name: 'Hoạt động trải nghiệm', block: 'khac' },
      { id: 's83', name: 'Giáo dục địa phương', block: 'khac' },

      // Khối tự nhiên
      { id: 's24', name: 'Vật lý', block: 'tu_nhien' },
      { id: 's25', name: 'Hóa học', block: 'tu_nhien' },
      { id: 's79', name: 'Sinh học', block: 'tu_nhien' },
      { id: 's84', name: 'Tin học', block: 'khac' },
      { id: 's85', name: 'Công nghệ', block: 'khac' },
    ],
  },

  {
    id: '7',
    name: '11A3',
    grade: 11,
    subjects: [
      // Môn bắt buộc (không thuộc khối)
      { id: 's11', name: 'Toán', block: 'khac' },
      { id: 's12', name: 'Văn', block: 'khac' },
      { id: 's13', name: 'Tiếng Anh', block: 'khac' },
      { id: 's66', name: 'Giáo dục thể chất', block: 'khac' },
      { id: 's67', name: 'GDQP-AN', block: 'khac' },
      { id: 's68', name: 'Hoạt động trải nghiệm', block: 'khac' },
      { id: 's69', name: 'Giáo dục địa phương', block: 'khac' },

      // Khối xã hội (A3/A4)
      { id: 's14', name: 'Lịch sử', block: 'xa_hoi' },
      { id: 's15', name: 'Địa lý', block: 'xa_hoi' },
      { id: 's58', name: 'GDCD', block: 'xa_hoi' },
      { id: 's62', name: 'Tin học', block: 'khac' },
      { id: 's63', name: 'Công nghệ', block: 'khac' },
    ],
  },
  {
    id: '8',
    name: '11A4',
    grade: 11,
    subjects: [
      // Môn bắt buộc (không thuộc khối)
      { id: 's11', name: 'Toán', block: 'khac' },
      { id: 's12', name: 'Văn', block: 'khac' },
      { id: 's13', name: 'Tiếng Anh', block: 'khac' },
      { id: 's66', name: 'Giáo dục thể chất', block: 'khac' },
      { id: 's67', name: 'GDQP-AN', block: 'khac' },
      { id: 's68', name: 'Hoạt động trải nghiệm', block: 'khac' },
      { id: 's69', name: 'Giáo dục địa phương', block: 'khac' },

      // Khối xã hội (A3/A4)
      { id: 's14', name: 'Lịch sử', block: 'xa_hoi' },
      { id: 's15', name: 'Địa lý', block: 'xa_hoi' },
      { id: 's58', name: 'GDCD', block: 'xa_hoi' },
      { id: 's62', name: 'Tin học', block: 'khac' },
      { id: 's63', name: 'Công nghệ', block: 'khac' },
    ],
  },


  {
    id: '9',
    name: '12A1',
    grade: 12,
    subjects: [
      // Môn bắt buộc (không thuộc khối)
      { id: 's26', name: 'Toán', block: 'khac' },
      { id: 's27', name: 'Văn', block: 'khac' },
      { id: 's28', name: 'Tiếng Anh', block: 'khac' },
      { id: 's90', name: 'GDQP-AN', block: 'khac' },
      { id: 's91', name: 'Hoạt động trải nghiệm', block: 'khac' },
      { id: 's92', name: 'Giáo dục địa phương', block: 'khac' },

      // Khối tự nhiên
      { id: 's29', name: 'Vật lý', block: 'tu_nhien' },
      { id: 's30', name: 'Hóa học', block: 'tu_nhien' },
      { id: 's89', name: 'Sinh học', block: 'tu_nhien' },
      { id: 's93', name: 'Tin học', block: 'khac' },
      { id: 's94', name: 'Công nghệ', block: 'khac' },
    ],
  },
  {
    id: '10',
    name: '12A2',
    grade: 12,
    subjects: [
      // Môn bắt buộc (không thuộc khối)
      { id: 's31', name: 'Toán', block: 'khac' },
      { id: 's32', name: 'Văn', block: 'khac' },
      { id: 's33', name: 'Tiếng Anh', block: 'khac' },
      { id: 's99', name: 'Giáo dục thể chất', block: 'khac' },
      { id: 's100', name: 'GDQP-AN', block: 'khac' },
      { id: 's101', name: 'Hoạt động trải nghiệm', block: 'khac' },
      { id: 's102', name: 'Giáo dục địa phương', block: 'khac' },

      // Khối tự nhiên
      { id: 's34', name: 'Vật lý', block: 'tu_nhien' },
      { id: 's35', name: 'Hóa học', block: 'tu_nhien' },
      { id: 's103', name: 'Sinh học', block: 'tu_nhien' },
      { id: 's104', name: 'Tin học', block: 'khac' },
      { id: 's105', name: 'Công nghệ', block: 'khac' },
    ],
  },
  {
    id: '11',
    name: '12A3',
    grade: 12,
    subjects: [
      // Môn bắt buộc (không thuộc khối)
      { id: 's11', name: 'Toán', block: 'khac' },
      { id: 's12', name: 'Văn', block: 'khac' },
      { id: 's13', name: 'Tiếng Anh', block: 'khac' },
      { id: 's66', name: 'Giáo dục thể chất', block: 'khac' },
      { id: 's67', name: 'GDQP-AN', block: 'khac' },
      { id: 's68', name: 'Hoạt động trải nghiệm', block: 'khac' },
      { id: 's69', name: 'Giáo dục địa phương', block: 'khac' },

      // Khối xã hội (A3/A4)
      { id: 's14', name: 'Lịch sử', block: 'xa_hoi' },
      { id: 's15', name: 'Địa lý', block: 'xa_hoi' },
      { id: 's58', name: 'GDCD', block: 'xa_hoi' },
      { id: 's62', name: 'Tin học', block: 'khac' },
      { id: 's63', name: 'Công nghệ', block: 'khac' },
    ],
  },
  {
    id: '12',
    name: '12A4',
    grade: 12,
    subjects: [
      // Môn bắt buộc (không thuộc khối)
      { id: 's11', name: 'Toán', block: 'khac' },
      { id: 's12', name: 'Văn', block: 'khac' },
      { id: 's13', name: 'Tiếng Anh', block: 'khac' },
      { id: 's66', name: 'Giáo dục thể chất', block: 'khac' },
      { id: 's67', name: 'GDQP-AN', block: 'khac' },
      { id: 's68', name: 'Hoạt động trải nghiệm', block: 'khac' },
      { id: 's69', name: 'Giáo dục địa phương', block: 'khac' },

      // Khối xã hội (A3/A4)
      { id: 's14', name: 'Lịch sử', block: 'xa_hoi' },
      { id: 's15', name: 'Địa lý', block: 'xa_hoi' },
      { id: 's58', name: 'GDCD', block: 'xa_hoi' },
      { id: 's62', name: 'Tin học', block: 'khac' },
      { id: 's63', name: 'Công nghệ', block: 'khac' },
    ],
  },

];

export const mockTeachers: Teacher[] = [
  // Giáo viên Toán
  {id: 't1', name: 'Nguyễn Văn A', specialization: ['Toán'], currentHours: 16, maxHours: 20, currentGrades: [10,11] },
  {id: 't100', name: 'Nguyễn Thị B', specialization: ['Toán'], currentHours: 0, maxHours: 20, currentGrades: [10,11] },
  { id: 't7', name: 'Vũ Văn G', specialization: ['Toán'], currentHours: 0, maxHours: 20, currentGrades: [11,12] },
  { id: 't9', name: 'Đặng Thị K', specialization: ['Toán'], currentHours: 0, maxHours: 20, currentGrades: [12] },
  { id: 't11', name: 'Mai Thị M', specialization: ['Toán'], currentHours: 0, maxHours: 20, currentGrades: [12] },
  
  // Giáo viên Văn
  { id: 't3', name: 'Lê Văn C', specialization: ['Văn'], currentHours: 0, maxHours: 20, currentGrades: [10,11] },
  { id: 't8', name: 'Bùi Thị H', specialization: ['Văn'], currentHours: 0, maxHours: 20, currentGrades: [10,11] },
  { id: 't12', name: 'Trương Văn N', specialization: ['Văn'], currentHours: 0, maxHours: 20, currentGrades: [10,11] },
  { id: 't13', name: 'Võ Thị O', specialization: ['Văn'], currentHours: 0, maxHours: 20, currentGrades: [12] },
  { id: 't14', name: 'Đinh Văn P', specialization: ['Văn'], currentHours: 0, maxHours: 20, currentGrades: [12] },
  
  // Giáo viên Anh
  { id: 't4', name: 'Phạm Thị D', specialization: ['Anh'], currentHours: 0, maxHours: 20, currentGrades: [] },
  { id: 't15', name: 'Lý Thị Q', specialization: ['Anh'], currentHours: 0, maxHours: 20, currentGrades: [] },
  { id: 't16', name: 'Dương Văn R', specialization: ['Anh'], currentHours: 0, maxHours: 20, currentGrades: [] },
  { id: 't17', name: 'Hồ Thị S', specialization: ['Anh'], currentHours: 0, maxHours: 20, currentGrades: [] },
  
  // Giáo viên Lý
  { id: 't5', name: 'Hoàng Văn E', specialization: ['Vật lý'], currentHours: 0, maxHours: 20, currentGrades: [] },
  { id: 't18', name: 'Tạ Văn T', specialization: ['Vật lý'], currentHours: 0, maxHours: 20, currentGrades: [] },
  { id: 't19', name: 'Lâm Thị U', specialization: ['Vật lý'], currentHours: 0, maxHours: 20, currentGrades: [] },
  { id: 't20', name: 'Châu Văn V', specialization: ['Vật lý'], currentHours: 0, maxHours: 20, currentGrades: [] },
  
  // Giáo viên Hóa
  { id: 't6', name: 'Đỗ Thị F', specialization: ['Hóa học'], currentHours: 0, maxHours: 20, currentGrades: [] },
  { id: 't21', name: 'Huỳnh Văn W', specialization: ['Hóa học'], currentHours: 0, maxHours: 20, currentGrades: [] },
  { id: 't22', name: 'Đoàn Thị X', specialization: ['Hóa học'], currentHours: 0, maxHours: 20, currentGrades: [] },
  { id: 't23', name: 'Sơn Văn Y', specialization: ['Hóa học'], currentHours: 0, maxHours: 20, currentGrades: [] },
  
  // Giáo viên đa năng
  { id: 't24', name: 'Thái Thị Z', specialization: ['Toán', 'Vật lý'], currentHours: 0, maxHours: 20, currentGrades: [] },
  { id: 't25', name: 'Kim Văn AA', specialization: ['Hóa học', 'Sinh học'], currentHours: 0, maxHours: 20, currentGrades: [] },

  // Giáo viên Sinh
  { id: 't26', name: 'Ngô Thị H', specialization: ['Sinh học'], currentHours: 0, maxHours: 20, currentGrades: [] },
  { id: 't10', name: 'Phan Văn L', specialization: ['Sinh học'], currentHours: 0, maxHours: 20, currentGrades: [] },
  // Giáo viên Lịch sử
  { id: 't27', name: 'Phan Văn I', specialization: ['Lịch sử'], currentHours: 0, maxHours: 20, currentGrades: [] },
  { id: 't7', name: 'Phan Văn E', specialization: ['Lịch sử'], currentHours: 0, maxHours: 20, currentGrades: [] },
  
  // Giáo viên Địa lý
  { id: 't28', name: 'Trần Thị J', specialization: ['Địa lý'], currentHours: 0, maxHours: 20, currentGrades: [] },
  { id: 't28', name: 'Lê Thị V', specialization: ['Địa lý'], currentHours: 0, maxHours: 20, currentGrades: [] },

  // Giáo viên GDCD
  { id: 't29', name: 'Võ Văn K', specialization: ['GDCD'], currentHours: 0, maxHours: 20, currentGrades: [] },

  // Giáo viên Tin học
  { id: 't30', name: 'Lê Thị L', specialization: ['Tin học'], currentHours: 0, maxHours: 20, currentGrades: [] },

  // Giáo viên Công nghệ
  { id: 't31', name: 'Hoàng Thị M', specialization: ['Công nghệ'], currentHours: 0, maxHours: 20, currentGrades: [] },

  // Giáo viên Giáo dục thể chất
  { id: 't32', name: 'Phùng Văn N', specialization: ['Giáo dục thể chất'], currentHours: 0, maxHours: 20, currentGrades: [] },

  // Giáo viên GDQP-AN
  { id: 't33', name: 'Bùi Văn O', specialization: ['GDQP-AN'], currentHours: 0, maxHours: 20, currentGrades: [] },

  // Giáo viên Âm nhạc / Mỹ thuật
  { id: 't34', name: 'Đặng Thị P', specialization: ['Âm nhạc', 'Mỹ thuật'], currentHours: 0, maxHours: 20, currentGrades: [] },

  // Giáo viên Hoạt động trải nghiệm
  { id: 't35', name: 'Nguyễn Thị Q', specialization: ['Hoạt động trải nghiệm'], currentHours: 0, maxHours: 20, currentGrades: [] },

  // Giáo viên Giáo dục địa phương
  { id: 't36', name: 'Lý Văn R', specialization: ['Giáo dục địa phương'], currentHours: 0, maxHours: 20, currentGrades: [] },
];

export function TeacherAssignmentSystem() {
  const [classes, setClasses] = useState<Class[]>(mockClasses);
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [selectedAssignment, setSelectedAssignment] = useState<{
    classId: string;
    className: string;
    subjectId: string;
    subjectName: string;
    grade: number;
  } | null>(null);

  const handleOpenAssignment = (classId: string, className: string, subjectId: string, subjectName: string, grade: number) => {
    setSelectedAssignment({ classId, className, subjectId, subjectName, grade });
  };

  const handleAssignTeacher = (teacher: Teacher) => {
    if (!selectedAssignment) return;

    // Simulate database save with potential error
    const shouldFail = Math.random() < 0.1;
    if (shouldFail) {
      toast.error('Không thể lưu phân công. Vui lòng thử lại sau.');
      return;
    }

    // Lấy số tiết của môn học được phân công
    const subjectHours = SUBJECT_HOURS[selectedAssignment.subjectName as keyof typeof SUBJECT_HOURS] || 1;

    // Cập nhật classes với teacher mới, và tăng currentHours
    const updatedTeacher = {
      ...teacher,
      currentHours: teacher.currentHours + subjectHours,
      currentGrades: teacher.currentGrades.includes(selectedAssignment.grade)
        ? teacher.currentGrades
        : [...teacher.currentGrades, selectedAssignment.grade]
    };

    setClasses(prevClasses =>
      prevClasses.map(cls =>
        cls.id === selectedAssignment.classId
          ? {
              ...cls,
              subjects: cls.subjects.map(subj =>
                subj.id === selectedAssignment.subjectId
                  ? { ...subj, assignedTeacher: updatedTeacher }
                  : subj
              ),
            }
          : cls
      )
    );

    // Cập nhật danh sách giáo viên với số tiết mới
    setTeachers(prevTeachers =>
      prevTeachers.map(t =>
        t.id === teacher.id ? updatedTeacher : t
      )
    );

    toast.success('Phân công thành công!', {
      description: `Giáo viên ${teacher.name} đã được phân công dạy ${selectedAssignment.subjectName} (${subjectHours} tiết) lớp ${selectedAssignment.className}`,
    });

    setSelectedAssignment(null);
  };

  const getStats = () => {
    let totalSubjects = 0;
    let assignedSubjects = 0;

    classes.forEach(cls => {
      totalSubjects += cls.subjects.length;
      assignedSubjects += cls.subjects.filter(s => s.assignedTeacher).length;
    });

    return { totalSubjects, assignedSubjects, unassignedSubjects: totalSubjects - assignedSubjects };
  };

  const stats = getStats();

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2">Phân công giáo viên</h1>
        <p className="text-gray-600">Quản lý phân công giáo viên cho các lớp học và môn học</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng môn học</p>
              <p className="text-2xl">{stats.totalSubjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Đã phân công</p>
              <p className="text-2xl">{stats.assignedSubjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <GraduationCap className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Chưa phân công</p>
              <p className="text-2xl">{stats.unassignedSubjects}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Table */}
      <AssignmentTable classes={classes} onAssign={handleOpenAssignment} />

      {/* Assignment Dialog */}
      {selectedAssignment && (
        <AssignmentDialog
          open={!!selectedAssignment}
          onOpenChange={(open: boolean) => !open && setSelectedAssignment(null)}
          assignment={selectedAssignment}
          onAssign={handleAssignTeacher}
          teachers={teachers} // Thêm prop teachers vào đây
        />
      )}
    </div>
  );
}

const SUBJECT_HOURS = {
  'Văn': 4,
  'Toán': 4,
  'Tiếng Anh': 3,
  'Vật lý': 2,
  'Hóa học': 2,
  'Sinh học': 2,
  'Lịch sử': 2,
  'Địa lý': 2,
  'GDCD': 1, // Giáo dục kinh tế & pháp luật
  'Tin học': 1,
  'Công nghệ': 1,
  'GDQP-AN': 1,
  'Giáo dục thể chất': 2, // Thể dục
  'Hoạt động trải nghiệm': 1,
  'Giáo dục địa phương': 1
} as const;
