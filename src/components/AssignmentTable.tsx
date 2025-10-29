import { useState } from 'react';
import { Class } from './TeacherAssignmentSystem';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { UserPlus, Search } from 'lucide-react';

interface AssignmentTableProps {
  classes: Class[];
  onAssign: (classId: string, className: string, subjectId: string, subjectName: string, grade: number) => void;
}

export function AssignmentTable({ classes, onAssign }: AssignmentTableProps) {
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [blockFilter, setBlockFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClasses = classes.filter(cls => {
    const matchesGrade = gradeFilter === 'all' || cls.grade.toString() === gradeFilter;
    const matchesSearch = cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.subjects.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGrade && matchesSearch;
  });

  const getFilteredSubjects = (cls: Class) => {
    let subjects = cls.subjects;

    if (statusFilter === 'assigned') subjects = subjects.filter(s => s.assignedTeacher);
    else if (statusFilter === 'unassigned') subjects = subjects.filter(s => !s.assignedTeacher);

    if (blockFilter !== 'all') {
      subjects = subjects.filter(s => (s.block || 'khac') === blockFilter);
    }

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      const classMatches = cls.name.toLowerCase().includes(q);
      if (!classMatches) {
        subjects = subjects.filter(s => s.name.toLowerCase().includes(q));
      }
    }

    return subjects;
  };

  const filterGroupClass = "p-3 rounded-lg border border-gray-200 bg-gray-50";
  const filterLabelClass = "font-medium text-gray-700 mb-2";
  const filterButtonClass = "px-3 py-1.5 rounded-md text-sm font-medium transition-all";
  const activeButtonClass = "bg-blue-600 text-white shadow-sm";
  const inactiveButtonClass = "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200";

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Filters */}
      <div className="p-4 space-y-4 border-b border-gray-200">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm lớp hoặc môn học..."
            value={searchQuery}
            onChange={(e: any) => setSearchQuery(e.target.value)}
            className="pl-10 w-full max-w-md"
          />
        </div>

        {/* Filter Groups */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Grade Filter */}
          <div className={filterGroupClass}>
            <div className={filterLabelClass}>Khối:</div>
            <div className="flex gap-2">
              { [
                { value: 'all', label: 'Tất cả' },
                { value: '10', label: '10' },
                { value: '11', label: '11' },
                { value: '12', label: '12' }
              ].map(grade => (
                <button
                  key={grade.value}
                  onClick={() => setGradeFilter(grade.value)}
                  className={`${filterButtonClass} ${
                    gradeFilter === grade.value ? activeButtonClass : inactiveButtonClass
                  }`}
                >
                  {grade.label}
                </button>
              )) }
            </div>
          </div>

          {/* Subject Block Filter */}
          <div className={filterGroupClass}>
            <div className={filterLabelClass}>Khối môn:</div>
            <div className="flex gap-2 flex-wrap">
              { [
                { value: 'all', label: 'Tất cả' },
                { value: 'tu_nhien', label: 'Tự nhiên' },
                { value: 'xa_hoi', label: 'Xã hội' },
                { value: 'khac', label: 'Khác' }
              ].map(block => (
                <button
                  key={block.value}
                  onClick={() => setBlockFilter(block.value)}
                  className={`${filterButtonClass} ${
                    blockFilter === block.value ? activeButtonClass : inactiveButtonClass
                  }`}
                >
                  {block.label}
                </button>
              )) }
            </div>
          </div>

          {/* Status Filter */}
          <div className={filterGroupClass}>
            <div className={filterLabelClass}>Trạng thái:</div>
            <div className="flex gap-2">
              { [
                { value: 'all', label: 'Tất cả' },
                { value: 'assigned', label: 'Đã phân công' },
                { value: 'unassigned', label: 'Chưa phân công' }
              ].map(status => (
                <button
                  key={status.value}
                  onClick={() => setStatusFilter(status.value)}
                  className={`${filterButtonClass} ${
                    statusFilter === status.value ? activeButtonClass : inactiveButtonClass
                  }`}
                >
                  {status.label}
                </button>
              )) }
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px] text-center">Lớp</TableHead>
              <TableHead className="w-[100px]">Khối</TableHead>
              <TableHead className="w-[150px]">Môn học</TableHead>
              <TableHead>Giáo viên phụ trách</TableHead>
              <TableHead className="w-[120px]">Trạng thái</TableHead>
              <TableHead className="w-[120px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClasses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  Không tìm thấy kết quả phù hợp
                </TableCell>
              </TableRow>
            ) : (
              filteredClasses.map((cls) => {
                const filteredSubjects = getFilteredSubjects(cls);
                if (filteredSubjects.length === 0) return null;
                return filteredSubjects.map((subject, index) => (
                  <TableRow key={`${cls.id}-${subject.id}`}>
                    {index === 0 && (
                      <>
                        <TableCell className="text-center" rowSpan={filteredSubjects.length}>
                          {cls.name}
                        </TableCell>
                        <TableCell rowSpan={filteredSubjects.length}>
                          Khối {cls.grade}
                        </TableCell>
                      </>
                    )}
                    <TableCell>{subject.name}</TableCell>
                    <TableCell>
                      {subject.assignedTeacher ? (
                        <div>
                          <p>{subject.assignedTeacher.name}</p>
                          <p className="text-sm text-gray-500">
                            {subject.assignedTeacher.currentHours}/{subject.assignedTeacher.maxHours} tiết
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-400">Chưa phân công</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {subject.assignedTeacher ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          Đã phân công
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-orange-300 text-orange-700">
                          Chưa phân công
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant={subject.assignedTeacher ? "outline" : "default"}
                        onClick={() => onAssign(cls.id, cls.name, subject.id, subject.name, cls.grade)}
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        {subject.assignedTeacher ? 'Thay đổi' : 'Phân công'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ));
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
