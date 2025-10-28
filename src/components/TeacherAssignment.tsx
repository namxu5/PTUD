import { useState } from 'react';
import { UserCog, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';

interface Assignment {
  id: number;
  teacher: string;
  subject: string;
  classes: string[];
  role: string;
}

export function TeacherAssignment() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 1,
      teacher: 'Nguyễn Văn A',
      subject: 'Toán',
      classes: ['10A1', '10A2', '10A3'],
      role: 'Giáo viên chủ nhiệm',
    },
    {
      id: 2,
      teacher: 'Trần Thị B',
      subject: 'Văn',
      classes: ['10A1', '11A1'],
      role: 'Giáo viên bộ môn',
    },
    {
      id: 3,
      teacher: 'Lê Văn C',
      subject: 'Lý',
      classes: ['10A2', '10A3', '11A2'],
      role: 'Giáo viên bộ môn',
    },
    {
      id: 4,
      teacher: 'Phạm Thị D',
      subject: 'Hóa',
      classes: ['10A1', '10A2'],
      role: 'Trưởng tổ bộ môn',
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [formData, setFormData] = useState({
    teacher: '',
    subject: '',
    classValue: '',
    role: '',
  });

  const resetForm = () => {
    setFormData({
      teacher: '',
      subject: '',
      classValue: '',
      role: '',
    });
  };

  const handleAdd = () => {
    if (!formData.teacher || !formData.subject || !formData.classValue || !formData.role) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const teacherName = formData.teacher === 'teacher1' ? 'Nguyễn Văn A' : formData.teacher === 'teacher2' ? 'Trần Thị B' : 'Lê Văn C';
    const subjectName = formData.subject === 'math' ? 'Toán' : formData.subject === 'literature' ? 'Văn' : formData.subject === 'physics' ? 'Lý' : 'Hóa';
    const className = formData.classValue === '10a1' ? '10A1' : formData.classValue === '10a2' ? '10A2' : '10A3';
    const roleName = formData.role === 'homeroom' ? 'Giáo viên chủ nhiệm' : formData.role === 'subject' ? 'Giáo viên bộ môn' : 'Trưởng tổ bộ môn';

    const newAssignment: Assignment = {
      id: assignments.length + 1,
      teacher: teacherName,
      subject: subjectName,
      classes: [className],
      role: roleName,
    };

    setAssignments([...assignments, newAssignment]);
    toast.success('Phân công giáo viên thành công');
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!selectedAssignment || !formData.teacher || !formData.subject || !formData.classValue || !formData.role) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const teacherName = formData.teacher === 'teacher1' ? 'Nguyễn Văn A' : formData.teacher === 'teacher2' ? 'Trần Thị B' : 'Lê Văn C';
    const subjectName = formData.subject === 'math' ? 'Toán' : formData.subject === 'literature' ? 'Văn' : formData.subject === 'physics' ? 'Lý' : 'Hóa';
    const className = formData.classValue === '10a1' ? '10A1' : formData.classValue === '10a2' ? '10A2' : '10A3';
    const roleName = formData.role === 'homeroom' ? 'Giáo viên chủ nhiệm' : formData.role === 'subject' ? 'Giáo viên bộ môn' : 'Trưởng tổ bộ môn';

    setAssignments(assignments.map(a => 
      a.id === selectedAssignment.id 
        ? { ...a, teacher: teacherName, subject: subjectName, classes: [className], role: roleName }
        : a
    ));
    toast.success('Cập nhật phân công thành công');
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    setAssignments(assignments.filter(a => a.id !== id));
    toast.success('Xóa phân công thành công');
  };

  const openEditDialog = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setFormData({
      teacher: 'teacher1',
      subject: 'math',
      classValue: '10a1',
      role: 'subject',
    });
    setIsEditDialogOpen(true);
  };

  const stats = {
    total: assignments.length,
    homeroom: assignments.filter(a => a.role === 'Giáo viên chủ nhiệm').length,
    head: assignments.filter(a => a.role === 'Trưởng tổ bộ môn').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-gray-900">Phân công giáo viên</h3>
          <p className="text-sm text-gray-500">Quản lý phân công giảng dạy và chủ nhiệm lớp</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Phân công mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Phân công giáo viên</DialogTitle>
              <DialogDescription>Giao nhiệm vụ giảng dạy cho giáo viên</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Giáo viên</Label>
                <Select value={formData.teacher} onValueChange={(value) => setFormData({ ...formData, teacher: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giáo viên" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teacher1">Nguyễn Văn A</SelectItem>
                    <SelectItem value="teacher2">Trần Thị B</SelectItem>
                    <SelectItem value="teacher3">Lê Văn C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                <Label>Lớp</Label>
                <Select value={formData.classValue} onValueChange={(value) => setFormData({ ...formData, classValue: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn lớp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10a1">10A1</SelectItem>
                    <SelectItem value="10a2">10A2</SelectItem>
                    <SelectItem value="10a3">10A3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Vai trò</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="homeroom">Giáo viên chủ nhiệm</SelectItem>
                    <SelectItem value="subject">Giáo viên bộ môn</SelectItem>
                    <SelectItem value="head">Trưởng tổ bộ môn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Hủy</Button>
                <Button onClick={handleAdd}>Phân công</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserCog className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng phân công</p>
              <p className="text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCog className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Chủ nhiệm lớp</p>
              <p className="text-gray-900">{stats.homeroom}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <UserCog className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Trưởng tổ</p>
              <p className="text-gray-900">{stats.head}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Giáo viên</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Môn học</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Lớp phụ trách</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Vai trò</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {assignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{assignment.teacher}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{assignment.subject}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {assignment.classes.map((cls, index) => (
                        <Badge key={index} variant="secondary">
                          {cls}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={
                      assignment.role === 'Giáo viên chủ nhiệm' 
                        ? 'bg-green-100 text-green-700'
                        : assignment.role === 'Trưởng tổ bộ môn'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }>
                      {assignment.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(assignment)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(assignment.id)}>
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
            <DialogTitle>Chỉnh sửa phân công</DialogTitle>
            <DialogDescription>Cập nhật thông tin phân công giáo viên</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Giáo viên</Label>
              <Select value={formData.teacher} onValueChange={(value) => setFormData({ ...formData, teacher: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giáo viên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teacher1">Nguyễn Văn A</SelectItem>
                  <SelectItem value="teacher2">Trần Thị B</SelectItem>
                  <SelectItem value="teacher3">Lê Văn C</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              <Label>Lớp</Label>
              <Select value={formData.classValue} onValueChange={(value) => setFormData({ ...formData, classValue: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn lớp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10a1">10A1</SelectItem>
                  <SelectItem value="10a2">10A2</SelectItem>
                  <SelectItem value="10a3">10A3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Vai trò</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="homeroom">Giáo viên chủ nhiệm</SelectItem>
                  <SelectItem value="subject">Giáo viên bộ môn</SelectItem>
                  <SelectItem value="head">Trưởng tổ bộ môn</SelectItem>
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
