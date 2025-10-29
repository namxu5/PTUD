import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Upload, X, FileText, Image as ImageIcon, FileIcon, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';

// Mock data - trong thực tế sẽ lấy từ database
const mockClasses = [
  // Học kỳ 1 - 2023/2024
  { id: '10A1-HK1-2324', name: 'Toán học', studentCount: 45, semester: 'Học kỳ 1', year: '2023/2024', class: '10A1' },
  { id: '10A2-HK1-2324', name: 'Vật lý', studentCount: 43, semester: 'Học kỳ 1', year: '2023/2024', class: '10A2' },
  { id: '11B1-HK1-2324', name: 'Hóa học', studentCount: 40, semester: 'Học kỳ 1', year: '2023/2024', class: '11B1' },
  { id: '11B2-HK1-2324', name: 'Toán học', studentCount: 38, semester: 'Học kỳ 1', year: '2023/2024', class: '11B2' },
  { id: '12A1-HK1-2324', name: 'Vật lý', studentCount: 42, semester: 'Học kỳ 1', year: '2023/2024', class: '12A1' },
  
  // Học kỳ 2 - 2023/2024
  { id: '10A1-HK2-2324', name: 'Vật lý', studentCount: 45, semester: 'Học kỳ 2', year: '2023/2024', class: '10A1' },
  { id: '10A2-HK2-2324', name: 'Hóa học', studentCount: 44, semester: 'Học kỳ 2', year: '2023/2024', class: '10A2' },
  { id: '11B1-HK2-2324', name: 'Toán học', studentCount: 41, semester: 'Học kỳ 2', year: '2023/2024', class: '11B1' },
  { id: '11B2-HK2-2324', name: 'Hóa học', studentCount: 39, semester: 'Học kỳ 2', year: '2023/2024', class: '11B2' },
  { id: '12A1-HK2-2324', name: 'Toán học', studentCount: 40, semester: 'Học kỳ 2', year: '2023/2024', class: '12A1' },
];

const mockStudents = [
  // Học sinh lớp 10A1
  { 
    id: 'HS001', 
    name: 'Nguyễn Văn Minh', 
    gender: 'Nam', 
    class: '10A1',
    classId: '10A1-HK1-2324',
    scores: { midterm1: '8.5', midterm2: '7.0', final: '8.5', resit: '7.5', average: '8.0' }
  },
  { 
    id: 'HS002', 
    name: 'Trần Thị Hương', 
    gender: 'Nữ', 
    class: '10A1',
    classId: '10A1-HK1-2324',
    scores: { midterm1: '9.0', midterm2: '8.5', final: '9.0', resit: '8.0', average: '8.6' }
  },
  { 
    id: 'HS003', 
    name: 'Lê Hoàng Nam', 
    gender: 'Nam', 
    class: '10A1',
    classId: '10A1-HK1-2324',
    scores: { midterm1: '7.5', midterm2: '6.5', final: '7.0', resit: '6.0', average: '6.8' }
  },
  { 
    id: 'HS004', 
    name: 'Võ Minh Tâm', 
    gender: 'Nam', 
    class: '10A1',
    classId: '10A1-HK1-2324',
    scores: { midterm1: '8.0', midterm2: '7.5', final: '8.5', resit: '7.0', average: '7.8' }
  },
  { 
    id: 'HS005', 
    name: 'Nguyễn Thu Hà', 
    gender: 'Nữ', 
    class: '10A1',
    classId: '10A1-HK1-2324',
    scores: { midterm1: '9.5', midterm2: '9.0', final: '9.5', resit: '9.0', average: '9.3' }
  },
  
  // Học sinh lớp 10A2
  { 
    id: 'HS006', 
    name: 'Phạm Thu Trang', 
    gender: 'Nữ', 
    class: '10A2',
    classId: '10A2-HK1-2324',
    scores: { midterm1: '8.0', midterm2: '7.5', final: '8.0', resit: '7.0', average: '7.6' }
  },
  { 
    id: 'HS007', 
    name: 'Đặng Văn Long', 
    gender: 'Nam', 
    class: '10A2',
    classId: '10A2-HK1-2324',
    scores: { midterm1: '7.0', midterm2: '6.5', final: '7.5', resit: '6.0', average: '6.8' }
  },
  { 
    id: 'HS008', 
    name: 'Lê Thị Mai', 
    gender: 'Nữ', 
    class: '10A2',
    classId: '10A2-HK1-2324',
    scores: { midterm1: '8.5', midterm2: '8.0', final: '8.5', resit: '8.0', average: '8.3' }
  },
  { 
    id: 'HS009', 
    name: 'Trần Quốc Tuấn', 
    gender: 'Nam', 
    class: '10A2',
    classId: '10A2-HK1-2324',
    scores: { midterm1: '6.5', midterm2: '7.0', final: '6.5', resit: '6.5', average: '6.6' }
  },
  
  // Học sinh lớp 11B1
  { 
    id: 'HS010', 
    name: 'Hoàng Minh Tuấn', 
    gender: 'Nam', 
    class: '11B1',
    classId: '11B1-HK1-2324',
    scores: { midterm1: '6.5', midterm2: '7.0', final: '6.5', resit: '6.0', average: '6.5' }
  },
  { 
    id: 'HS011', 
    name: 'Nguyễn Thị Lan', 
    gender: 'Nữ', 
    class: '11B1',
    classId: '11B1-HK1-2324',
    scores: { midterm1: '8.5', midterm2: '8.0', final: '8.5', resit: '7.5', average: '8.1' }
  },
  { 
    id: 'HS012', 
    name: 'Phạm Văn Đức', 
    gender: 'Nam', 
    class: '11B1',
    classId: '11B1-HK1-2324',
    scores: { midterm1: '7.5', midterm2: '7.0', final: '7.5', resit: '7.0', average: '7.3' }
  },
  { 
    id: 'HS013', 
    name: 'Lý Thị Hoa', 
    gender: 'Nữ', 
    class: '11B1',
    classId: '11B1-HK1-2324',
    scores: { midterm1: '9.0', midterm2: '8.5', final: '9.0', resit: '8.5', average: '8.8' }
  },
  
  // Học sinh lớp 11B2
  { 
    id: 'HS014', 
    name: 'Trần Văn Bình', 
    gender: 'Nam', 
    class: '11B2',
    classId: '11B2-HK1-2324',
    scores: { midterm1: '7.0', midterm2: '7.5', final: '7.0', resit: '6.5', average: '7.0' }
  },
  { 
    id: 'HS015', 
    name: 'Nguyễn Thị Ngọc', 
    gender: 'Nữ', 
    class: '11B2',
    classId: '11B2-HK1-2324',
    scores: { midterm1: '8.0', midterm2: '8.5', final: '8.0', resit: '8.0', average: '8.1' }
  },
  { 
    id: 'HS016', 
    name: 'Võ Văn Hùng', 
    gender: 'Nam', 
    class: '11B2',
    classId: '11B2-HK1-2324',
    scores: { midterm1: '6.5', midterm2: '6.0', final: '6.5', resit: '6.0', average: '6.3' }
  },
  
  // Học sinh lớp 12A1
  { 
    id: 'HS017', 
    name: 'Phan Thị Thu', 
    gender: 'Nữ', 
    class: '12A1',
    classId: '12A1-HK1-2324',
    scores: { midterm1: '9.0', midterm2: '9.5', final: '9.0', resit: '9.0', average: '9.1' }
  },
  { 
    id: 'HS018', 
    name: 'Đỗ Văn Nam', 
    gender: 'Nam', 
    class: '12A1',
    classId: '12A1-HK1-2324',
    scores: { midterm1: '8.5', midterm2: '8.0', final: '8.5', resit: '8.0', average: '8.3' }
  },
  { 
    id: 'HS019', 
    name: 'Lê Thị Hương', 
    gender: 'Nữ', 
    class: '12A1',
    classId: '12A1-HK1-2324',
    scores: { midterm1: '7.5', midterm2: '8.0', final: '7.5', resit: '7.5', average: '7.6' }
  },
  { 
    id: 'HS020', 
    name: 'Nguyễn Văn Thành', 
    gender: 'Nam', 
    class: '12A1',
    classId: '12A1-HK1-2324',
    scores: { midterm1: '8.0', midterm2: '7.5', final: '8.0', resit: '7.0', average: '7.6' }
  },
  
  // Học kỳ 2 - Học sinh với điểm số khác
  { 
    id: 'HS001-HK2', 
    name: 'Nguyễn Văn Minh', 
    gender: 'Nam', 
    class: '10A1',
    classId: '10A1-HK2-2324',
    scores: { midterm1: '9.0', midterm2: '8.5', final: '9.0', resit: '8.5', average: '8.8' }
  },
  { 
    id: 'HS002-HK2', 
    name: 'Trần Thị Hương', 
    gender: 'Nữ', 
    class: '10A1',
    classId: '10A1-HK2-2324',
    scores: { midterm1: '9.5', midterm2: '9.0', final: '9.5', resit: '9.0', average: '9.3' }
  },
  { 
    id: 'HS003-HK2', 
    name: 'Lê Hoàng Nam', 
    gender: 'Nam', 
    class: '10A1',
    classId: '10A1-HK2-2324',
    scores: { midterm1: '8.0', midterm2: '7.5', final: '8.0', resit: '7.5', average: '7.8' }
  },
  { 
    id: 'HS006-HK2', 
    name: 'Phạm Thu Trang', 
    gender: 'Nữ', 
    class: '10A2',
    classId: '10A2-HK2-2324',
    scores: { midterm1: '8.5', midterm2: '8.0', final: '8.5', resit: '8.0', average: '8.3' }
  },
  { 
    id: 'HS010-HK2', 
    name: 'Hoàng Minh Tuấn', 
    gender: 'Nam', 
    class: '11B1',
    classId: '11B1-HK2-2324',
    scores: { midterm1: '7.5', midterm2: '7.0', final: '7.5', resit: '7.0', average: '7.3' }
  },
];

const mockRequests = [
  {
    id: 1,
    studentName: 'Lê Hoàng Nam',
    class: '10A1',
    subject: 'Vật lý',
    semester: 'Học kỳ 2',
    year: '2023/2024',
    date: '20/10/2025',
    status: 'Chờ duyệt' as const,
  },
  {
    id: 2,
    studentName: 'Nguyễn Văn Minh',
    class: '10A1',
    subject: 'Vật lý',
    semester: 'Học kỳ 2',
    year: '2023/2024',
    date: '18/10/2025',
    status: 'Đã duyệt' as const,
  },
  {
    id: 3,
    studentName: 'Trần Thị Lan',
    class: '11B1',
    subject: 'Toán học',
    semester: 'Học kỳ 2',
    year: '2023/2024',
    date: '15/10/2025',
    status: 'Từ chối' as const,
  },
  {
    id: 4,
    studentName: 'Phạm Thu Trang',
    class: '10A2',
    subject: 'Hóa học',
    semester: 'Học kỳ 1',
    year: '2023/2024',
    date: '18/10/2025',
    status: 'Chờ duyệt' as const,
  },
];

interface GradeCorrectionRequest {
  id: number;
  studentName: string;
  class: string;
  subject: string;
  semester?: string;
  year?: string;
  date: string;
  status: 'Chờ duyệt' | 'Đã duyệt' | 'Từ chối';
  scores?: {
    oldScores: {
      midterm1: string;
      midterm2: string;
      final: string;
      resit: string;
      average: string;
    };
    newScores: {
      midterm1: string;
      midterm2: string;
      final: string;
      resit: string;
      average: string;
    };
  };
  reason?: string;
  evidenceFiles?: string[];
  response?: string;
}

interface RequestDetail {
  studentName: string;
  gender: string;
  subject: string;
  class: string;
  examScores: {
    midterm1: string;
    midterm2: string;
    final: string;
    resit: string;
    average: string;
  };
  reason: string;
  evidence: string;
}

type Step = 'select-class' | 'view-students' | 'edit-score' | 'confirm';
type ActiveTab = 'select-class' | 'requests-list';

export function GradeCorrectionRequestNew() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('select-class');
  const [currentStep, setCurrentStep] = useState<Step>('select-class');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2024/2025');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [requests, setRequests] = useState<GradeCorrectionRequest[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<GradeCorrectionRequest | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Form data for grade correction
  const [formData, setFormData] = useState({
    studentName: '',
    gender: '',
    subject: '',
    class: '',
    semester: '',
    year: '',
    midterm1: '',
    midterm2: '',
    final: '',
    resit: '',
    average: '',
    reason: '',
  });

  // Store original scores to compare
  const [originalScores, setOriginalScores] = useState({
    midterm1: '',
    midterm2: '',
    final: '',
    resit: '',
    average: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Remove auto-calculation for average - user will input it manually
  // useEffect(() => {
  //   const scores = [
  //     parseFloat(formData.midterm1) || 0,
  //     parseFloat(formData.midterm2) || 0,
  //     parseFloat(formData.final) || 0,
  //   ];
  //   const validScores = scores.filter(s => s > 0);
  //   if (validScores.length > 0) {
  //     const avg = validScores.reduce((a, b) => a + b, 0) / validScores.length;
  //     setFormData(prev => ({ ...prev, average: avg.toFixed(1) }));
  //   }
  // }, [formData.midterm1, formData.midterm2, formData.final]);

  const filteredClasses = mockClasses.filter(cls => {
    const matchesSearch = cls.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSemester = selectedAcademicYear === '2024/2025' ? true :
      selectedAcademicYear === 'HK2-2023/2024' ? cls.semester === 'Học kỳ 2' && cls.year === '2023/2024' :
      selectedAcademicYear === 'HK1-2023/2024' ? cls.semester === 'Học kỳ 1' && cls.year === '2023/2024' :
      true;
    
    return matchesSearch && matchesSemester;
  });

  const filteredStudents = mockStudents.filter(student =>
    student.classId === selectedClass &&
    (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     student.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredRequests = requests.filter(req => {
    const matchesStatus = showStatusFilter === 'all' ? true : req.status === showStatusFilter;
    
    const matchesSemester = selectedAcademicYear === '2024/2025' ? true :
      selectedAcademicYear === 'HK2-2023/2024' ? req.semester === 'Học kỳ 2' && req.year === '2023/2024' :
      selectedAcademicYear === 'HK1-2023/2024' ? req.semester === 'Học kỳ 1' && req.year === '2023/2024' :
      true;
    
    return matchesStatus && matchesSemester;
  });

  const handleSelectClass = (classId: string) => {
    setSelectedClass(classId);
    setCurrentStep('view-students');
    setSearchTerm('');
  };

  const handleSelectStudent = (student: any) => {
    const selectedClassData = mockClasses.find(c => c.id === selectedClass);
    setSelectedStudent(student);
    
    // Store original scores
    const studentScores = student.scores || {
      midterm1: '8.5',
      midterm2: '7.0',
      final: '8.5',
      resit: '7.5',
      average: '8.0'
    };
    
    setOriginalScores(studentScores);
    
    // Set form data with original scores and semester info
    setFormData({
      studentName: student.name,
      gender: student.gender,
      subject: selectedClassData?.name || '',
      class: student.class,
      semester: selectedClassData?.semester || '',
      year: selectedClassData?.year || '',
      midterm1: studentScores.midterm1,
      midterm2: studentScores.midterm2,
      final: studentScores.final,
      resit: studentScores.resit,
      average: studentScores.average,
      reason: '',
    });
    setUploadedFiles([]);
    setErrors({});
    setCurrentStep('edit-score');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const validFiles = newFiles.filter(file => {
        const validTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg',
          'image/png',
          'image/jpg'
        ];
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        if (!validTypes.includes(file.type)) {
          toast.error(`File ${file.name} không đúng định dạng`);
          return false;
        }
        if (file.size > maxSize) {
          toast.error(`File ${file.name} vượt quá 5MB`);
          return false;
        }
        return true;
      });
      
      setUploadedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="w-4 h-4" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="w-4 h-4" />;
    } else {
      return <FileIcon className="w-4 h-4" />;
    }
  };

  // Helper function to validate score input
  const validateScoreInput = (value: string, fieldName: string) => {
    const newErrors = { ...errors };
    const isFirstSemester = formData.semester === 'Học kỳ 1';
    
    // Special handling for average score in first semester
    if (fieldName === 'average' && isFirstSemester) {
      // Allow empty for first semester
      if (!value || value.trim() === '') {
        delete newErrors[fieldName];
      } else if (isNaN(parseFloat(value))) {
        newErrors[fieldName] = 'Điểm phải là số hợp lệ';
      } else if (parseFloat(value) < 0 || parseFloat(value) > 10) {
        newErrors[fieldName] = 'Điểm phải từ 0 đến 10';
      } else {
        delete newErrors[fieldName];
      }
    } else {
      // Standard validation for other fields
      if (!value || value.trim() === '') {
        newErrors[fieldName] = `Vui lòng nhập ${fieldName === 'midterm1' ? 'điểm 15 phút (1)' : 
                                               fieldName === 'midterm2' ? 'điểm 15 phút (2)' : 
                                               fieldName === 'final' ? 'điểm 1 tiết' : 
                                               fieldName === 'resit' ? 'điểm giữa kỳ' : 'điểm cuối kỳ'}`;
      } else if (isNaN(parseFloat(value))) {
        newErrors[fieldName] = 'Điểm phải là số hợp lệ';
      } else if (parseFloat(value) < 0 || parseFloat(value) > 10) {
        newErrors[fieldName] = 'Điểm phải từ 0 đến 10';
      } else {
        delete newErrors[fieldName];
      }
    }
    
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate Điểm 15 phút (1)
    if (!formData.midterm1 || formData.midterm1.trim() === '') {
      newErrors.midterm1 = 'Vui lòng nhập điểm 15 phút (1)';
    } else if (isNaN(parseFloat(formData.midterm1))) {
      newErrors.midterm1 = 'Điểm phải là số hợp lệ';
    } else if (parseFloat(formData.midterm1) < 0 || parseFloat(formData.midterm1) > 10) {
      newErrors.midterm1 = 'Điểm phải từ 0 đến 10';
    }

    // Validate Điểm 15 phút (2)
    if (!formData.midterm2 || formData.midterm2.trim() === '') {
      newErrors.midterm2 = 'Vui lòng nhập điểm 15 phút (2)';
    } else if (isNaN(parseFloat(formData.midterm2))) {
      newErrors.midterm2 = 'Điểm phải là số hợp lệ';
    } else if (parseFloat(formData.midterm2) < 0 || parseFloat(formData.midterm2) > 10) {
      newErrors.midterm2 = 'Điểm phải từ 0 đến 10';
    }

    // Validate Điểm 1 tiết
    if (!formData.final || formData.final.trim() === '') {
      newErrors.final = 'Vui lòng nhập điểm 1 tiết';
    } else if (isNaN(parseFloat(formData.final))) {
      newErrors.final = 'Điểm phải là số hợp lệ';
    } else if (parseFloat(formData.final) < 0 || parseFloat(formData.final) > 10) {
      newErrors.final = 'Điểm phải từ 0 đến 10';
    }

    // Validate Điểm giữa kỳ
    if (!formData.resit || formData.resit.trim() === '') {
      newErrors.resit = 'Vui lòng nhập điểm giữa kỳ';
    } else if (isNaN(parseFloat(formData.resit))) {
      newErrors.resit = 'Điểm phải là số hợp lệ';
    } else if (parseFloat(formData.resit) < 0 || parseFloat(formData.resit) > 10) {
      newErrors.resit = 'Điểm phải từ 0 đến 10';
    }

    // Validate Điểm cuối kỳ (chỉ bắt buộc với học kỳ 2)
    const isFirstSemester = formData.semester === 'Học kỳ 1';
    
    if (!isFirstSemester) {
      // Học kỳ 2: bắt buộc nhập điểm cuối kỳ
      if (!formData.average || formData.average.trim() === '') {
        newErrors.average = 'Vui lòng nhập điểm cuối kỳ';
      } else if (isNaN(parseFloat(formData.average))) {
        newErrors.average = 'Điểm phải là số hợp lệ';
      } else if (parseFloat(formData.average) < 0 || parseFloat(formData.average) > 10) {
        newErrors.average = 'Điểm phải từ 0 đến 10';
      }
    } else {
      // Học kỳ 1: cho phép bỏ trống, nhưng nếu nhập thì phải hợp lệ
      if (formData.average && formData.average.trim() !== '') {
        if (isNaN(parseFloat(formData.average))) {
          newErrors.average = 'Điểm phải là số hợp lệ';
        } else if (parseFloat(formData.average) < 0 || parseFloat(formData.average) > 10) {
          newErrors.average = 'Điểm phải từ 0 đến 10';
        }
      }
    }

    // Validate Lý do sửa điểm
    if (!formData.reason || formData.reason.trim().length < 10) {
      newErrors.reason = 'Vui lòng nhập lý do sửa điểm (ít nhất 10 ký tự)';
    }

    // Validate File minh chứng
    if (uploadedFiles.length === 0) {
      newErrors.evidence = 'Vui lòng tải lên file minh chứng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    // Check if student already has a pending request
    const existingRequest = requests.find(req => 
      req.studentName === formData.studentName && 
      req.subject === formData.subject &&
      req.class === formData.class &&
      req.semester === formData.semester &&
      req.year === formData.year &&
      req.status === 'Chờ duyệt'
    );

    if (existingRequest) {
      toast.error(`Học sinh ${formData.studentName} đã có yêu cầu sửa điểm cho môn ${formData.subject} đang chờ duyệt!`, {
        duration: 4000,
      });
      return;
    }

    // Save request with full details
    const newRequest: GradeCorrectionRequest = {
      id: requests.length + 1,
      studentName: formData.studentName,
      class: formData.class,
      subject: formData.subject,
      semester: formData.semester,
      year: formData.year,
      date: new Date().toLocaleDateString('vi-VN'),
      status: 'Chờ duyệt',
      scores: {
        oldScores: {
          midterm1: originalScores.midterm1,
          midterm2: originalScores.midterm2,
          final: originalScores.final,
          resit: originalScores.resit,
          average: originalScores.average,
        },
        newScores: {
          midterm1: formData.midterm1,
          midterm2: formData.midterm2,
          final: formData.final,
          resit: formData.resit,
          average: formData.average,
        },
      },
      reason: formData.reason,
      evidenceFiles: uploadedFiles.map(f => f.name),
    };

    setRequests(prev => [newRequest, ...prev]);
    toast.success('Gửi yêu cầu sửa điểm thành công');
    
    // Reset and go back to requests list tab
    setCurrentStep('select-class');
    setActiveTab('requests-list'); // Switch to requests list tab
    setSelectedClass('');
    setSelectedStudent(null);
    setFormData({
      studentName: '',
      gender: '',
      subject: '',
      class: '',
      semester: '',
      year: '',
      midterm1: '',
      midterm2: '',
      final: '',
      resit: '',
      average: '',
      reason: '',
    });
    setOriginalScores({
      midterm1: '',
      midterm2: '',
      final: '',
      resit: '',
      average: '',
    });
    setUploadedFiles([]);
    setErrors({});
  };

  const handleViewDetail = (request: GradeCorrectionRequest) => {
    setSelectedRequest(request);
    setShowDetailDialog(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Chờ duyệt':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">Chờ duyệt</Badge>;
      case 'Đã duyệt':
        return <Badge className="bg-green-100 text-green-700 border-green-300">Đã duyệt</Badge>;
      case 'Từ chối':
        return <Badge className="bg-red-100 text-red-700 border-red-300">Từ chối</Badge>;
      default:
        return <Badge>Không xác định</Badge>;
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: 'select-class', label: 'Chọn môn học', number: 1 },
      { id: 'view-students', label: 'Xem điểm', number: 2 },
      { id: 'edit-score', label: 'Sửa điểm', number: 3 },
      { id: 'confirm', label: 'Gửi yêu cầu', number: 4 },
    ];

    const currentStepIndex = steps.findIndex(s => s.id === currentStep);

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${index < currentStepIndex ? 'bg-green-500 text-white' : 
                    index === currentStepIndex ? 'bg-blue-500 text-white' : 
                    'bg-gray-200 text-gray-500'}`}>
                  {index < currentStepIndex ? '✓' : step.number}
                </div>
                <span className={`mt-2 text-sm ${index === currentStepIndex ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSelectClass = () => (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-600 text-sm mb-4">Gửi yêu cầu sửa điểm</p>

        {/* Academic Year and Search */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <Label className="text-sm text-gray-700 mb-2 block">Học kỳ</Label>
            <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024/2025">Học kỳ 1 - 2024/2025</SelectItem>
                <SelectItem value="HK2-2023/2024">Học kỳ 2 - 2023/2024</SelectItem>
                <SelectItem value="HK1-2023/2024">Học kỳ 1 - 2023/2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm text-gray-700 mb-2 block">Tìm kiếm</Label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm theo tên lớp học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Classes Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 border-r border-gray-200">Tên môn học</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 border-r border-gray-200">Lớp học</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 border-r border-gray-200">Sĩ số học</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    Không tìm thấy môn học nào
                  </td>
                </tr>
              ) : (
                filteredClasses.map((cls) => (
                  <tr key={cls.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 border-r border-gray-200">
                      <span className="text-blue-600 font-medium">{cls.name}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-900 border-r border-gray-200">{cls.class}</td>
                    <td className="py-3 px-4 text-center text-gray-900 border-r border-gray-200">{cls.studentCount}</td>
                    <td className="py-3 px-4 text-center">
                      <Button
                        onClick={() => handleSelectClass(cls.id)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Xem danh sách điểm →
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderViewStudents = () => (
    <div className="space-y-6">
      {/* Back button and header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={() => {
          setCurrentStep('select-class');
          setSelectedClass('');
        }}>
          <ArrowLeft className="w-4 h-4 text-gray-600" />
          <span className="text-gray-600 text-sm hover:text-blue-600">Quay lại</span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Danh sách điểm lớp {selectedClass} - {mockClasses.find(c => c.id === selectedClass)?.name}
        </h3>

        {/* Search */}
        <div className="mt-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm theo tên học sinh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 border-r border-gray-200">Họ tên học sinh</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 border-r border-gray-200">Giới tính</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 border-r border-gray-200">Điểm 15 phút (1)</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 border-r border-gray-200">Điểm 15 phút (2)</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 border-r border-gray-200">Điểm 1 tiết</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 border-r border-gray-200">Điểm giữa kỳ</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 border-r border-gray-200">Điểm cuối kỳ</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">
                  Không có mẫu dữ liệu học sinh
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 border-r border-gray-200">
                    <span className="text-gray-900">{student.name}</span>
                  </td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{student.gender}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{student.scores?.midterm1 || '8.5'}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{student.scores?.midterm2 || '7.0'}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{student.scores?.final || '8.5'}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{student.scores?.resit || '7.5'}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{student.scores?.average || '8.0'}</td>
                  <td className="py-3 px-4 text-center">
                    <Button
                      onClick={() => handleSelectStudent(student)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Sửa điểm
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEditScore = () => (
    <div className="space-y-6">
      {/* Back button and header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={() => {
          setCurrentStep('view-students');
          setSelectedStudent(null);
        }}>
          <ArrowLeft className="w-4 h-4 text-gray-600" />
          <span className="text-gray-600 text-sm hover:text-blue-600">Quay lại</span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900">
          Gửi yêu cầu sửa điểm
        </h3>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Student Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">Họ tên *</Label>
              <Input value={formData.studentName} disabled className="bg-gray-50" />
            </div>
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">Giới tính</Label>
              <Input value={formData.gender} disabled className="bg-gray-50" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">Môn học</Label>
              <Input value={formData.subject} disabled className="bg-gray-50" />
            </div>
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">Lớp</Label>
              <Input value={formData.class} disabled className="bg-gray-50" />
            </div>
          </div>

          {/* Scores */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">Điểm 15 phút (1) *</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.midterm1}
                onChange={(e) => {
                  setFormData({ ...formData, midterm1: e.target.value });
                  validateScoreInput(e.target.value, 'midterm1');
                }}
                onBlur={(e) => validateScoreInput(e.target.value, 'midterm1')}
                className={`${errors.midterm1 ? 'border-red-500' : ''} ${
                  formData.midterm1 !== originalScores.midterm1 ? 'bg-yellow-50 border-yellow-400 ring-2 ring-yellow-200' : ''
                }`}
                placeholder="Nhập điểm"
              />
              {formData.midterm1 !== originalScores.midterm1 && (
                <p className="text-xs text-yellow-600 mt-1 flex items-center gap-1">
                  📝 Đã thay đổi từ: {originalScores.midterm1}
                </p>
              )}
              {errors.midterm1 && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.midterm1}
                </p>
              )}
            </div>
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">Điểm 15 phút (2) *</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.midterm2}
                onChange={(e) => {
                  setFormData({ ...formData, midterm2: e.target.value });
                  validateScoreInput(e.target.value, 'midterm2');
                }}
                onBlur={(e) => validateScoreInput(e.target.value, 'midterm2')}
                className={`${errors.midterm2 ? 'border-red-500' : ''} ${
                  formData.midterm2 !== originalScores.midterm2 ? 'bg-yellow-50 border-yellow-400 ring-2 ring-yellow-200' : ''
                }`}
                placeholder="Nhập điểm"
              />
              {formData.midterm2 !== originalScores.midterm2 && (
                <p className="text-xs text-yellow-600 mt-1 flex items-center gap-1">
                  📝 Đã thay đổi từ: {originalScores.midterm2}
                </p>
              )}
              {errors.midterm2 && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.midterm2}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">Điểm 1 tiết *</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.final}
                onChange={(e) => {
                  setFormData({ ...formData, final: e.target.value });
                  validateScoreInput(e.target.value, 'final');
                }}
                onBlur={(e) => validateScoreInput(e.target.value, 'final')}
                className={`${errors.final ? 'border-red-500' : ''} ${
                  formData.final !== originalScores.final ? 'bg-yellow-50 border-yellow-400 ring-2 ring-yellow-200' : ''
                }`}
                placeholder="Nhập điểm"
              />
              {formData.final !== originalScores.final && (
                <p className="text-xs text-yellow-600 mt-1 flex items-center gap-1">
                  📝 Đã thay đổi từ: {originalScores.final}
                </p>
              )}
              {errors.final && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.final}
                </p>
              )}
            </div>
            <div>
              <Label className="text-sm text-gray-700 mb-2 block">Điểm giữa kỳ *</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.resit}
                onChange={(e) => {
                  setFormData({ ...formData, resit: e.target.value });
                  validateScoreInput(e.target.value, 'resit');
                }}
                onBlur={(e) => validateScoreInput(e.target.value, 'resit')}
                className={`${errors.resit ? 'border-red-500' : ''} ${
                  formData.resit !== originalScores.resit ? 'bg-yellow-50 border-yellow-400 ring-2 ring-yellow-200' : ''
                }`}
                placeholder="Nhập điểm"
              />
              {formData.resit !== originalScores.resit && (
                <p className="text-xs text-yellow-600 mt-1 flex items-center gap-1">
                  📝 Đã thay đổi từ: {originalScores.resit}
                </p>
              )}
              {errors.resit && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.resit}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label className="text-sm text-gray-700 mb-2 block">
              Điểm cuối kỳ {formData.semester !== 'Học kỳ 1' && '*'}
              {formData.semester === 'Học kỳ 1' && (
                <span className="text-gray-500 text-xs ml-1">(Không bắt buộc cho Học kỳ 1)</span>
              )}
            </Label>
            <Input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={formData.average}
              onChange={(e) => {
                setFormData({ ...formData, average: e.target.value });
                validateScoreInput(e.target.value, 'average');
              }}
              onBlur={(e) => validateScoreInput(e.target.value, 'average')}
              className={`${errors.average ? 'border-red-500' : ''} ${
                formData.average !== originalScores.average ? 'bg-yellow-50 border-yellow-400 ring-2 ring-yellow-200' : ''
              }`}
              placeholder={formData.semester === 'Học kỳ 1' ? 'Nhập điểm (không bắt buộc)' : 'Nhập điểm'}
            />
            {formData.average !== originalScores.average && (
              <p className="text-xs text-yellow-600 mt-1 flex items-center gap-1">
                📝 Đã thay đổi từ: {originalScores.average}
              </p>
            )}
            {errors.average && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.average}
              </p>
            )}
          </div>

          {/* Evidence Upload */}
          <div>
            <Label className="text-sm text-gray-700 mb-2 block">Minh chứng *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                id="file-upload"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  Chọn file hoặc kéo thả file vào đây
                </p>
                <p className="text-xs text-gray-500">
                  Hỗ trợ: PDF, Word, JPG, PNG (tối đa 5MB)
                </p>
              </label>
            </div>
            {errors.evidence && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.evidence}
              </p>
            )}

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600">
                      {getFileIcon(file)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reason */}
          <div>
            <Label className="text-sm text-gray-700 mb-2 block">Lý do sửa điểm *</Label>
            <Textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Nhập lý do sửa điểm..."
              rows={4}
              className={errors.reason ? 'border-red-500' : ''}
            />
            <p className="text-xs text-gray-500 mt-1">Nhập lý do cụ thể để giáo viên xem xét</p>
            {errors.reason && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.reason}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentStep('view-students');
                setSelectedStudent(null);
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Gửi yêu cầu
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRequestsList = () => (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-600 text-sm mb-4">Danh sách yêu cầu đã gửi điểm</p>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-gray-700 mb-2 block">Học kỳ</Label>
            <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024/2025">Học kỳ 1 - 2024/2025</SelectItem>
                <SelectItem value="HK2-2023/2024">Học kỳ 2 - 2023/2024</SelectItem>
                <SelectItem value="HK1-2023/2024">Học kỳ 1 - 2023/2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm text-gray-700 mb-2 block">Lọc theo trạng thái</Label>
            <Select value={showStatusFilter} onValueChange={setShowStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Chờ duyệt">Chờ duyệt</SelectItem>
                <SelectItem value="Đã duyệt">Đã duyệt</SelectItem>
                <SelectItem value="Từ chối">Từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 border-r border-gray-200">Họ tên học sinh</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 border-r border-gray-200">Môn học</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 border-r border-gray-200">Lớp</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 border-r border-gray-200">Ngày gửi</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 border-r border-gray-200">Trạng thái</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  Không có yêu cầu nào
                </td>
              </tr>
            ) : (
              filteredRequests.map((request) => (
                <tr key={request.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 border-r border-gray-200">
                    <span className="text-gray-900">{request.studentName}</span>
                  </td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">
                    <span className="text-blue-600">{request.subject}</span>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-900 border-r border-gray-200">{request.class}</td>
                  <td className="py-3 px-4 text-center text-gray-900 border-r border-gray-200">{request.date}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Button
                      onClick={() => handleViewDetail(request)}
                      size="sm"
                      variant="ghost"
                      className="text-gray-600 hover:text-blue-600"
                    >
                      👁 Xem chi tiết
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Hệ thống quản lý trường học</h2>
              <p className="text-gray-600 text-sm">Quản lý điểm và yêu cầu của sửa điểm</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Giáo viên: Nguyễn Văn An</span>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                GV
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        {currentStep === 'select-class' && (
          <div className="bg-white rounded-lg border border-gray-200 p-2 mb-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('select-class')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'select-class'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Chọn môn học
              </button>
              <button
                onClick={() => setActiveTab('requests-list')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'requests-list'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Danh sách yêu cầu
              </button>
            </div>
          </div>
        )}

        {/* Step Indicator */}
        {currentStep !== 'select-class' && renderStepIndicator()}

        {/* Content */}
        {currentStep === 'select-class' && activeTab === 'select-class' && renderSelectClass()}
        {currentStep === 'select-class' && activeTab === 'requests-list' && renderRequestsList()}
        {currentStep === 'view-students' && renderViewStudents()}
        {currentStep === 'edit-score' && renderEditScore()}

        {/* Detail Dialog */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-2xl max-h-[70vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Chi tiết phiếu yêu cầu sửa điểm</DialogTitle>
            </DialogHeader>
            {selectedRequest && (
              <div 
                className="space-y-4 pt-4 pr-2" 
                style={{
                  maxHeight: '55vh',
                  overflowY: 'scroll',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#CBD5E1 #F1F5F9'
                }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Học sinh</p>
                    <p className="text-gray-900">{selectedRequest.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Giới tính</p>
                    <p className="text-gray-900">Nam</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Môn học</p>
                    <p className="text-blue-600">{selectedRequest.subject}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Lớp</p>
                    <p className="text-gray-900">{selectedRequest.class}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Ngày gửi</p>
                    <p className="text-gray-900">{selectedRequest.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Trạng thái</p>
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Chi tiết điểm số</p>
                  
                  {selectedRequest.scores ? (
                    <>
                      {/* Điểm cũ */}
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Điểm cũ:</p>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Điểm 15 phút (1):</span>
                            <span className="text-sm font-medium text-gray-900">{selectedRequest.scores.oldScores.midterm1}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Điểm 15 phút (2):</span>
                            <span className="text-sm font-medium text-gray-900">{selectedRequest.scores.oldScores.midterm2}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Điểm 1 tiết:</span>
                            <span className="text-sm font-medium text-gray-900">{selectedRequest.scores.oldScores.final}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Điểm giữa kỳ:</span>
                            <span className="text-sm font-medium text-gray-900">{selectedRequest.scores.oldScores.resit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Điểm cuối kỳ:</span>
                            <span className="text-sm font-medium text-gray-900">{selectedRequest.scores.oldScores.average}</span>
                          </div>
                        </div>
                      </div>

                      {/* Điểm mới đề xuất */}
                      <div>
                        <p className="text-xs font-semibold text-blue-700 mb-2">Điểm mới đề xuất:</p>
                        <div className="bg-blue-50 rounded-lg p-4 space-y-2 border border-blue-200">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Điểm 15 phút (1):</span>
                            <span className={`text-sm font-medium ${
                              selectedRequest.scores.newScores.midterm1 !== selectedRequest.scores.oldScores.midterm1
                                ? 'text-blue-700 font-bold'
                                : 'text-gray-900'
                            }`}>
                              {selectedRequest.scores.newScores.midterm1}
                              {selectedRequest.scores.newScores.midterm1 !== selectedRequest.scores.oldScores.midterm1 && ' ⬆️'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Điểm 15 phút (2):</span>
                            <span className={`text-sm font-medium ${
                              selectedRequest.scores.newScores.midterm2 !== selectedRequest.scores.oldScores.midterm2
                                ? 'text-blue-700 font-bold'
                                : 'text-gray-900'
                            }`}>
                              {selectedRequest.scores.newScores.midterm2}
                              {selectedRequest.scores.newScores.midterm2 !== selectedRequest.scores.oldScores.midterm2 && ' ⬆️'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Điểm 1 tiết:</span>
                            <span className={`text-sm font-medium ${
                              selectedRequest.scores.newScores.final !== selectedRequest.scores.oldScores.final
                                ? 'text-blue-700 font-bold'
                                : 'text-gray-900'
                            }`}>
                              {selectedRequest.scores.newScores.final}
                              {selectedRequest.scores.newScores.final !== selectedRequest.scores.oldScores.final && ' ⬆️'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Điểm giữa kỳ:</span>
                            <span className={`text-sm font-medium ${
                              selectedRequest.scores.newScores.resit !== selectedRequest.scores.oldScores.resit
                                ? 'text-blue-700 font-bold'
                                : 'text-gray-900'
                            }`}>
                              {selectedRequest.scores.newScores.resit}
                              {selectedRequest.scores.newScores.resit !== selectedRequest.scores.oldScores.resit && ' ⬆️'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Điểm cuối kỳ:</span>
                            <span className={`text-sm font-medium ${
                              selectedRequest.scores.newScores.average !== selectedRequest.scores.oldScores.average
                                ? 'text-blue-700 font-bold'
                                : 'text-gray-900'
                            }`}>
                              {selectedRequest.scores.newScores.average}
                              {selectedRequest.scores.newScores.average !== selectedRequest.scores.oldScores.average && ' ⬆️'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Điểm 15 phút (1):</span>
                        <span className="text-sm font-medium text-gray-900">8.5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Điểm 15 phút (2):</span>
                        <span className="text-sm font-medium text-gray-900">7.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Điểm 1 tiết:</span>
                        <span className="text-sm font-medium text-gray-900">8.5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Điểm giữa kỳ:</span>
                        <span className="text-sm font-medium text-gray-900">7.5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Điểm cuối kỳ:</span>
                        <span className="text-sm font-medium text-gray-900">9.0</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Lý do sửa điểm</p>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                    {selectedRequest.reason || 'Chấm sai kết quả bài tập. Câu 5 đã làm đúng theo phương pháp.'}
                  </p>
                </div>

                {selectedRequest.evidenceFiles && selectedRequest.evidenceFiles.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-2">File minh chứng</p>
                    <div className="space-y-2">
                      {selectedRequest.evidenceFiles.map((fileName, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-700">{fileName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRequest.status === 'Đã duyệt' && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-2">Phản hồi</p>
                    <p className="text-sm text-gray-700 bg-green-50 rounded-lg p-3 border border-green-200">
                      Đã xem xét và đồng ý sửa điểm. Điểm đã được cập nhật vào hệ thống.
                    </p>
                  </div>
                )}

                {selectedRequest.status === 'Từ chối' && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-2">Phản hồi</p>
                    <p className="text-sm text-gray-700 bg-red-50 rounded-lg p-3 border border-red-200">
                      Sau khi xem xét kỹ, điểm đã chấm là chính xác theo đáp án và thang điểm.
                    </p>
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <Button onClick={() => setShowDetailDialog(false)}>
                    Đóng
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
