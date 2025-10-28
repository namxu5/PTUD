import { useState } from 'react';
import { BookOpen, Calendar, Upload, Download, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';

interface Assignment {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  description: string;
  grade?: number;
  submissionNote?: string;
}

export function HomeworkManagement() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 1,
      title: 'Bài tập Toán - Chương 1',
      subject: 'Toán',
      dueDate: '2025-11-05',
      status: 'pending',
      description: 'Làm bài tập 1-10 trang 25',
    },
    {
      id: 2,
      title: 'Luận văn Văn học',
      subject: 'Văn',
      dueDate: '2025-11-08',
      status: 'submitted',
      description: 'Viết luận văn về tác phẩm Chí Phèo',
      submissionNote: 'Đã hoàn thành bài luận',
    },
    {
      id: 3,
      title: 'Thí nghiệm Vật lý',
      subject: 'Lý',
      dueDate: '2025-10-25',
      status: 'graded',
      description: 'Báo cáo thí nghiệm về định luật Ôm',
      grade: 9.0,
    },
    {
      id: 4,
      title: 'Bài tập Hóa học',
      subject: 'Hóa',
      dueDate: '2025-10-20',
      status: 'overdue',
      description: 'Bài tập về phản ứng hóa học',
    },
  ]);

  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionNote, setSubmissionNote] = useState('');

  const handleSubmit = () => {
    if (!selectedAssignment) return;

    setAssignments(assignments.map(a => 
      a.id === selectedAssignment.id 
        ? { ...a, status: 'submitted' as const, submissionNote } 
        : a
    ));
    
    toast.success('Nộp bài tập thành công');
    setIsSubmitDialogOpen(false);
    setSubmissionNote('');
    setSelectedAssignment(null);
  };

  const openSubmitDialog = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsSubmitDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Chưa nộp</Badge>;
      case 'submitted':
        return <Badge className="bg-blue-100 text-blue-700">Đã nộp</Badge>;
      case 'graded':
        return <Badge className="bg-green-100 text-green-700">Đã chấm</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-700">Quá hạn</Badge>;
      default:
        return <Badge>Không xác định</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'submitted':
        return <Upload className="w-5 h-5 text-blue-500" />;
      case 'graded':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'overdue':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const stats = {
    pending: assignments.filter(a => a.status === 'pending').length,
    submitted: assignments.filter(a => a.status === 'submitted').length,
    graded: assignments.filter(a => a.status === 'graded').length,
    overdue: assignments.filter(a => a.status === 'overdue').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Chưa nộp</p>
              <p className="text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đã nộp</p>
              <p className="text-gray-900">{stats.submitted}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đã chấm</p>
              <p className="text-gray-900">{stats.graded}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Quá hạn</p>
              <p className="text-gray-900">{stats.overdue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="pending">Chưa nộp</TabsTrigger>
          <TabsTrigger value="submitted">Đã nộp</TabsTrigger>
          <TabsTrigger value="graded">Đã chấm</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {getStatusIcon(assignment.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-gray-900">{assignment.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{assignment.description}</p>
                      </div>
                      {getStatusBadge(assignment.status)}
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{assignment.subject}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Hạn nộp: {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                      {assignment.grade && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Điểm: {assignment.grade}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                {assignment.status === 'pending' && (
                  <Button onClick={() => openSubmitDialog(assignment)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Nộp bài
                  </Button>
                )}
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Tải đề bài
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {assignments.filter(a => a.status === 'pending').map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {getStatusIcon(assignment.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-gray-900">{assignment.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{assignment.description}</p>
                      </div>
                      {getStatusBadge(assignment.status)}
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{assignment.subject}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Hạn nộp: {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={() => openSubmitDialog(assignment)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Nộp bài
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Tải đề bài
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          {assignments.filter(a => a.status === 'submitted').map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {getStatusIcon(assignment.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-gray-900">{assignment.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{assignment.description}</p>
                      </div>
                      {getStatusBadge(assignment.status)}
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{assignment.subject}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Đã nộp</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="graded" className="space-y-4">
          {assignments.filter(a => a.status === 'graded').map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {getStatusIcon(assignment.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-gray-900">{assignment.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{assignment.description}</p>
                      </div>
                      {getStatusBadge(assignment.status)}
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{assignment.subject}</span>
                      </div>
                      {assignment.grade && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Điểm: {assignment.grade}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      {/* Submit Dialog */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nộp bài tập</DialogTitle>
            <DialogDescription>Gửi bài làm và tài liệu của bạn</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Ghi chú</Label>
              <Textarea 
                placeholder="Nhập ghi chú (không bắt buộc)" 
                rows={4}
                value={submissionNote}
                onChange={(e) => setSubmissionNote(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Tải file lên</Label>
              <Input type="file" />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>Hủy</Button>
              <Button onClick={handleSubmit}>Nộp bài</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
