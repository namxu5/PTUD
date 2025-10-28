import { useState } from 'react';
import { Calendar, Check, X, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Calendar as CalendarUI } from './ui/calendar';
import { toast } from 'sonner@2.0.3';

interface Student {
  id: string;
  name: string;
  attendance: 'present' | 'absent' | 'late' | 'pending';
}

export function AttendanceManagement() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState('10a1');

  const [students, setStudents] = useState<Student[]>([
    { id: 'HS001', name: 'Nguyễn Văn An', attendance: 'present' },
    { id: 'HS002', name: 'Trần Thị Bình', attendance: 'present' },
    { id: 'HS003', name: 'Lê Văn Cường', attendance: 'absent' },
    { id: 'HS004', name: 'Phạm Thị Dung', attendance: 'late' },
    { id: 'HS005', name: 'Hoàng Văn Em', attendance: 'present' },
  ]);

  const updateAttendance = (id: string, status: 'present' | 'absent' | 'late') => {
    setStudents(students.map(s => s.id === id ? { ...s, attendance: status } : s));
  };

  const saveAttendance = () => {
    const hasPending = students.some(s => s.attendance === 'pending');
    if (hasPending) {
      toast.error('Vui lòng điểm danh đầy đủ cho tất cả học sinh');
      return;
    }
    toast.success('Lưu điểm danh thành công');
  };

  const attendanceStats = {
    present: students.filter(s => s.attendance === 'present').length,
    absent: students.filter(s => s.attendance === 'absent').length,
    late: students.filter(s => s.attendance === 'late').length,
    total: students.length,
  };

  const getAttendanceColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'absent':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'late':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getAttendanceText = (status: string) => {
    switch (status) {
      case 'present':
        return 'Có mặt';
      case 'absent':
        return 'Vắng';
      case 'late':
        return 'Muộn';
      default:
        return 'Chưa điểm danh';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Section - Calendar and Controls */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Chọn ngày</h3>
          <CalendarUI
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border"
          />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Chọn lớp</h3>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10a1">Lớp 10A1</SelectItem>
              <SelectItem value="10a2">Lớp 10A2</SelectItem>
              <SelectItem value="10a3">Lớp 10A3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Thống kê</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tổng số:</span>
              <Badge>{attendanceStats.total}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Có mặt:</span>
              <Badge className="bg-green-100 text-green-700">{attendanceStats.present}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Vắng:</span>
              <Badge className="bg-red-100 text-red-700">{attendanceStats.absent}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Muộn:</span>
              <Badge className="bg-yellow-100 text-yellow-700">{attendanceStats.late}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Student List */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-900">Điểm danh lớp {selectedClass.toUpperCase()}</h3>
                <p className="text-sm text-gray-500">
                  {selectedDate.toLocaleDateString('vi-VN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <Button onClick={saveAttendance}>
                <Calendar className="w-4 h-4 mr-2" />
                Lưu điểm danh
              </Button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-3">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm text-blue-600">{student.id.slice(-2)}</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={getAttendanceColor(student.attendance)}>
                      {getAttendanceText(student.attendance)}
                    </Badge>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="outline"
                        className="w-8 h-8 hover:bg-green-50 hover:border-green-300"
                        onClick={() => updateAttendance(student.id, 'present')}
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="w-8 h-8 hover:bg-yellow-50 hover:border-yellow-300"
                        onClick={() => updateAttendance(student.id, 'late')}
                      >
                        <Clock className="w-4 h-4 text-yellow-600" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="w-8 h-8 hover:bg-red-50 hover:border-red-300"
                        onClick={() => updateAttendance(student.id, 'absent')}
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
