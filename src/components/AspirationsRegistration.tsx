import { useState } from 'react';
import { FileText, Plus, Edit, Trash2, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';

interface Aspiration {
  id: number;
  priority: number;
  school: string;
  code: string;
  program: string;
}

export function AspirationsRegistration() {
  const [aspirations, setAspirations] = useState<Aspiration[]>([
    {
      id: 1,
      priority: 1,
      school: 'Trường THPT Chuyên Hà Nội - Amsterdam',
      code: 'HN01',
      program: 'Chuyên Toán',
    },
    {
      id: 2,
      priority: 2,
      school: 'Trường THPT Chu Văn An',
      code: 'HN02',
      program: 'Chuyên Lý',
    },
    {
      id: 3,
      priority: 3,
      school: 'Trường THPT Nguyễn Huệ',
      code: 'HN03',
      program: 'Văn hóa',
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAspiration, setSelectedAspiration] = useState<Aspiration | null>(null);
  const [formData, setFormData] = useState({
    priority: '',
    school: '',
    program: '',
  });

  const registrationPeriod = {
    startDate: '2025-11-01',
    endDate: '2025-11-30',
    status: 'open',
  };

  const resetForm = () => {
    setFormData({
      priority: '',
      school: '',
      program: '',
    });
  };

  const handleAdd = () => {
    if (!formData.priority || !formData.school || !formData.program) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (aspirations.length >= 3) {
      toast.error('Chỉ được đăng ký tối đa 3 nguyện vọng');
      return;
    }

    const priorityNum = parseInt(formData.priority);
    const existingPriority = aspirations.find(a => a.priority === priorityNum);
    if (existingPriority) {
      toast.error(`Nguyện vọng ${priorityNum} đã tồn tại`);
      return;
    }

    const schoolName = formData.school === 'school1' ? 'THPT Chuyên Hà Nội - Amsterdam' : 
                       formData.school === 'school2' ? 'THPT Chu Văn An' : 'THPT Nguyễn Huệ';
    const schoolCode = formData.school === 'school1' ? 'HN01' : 
                       formData.school === 'school2' ? 'HN02' : 'HN03';
    const programName = formData.program === 'math' ? 'Chuyên Toán' : 
                        formData.program === 'physics' ? 'Chuyên Lý' : 
                        formData.program === 'chemistry' ? 'Chuyên Hóa' : 
                        formData.program === 'literature' ? 'Chuyên Văn' : 'Văn hóa';

    const newAspiration: Aspiration = {
      id: aspirations.length + 1,
      priority: priorityNum,
      school: schoolName,
      code: schoolCode,
      program: programName,
    };

    setAspirations([...aspirations, newAspiration].sort((a, b) => a.priority - b.priority));
    toast.success('Thêm nguyện vọng thành công');
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!selectedAspiration || !formData.priority || !formData.school || !formData.program) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const priorityNum = parseInt(formData.priority);
    const existingPriority = aspirations.find(a => a.priority === priorityNum && a.id !== selectedAspiration.id);
    if (existingPriority) {
      toast.error(`Nguyện vọng ${priorityNum} đã tồn tại`);
      return;
    }

    const schoolName = formData.school === 'school1' ? 'THPT Chuyên Hà Nội - Amsterdam' : 
                       formData.school === 'school2' ? 'THPT Chu Văn An' : 'THPT Nguyễn Huệ';
    const schoolCode = formData.school === 'school1' ? 'HN01' : 
                       formData.school === 'school2' ? 'HN02' : 'HN03';
    const programName = formData.program === 'math' ? 'Chuyên Toán' : 
                        formData.program === 'physics' ? 'Chuyên Lý' : 
                        formData.program === 'chemistry' ? 'Chuyên Hóa' : 
                        formData.program === 'literature' ? 'Chuyên Văn' : 'Văn hóa';

    setAspirations(aspirations.map(a => 
      a.id === selectedAspiration.id 
        ? { ...a, priority: priorityNum, school: schoolName, code: schoolCode, program: programName }
        : a
    ).sort((a, b) => a.priority - b.priority));
    
    toast.success('Cập nhật nguyện vọng thành công');
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    setAspirations(aspirations.filter(a => a.id !== id));
    toast.success('Xóa nguyện vọng thành công');
  };

  const handleSave = () => {
    if (aspirations.length === 0) {
      toast.error('Vui lòng thêm ít nhất 1 nguyện vọng');
      return;
    }
    toast.success('Lưu và gửi đăng ký thành công');
  };

  const openEditDialog = (aspiration: Aspiration) => {
    setSelectedAspiration(aspiration);
    setFormData({
      priority: aspiration.priority.toString(),
      school: 'school1',
      program: 'math',
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Registration Period Info */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900">Đăng ký nguyện vọng vào lớp 10</h3>
              <p className="text-sm text-gray-600 mt-1">
                Thời gian: {new Date(registrationPeriod.startDate).toLocaleDateString('vi-VN')} - {new Date(registrationPeriod.endDate).toLocaleDateString('vi-VN')}
              </p>
              <Badge className="mt-2 bg-green-500">Đang mở</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Hướng dẫn đăng ký</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Học sinh được đăng ký tối đa 3 nguyện vọng theo thứ tự ưu tiên</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Nguyện vọng 1 có độ ưu tiên cao nhất</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Có thể chỉnh sửa nguyện vọng trong thời gian đăng ký</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Sau khi hết hạn đăng ký, không thể thay đổi nguyện vọng</span>
          </li>
        </ul>
      </div>

      {/* Current Aspirations */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-900">Danh sách nguyện vọng</h3>
            {aspirations.length < 3 && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm nguyện vọng
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Thêm nguyện vọng</DialogTitle>
                    <DialogDescription>Đăng ký nguyện vọng vào trường THPT</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Thứ tự ưu tiên</Label>
                      <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn thứ tự" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Nguyện vọng 1</SelectItem>
                          <SelectItem value="2">Nguyện vọng 2</SelectItem>
                          <SelectItem value="3">Nguyện vọng 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Trường</Label>
                      <Select value={formData.school} onValueChange={(value) => setFormData({ ...formData, school: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trường" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="school1">THPT Chuyên Hà Nội - Amsterdam</SelectItem>
                          <SelectItem value="school2">THPT Chu Văn An</SelectItem>
                          <SelectItem value="school3">THPT Nguyễn Huệ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Chuyên ngành/Lớp</Label>
                      <Select value={formData.program} onValueChange={(value) => setFormData({ ...formData, program: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn chuyên ngành" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="math">Chuyên Toán</SelectItem>
                          <SelectItem value="physics">Chuyên Lý</SelectItem>
                          <SelectItem value="chemistry">Chuyên Hóa</SelectItem>
                          <SelectItem value="literature">Chuyên Văn</SelectItem>
                          <SelectItem value="general">Văn hóa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Hủy</Button>
                      <Button onClick={handleAdd}>Thêm nguyện vọng</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <div className="p-6">
          {aspirations.length > 0 ? (
            <div className="space-y-4">
              {aspirations.map((aspiration) => (
                <div
                  key={aspiration.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-300 bg-gray-50"
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white">NV{aspiration.priority}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-gray-900">{aspiration.school}</h4>
                        <p className="text-sm text-gray-600 mt-1">Mã trường: {aspiration.code}</p>
                        <Badge className="mt-2 bg-blue-100 text-blue-700">{aspiration.program}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(aspiration)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(aspiration.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Chưa có nguyện vọng nào</p>
              <p className="text-sm text-gray-400 mt-1">Nhấn "Thêm nguyện vọng" để bắt đầu đăng ký</p>
            </div>
          )}
        </div>

        {aspirations.length > 0 && (
          <div className="p-6 border-t border-gray-200">
            <div className="flex justify-end">
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Lưu và gửi đăng ký
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa nguyện vọng</DialogTitle>
            <DialogDescription>Cập nhật thông tin nguyện vọng</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Thứ tự ưu tiên</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thứ tự" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Nguyện vọng 1</SelectItem>
                  <SelectItem value="2">Nguyện vọng 2</SelectItem>
                  <SelectItem value="3">Nguyện vọng 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Trường</Label>
              <Select value={formData.school} onValueChange={(value) => setFormData({ ...formData, school: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trường" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="school1">THPT Chuyên Hà Nội - Amsterdam</SelectItem>
                  <SelectItem value="school2">THPT Chu Văn An</SelectItem>
                  <SelectItem value="school3">THPT Nguyễn Huệ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Chuyên ngành/Lớp</Label>
              <Select value={formData.program} onValueChange={(value) => setFormData({ ...formData, program: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chuyên ngành" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="math">Chuyên Toán</SelectItem>
                  <SelectItem value="physics">Chuyên Lý</SelectItem>
                  <SelectItem value="chemistry">Chuyên Hóa</SelectItem>
                  <SelectItem value="literature">Chuyên Văn</SelectItem>
                  <SelectItem value="general">Văn hóa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Hủy</Button>
              <Button onClick={handleEdit}>Lưu thay đổi</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
