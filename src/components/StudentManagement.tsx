import { useState } from 'react';
import { Search, Plus, Filter, Download, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';

interface Student {
  id: string;
  name: string;
  class: string;
  dob: string;
  status: 'active' | 'inactive';
  phone: string;
}

export function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([
    { id: 'HS001', name: 'Nguyễn Văn An', class: '10A1', dob: '2008-03-15', status: 'active', phone: '0912345678' },
    { id: 'HS002', name: 'Trần Thị Bình', class: '10A1', dob: '2008-05-20', status: 'active', phone: '0923456789' },
    { id: 'HS003', name: 'Lê Văn Cường', class: '10A2', dob: '2008-01-10', status: 'active', phone: '0934567890' },
    { id: 'HS004', name: 'Phạm Thị Dung', class: '10A2', dob: '2008-07-25', status: 'inactive', phone: '0945678901' },
    { id: 'HS005', name: 'Hoàng Văn Em', class: '10A3', dob: '2008-11-08', status: 'active', phone: '0956789012' },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    class: '',
    dob: '',
    status: 'active' as 'active' | 'inactive',
    phone: '',
  });

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      class: '',
      dob: '',
      status: 'active',
      phone: '',
    });
  };

  const handleAdd = () => {
    if (!formData.id || !formData.name || !formData.class || !formData.dob || !formData.phone) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const existingStudent = students.find(s => s.id === formData.id);
    if (existingStudent) {
      toast.error('Mã học sinh đã tồn tại');
      return;
    }

    setStudents([...students, formData]);
    toast.success('Thêm học sinh thành công');
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!formData.name || !formData.class || !formData.dob || !formData.phone) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setStudents(students.map(s => s.id === formData.id ? formData : s));
    toast.success('Cập nhật thông tin thành công');
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    toast.success('Xóa học sinh thành công');
  };

  const openEditDialog = (student: Student) => {
    setFormData(student);
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (student: Student) => {
    setSelectedStudent(student);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm học sinh..."
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Lọc
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Xuất file
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm học sinh
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm học sinh mới</DialogTitle>
                <DialogDescription>Nhập thông tin học sinh mới vào hệ thống</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Mã học sinh</Label>
                  <Input 
                    placeholder="HS001" 
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Họ và tên</Label>
                  <Input 
                    placeholder="Nguyễn Văn A" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ngày sinh</Label>
                  <Input 
                    type="date" 
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Lớp</Label>
                  <Select value={formData.class} onValueChange={(value) => setFormData({ ...formData, class: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn lớp" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10A1">10A1</SelectItem>
                      <SelectItem value="10A2">10A2</SelectItem>
                      <SelectItem value="10A3">10A3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Số điện thoại</Label>
                  <Input 
                    placeholder="0912345678" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Hủy</Button>
                  <Button onClick={handleAdd}>Thêm học sinh</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Mã HS</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Họ và tên</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Lớp</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Ngày sinh</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Số điện thoại</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{student.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.class}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(student.dob).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.phone}</td>
                  <td className="px-6 py-4">
                    <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                      {student.status === 'active' ? 'Đang học' : 'Nghỉ học'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openViewDialog(student)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(student)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(student.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin học sinh</DialogTitle>
            <DialogDescription>Cập nhật thông tin cho học sinh {formData.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Mã học sinh</Label>
              <Input value={formData.id} disabled />
            </div>
            <div className="space-y-2">
              <Label>Họ và tên</Label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Ngày sinh</Label>
              <Input 
                type="date" 
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Lớp</Label>
              <Select value={formData.class} onValueChange={(value) => setFormData({ ...formData, class: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10A1">10A1</SelectItem>
                  <SelectItem value="10A2">10A2</SelectItem>
                  <SelectItem value="10A3">10A3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Số điện thoại</Label>
              <Input 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Đang học</SelectItem>
                  <SelectItem value="inactive">Nghỉ học</SelectItem>
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

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết học sinh</DialogTitle>
            <DialogDescription>Thông tin chi tiết của học sinh</DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Mã học sinh</p>
                  <p className="text-sm text-gray-900">{selectedStudent.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Họ và tên</p>
                  <p className="text-sm text-gray-900">{selectedStudent.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Lớp</p>
                  <p className="text-sm text-gray-900">{selectedStudent.class}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Ngày sinh</p>
                  <p className="text-sm text-gray-900">{new Date(selectedStudent.dob).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Số điện thoại</p>
                  <p className="text-sm text-gray-900">{selectedStudent.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Trạng thái</p>
                  <Badge variant={selectedStudent.status === 'active' ? 'default' : 'secondary'}>
                    {selectedStudent.status === 'active' ? 'Đang học' : 'Nghỉ học'}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
