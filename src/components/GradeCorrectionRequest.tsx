import { useState } from 'react';
import { FileEdit, Send, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';

interface GradeRequest {
  id: number;
  subject: string;
  exam: string;
  currentGrade: number;
  requestedGrade: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  response?: string;
}

export function GradeCorrectionRequest() {
  const [requests, setRequests] = useState<GradeRequest[]>([
    {
      id: 1,
      subject: 'Toán',
      exam: 'Kiểm tra giữa kỳ',
      currentGrade: 7.5,
      requestedGrade: 8.5,
      reason: 'Câu 5 đã làm đúng nhưng bị trừ điểm',
      status: 'pending',
      date: '2025-10-28',
    },
    {
      id: 2,
      subject: 'Văn',
      exam: 'Bài luận số 3',
      currentGrade: 8.0,
      requestedGrade: 9.0,
      reason: 'Bài văn có nhiều ý hay nhưng chưa được đánh giá đúng',
      status: 'approved',
      date: '2025-10-25',
      response: 'Đã xem xét và đồng ý sửa điểm',
    },
    {
      id: 3,
      subject: 'Lý',
      exam: 'Thí nghiệm số 2',
      currentGrade: 6.5,
      requestedGrade: 8.0,
      reason: 'Yêu cầu không hợp lý',
      status: 'rejected',
      date: '2025-10-20',
      response: 'Điểm đã chấm chính xác theo đáp án',
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    exam: '',
    reason: '',
  });

  const handleSubmit = () => {
    if (!formData.subject || !formData.exam || !formData.reason) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const newRequest: GradeRequest = {
      id: requests.length + 1,
      subject: formData.subject === 'math' ? 'Toán' : formData.subject === 'literature' ? 'Văn' : formData.subject === 'physics' ? 'Lý' : 'Hóa',
      exam: formData.exam === 'midterm' ? 'Kiểm tra giữa kỳ' : formData.exam === 'final' ? 'Kiểm tra cuối kỳ' : 'Kiểm tra 15 phút',
      currentGrade: 7.0,
      requestedGrade: 8.0,
      reason: formData.reason,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
    };

    setRequests([newRequest, ...requests]);
    toast.success('Gửi phiếu sửa điểm thành công');
    setIsDialogOpen(false);
    setFormData({ subject: '', exam: '', reason: '' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Đang xử lý</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-700">Đã duyệt</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700">Từ chối</Badge>;
      default:
        return <Badge>Không xác định</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const stats = {
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-gray-900">Phiếu sửa điểm</h3>
          <p className="text-sm text-gray-500">Quản lý các yêu cầu sửa điểm của học sinh</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Send className="w-4 h-4 mr-2" />
              Gửi phiếu mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Gửi phiếu sửa điểm</DialogTitle>
              <DialogDescription>Yêu cầu xem xét lại điểm số của bạn</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Môn học</Label>
                <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn môn học" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="math">Toán</SelectItem>
                    <SelectItem value="literature">Văn</SelectItem>
                    <SelectItem value="physics">Lý</SelectItem>
                    <SelectItem value="chemistry">Hóa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Bài kiểm tra</Label>
                <Select value={formData.exam} onValueChange={(value) => setFormData({ ...formData, exam: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn bài kiểm tra" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="midterm">Kiểm tra giữa kỳ</SelectItem>
                    <SelectItem value="final">Kiểm tra cuối kỳ</SelectItem>
                    <SelectItem value="test1">Kiểm tra 15 phút</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Lý do yêu cầu sửa điểm</Label>
                <Textarea 
                  placeholder="Mô tả chi tiết lý do yêu cầu sửa điểm..."
                  rows={4}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
                <Button onClick={handleSubmit}>Gửi phiếu</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đang xử lý</p>
              <p className="text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đã duyệt</p>
              <p className="text-gray-900">{stats.approved}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Từ chối</p>
              <p className="text-gray-900">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                {getStatusIcon(request.status)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-gray-900">{request.subject} - {request.exam}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Ngày gửi: {new Date(request.date).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Điểm hiện tại</p>
                      <p className="text-gray-900">{request.currentGrade}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Điểm đề xuất</p>
                      <p className="text-gray-900">{request.requestedGrade}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Lý do:</p>
                    <p className="text-sm text-gray-700">{request.reason}</p>
                  </div>
                  {request.response && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Phản hồi:</p>
                      <p className="text-sm text-gray-700">{request.response}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
