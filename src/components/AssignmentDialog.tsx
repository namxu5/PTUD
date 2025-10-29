import { useState } from 'react';
import { Teacher } from './TeacherAssignmentSystem';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { AlertCircle, CheckCircle2, Search, User, BookOpen, Clock, GraduationCap, AlertTriangle } from 'lucide-react';

interface AssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment: {
    classId: string;
    className: string;
    subjectId: string;
    subjectName: string;
    grade: number;
  };
  onAssign: (teacher: Teacher) => void;
  teachers: Teacher[];
}

export function AssignmentDialog({ open, onOpenChange, assignment, onAssign, teachers }: AssignmentDialogProps) {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Filter suitable teachers based on subject AND grade
  const suitableTeachers = teachers.filter(teacher => {
    // Must have the right specialization
    const matchesSpecialization = teacher.specialization.includes(assignment.subjectName);
    
    // Must either:
    // 1. Already teaching this grade, OR
    // 2. Not teaching any grade yet (available for any grade)
    const matchesGrade = teacher.currentGrades.includes(assignment.grade) || 
                        teacher.currentGrades.length === 0;
    
    // Match search query
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSpecialization && matchesGrade && matchesSearch;
  });

  const hasNoSuitableTeachers = suitableTeachers.length === 0 && !searchQuery;

  const handleConfirm = () => {
    if (selectedTeacher) {
      // Check if teacher is at max hours
      if (selectedTeacher.currentHours >= selectedTeacher.maxHours) {
        setShowConfirmDialog(true);
      } else {
        // Proceed with assignment directly
        proceedWithAssignment();
      }
    }
  };

  const proceedWithAssignment = () => {
    if (selectedTeacher) {
      onAssign(selectedTeacher);
      setSelectedTeacher(null);
      setSearchQuery('');
      setShowConfirmDialog(false);
    }
  };

  const handleCancel = () => {
    setSelectedTeacher(null);
    setSearchQuery('');
    setShowConfirmDialog(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl flex flex-col h-[85vh]">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Phân công giáo viên</DialogTitle>
          <DialogDescription>
            Lớp {assignment.className} - Môn {assignment.subjectName}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col flex-1 min-h-0">
          {hasNoSuitableTeachers && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Không có giáo viên phù hợp để phân công môn {assignment.subjectName} cho khối {assignment.grade}. 
                Không tìm thấy giáo viên có chuyên môn phù hợp và đang dạy khối này.
              </AlertDescription>
            </Alert>
          )}

          {!hasNoSuitableTeachers && (
            <>
              {/* Search - thêm flex-shrink-0 */}
              <div className="relative flex-shrink-0 mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm giáo viên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Teachers list - sửa lại phần scroll */}
              <ScrollArea className="flex-1 min-h-0 -mx-6 px-6">
                <div
                  className="space-y-3 pr-4 custom-scroll"
                  style={{
                    maxHeight: '52vh',   // giới hạn chiều cao vùng danh sách; điều chỉnh nếu cần
                    overflowY: 'auto',
                    WebkitOverflowScrolling: 'touch',
                  }}
                >
                  {suitableTeachers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Không tìm thấy giáo viên phù hợp
                    </div>
                  ) : (
                    suitableTeachers.map((teacher) => {
                      const isAtMaxHours = teacher.currentHours >= teacher.maxHours;
                      const isSelected = selectedTeacher?.id === teacher.id;

                      return (
                        <div
                          key={teacher.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedTeacher(teacher)}
                        >
                          {/* Nội dung thẻ teacher giữ nguyên */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-gray-500" />
                                <span>{teacher.name}</span>
                                {isSelected && (
                                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                )}
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                                <div className="flex items-center gap-1 text-gray-600">
                                  <BookOpen className="w-3 h-3" />
                                  <span>{teacher.specialization.join(', ')}</span>
                                </div>

                                <div className="flex items-center gap-1 text-gray-600">
                                  <Clock className="w-3 h-3" />
                                  <span>
                                    {teacher.currentHours}/{teacher.maxHours} tiết
                                  </span>
                                </div>

                                <div className="flex items-center gap-1 text-gray-600">
                                  <GraduationCap className="w-3 h-3" />
                                  <span>
                                    {teacher.currentGrades.length > 0 
                                      ? `Khối ${teacher.currentGrades.join(', ')}` 
                                      : 'Chưa phân công'}
                                  </span>
                                </div>
                              </div>

                              {isAtMaxHours && (
                                <Badge variant="destructive" className="mt-2">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Đã đạt giới hạn số tiết
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>

              {/* Warning alert - thêm flex-shrink-0 */}
              {selectedTeacher && selectedTeacher.currentHours >= selectedTeacher.maxHours && (
                <Alert variant="destructive" className="mt-4 flex-shrink-0">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Cảnh báo:</strong> Giáo viên {selectedTeacher.name} đã đạt giới hạn {selectedTeacher.currentHours}/{selectedTeacher.maxHours} tiết. 
                    Hệ thống sẽ yêu cầu xác nhận trước khi phân công.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </div>

        {/* Footer - thêm flex-shrink-0 */}
        <div className="flex justify-end gap-2 pt-4 mt-4 border-t flex-shrink-0">
          <Button variant="outline" onClick={handleCancel}>
            {hasNoSuitableTeachers ? 'Đóng' : 'Hủy'}
          </Button>
          {!hasNoSuitableTeachers && (
            <Button onClick={handleConfirm} disabled={!selectedTeacher}>
              Xác nhận phân công
            </Button>
          )}
        </div>
      </DialogContent>

      {/* Alert Dialog giữ nguyên */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Cảnh báo: Giáo viên đã đủ tiết
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                Giáo viên <strong>{selectedTeacher?.name}</strong> đã đạt giới hạn{' '}
                <strong className="text-red-600">
                  {selectedTeacher?.currentHours}/{selectedTeacher?.maxHours} tiết
                </strong>.
              </p>
              <p>
                Việc phân công thêm có thể ảnh hưởng đến chất lượng giảng dạy và sức khỏe của giáo viên.
              </p>
              <p className="text-sm text-gray-600">
                Bạn có chắc chắn muốn tiếp tục phân công không?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel asChild>
              <Button variant="outline" className="border-gray-300">
                Hủy
              </Button>
            </AlertDialogCancel>

            <AlertDialogAction asChild>
              <Button
                className="bborder-gray-300"
                onClick={() => {
                    proceedWithAssignment();
                  setShowConfirmDialog(false);
                }}
              >
                Phân công
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}

