import { useState } from 'react';
import { GraduationCap, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner@2.0.3';

interface Application {
  id: string;
  name: string;
  dob: string;
  score: number;
  priority: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export function AdmissionManagement() {
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 'HS2025001',
      name: 'Nguyễn Văn An',
      dob: '15/03/2010',
      score: 28.5,
      priority: 'Khu vực 1',
      status: 'approved',
      date: '2025-10-15',
    },
    {
      id: 'HS2025002',
      name: 'Trần Thị Bình',
      dob: '20/05/2010',
      score: 27.0,
      priority: 'Khu vực 2',
      status: 'pending',
      date: '2025-10-16',
    },
    {
      id: 'HS2025003',
      name: 'Lê Văn Cường',
      dob: '10/01/2010',
      score: 29.0,
      priority: 'Khu vực 1',
      status: 'approved',
      date: '2025-10-17',
    },
    {
      id: 'HS2025004',
      name: 'Phạm Thị Dung',
      dob: '25/07/2010',
      score: 22.5,
      priority: 'Khu vực 3',
      status: 'rejected',
      date: '2025-10-18',
    },
    {
      id: 'HS2025005',
      name: 'Hoàng Văn Em',
      dob: '08/11/2010',
      score: 26.5,
      priority: 'Khu vực 2',
      status: 'pending',
      date: '2025-10-19',
    },
  ]);

  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleApprove = (id: string) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: 'approved' as const } : app
    ));
    toast.success('Duyệt hồ sơ thành công');
    setIsViewDialogOpen(false);
  };

  const handleReject = (id: string) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: 'rejected' as const } : app
    ));
    toast.success('Từ chối hồ sơ thành công');
    setIsViewDialogOpen(false);
  };

  const openViewDialog = (app: Application) => {
    setSelectedApp(app);
    setIsViewDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Đang xét</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-700">Đã duyệt</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700">Không đạt</Badge>;
      default:
        return <Badge>Không xác định</Badge>;
    }
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const filterApplications = (status?: string) => {
    if (!status) return applications;
    return applications.filter(a => a.status === status);
  };

  const renderApplicationsTable = (apps: Application[]) => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs text-gray-500">Mã hồ sơ</th>
              <th className="px-6 py-3 text-left text-xs text-gray-500">Họ và tên</th>
              <th className="px-6 py-3 text-left text-xs text-gray-500">Ngày sinh</th>
              <th className="px-6 py-3 text-left text-xs text-gray-500">Điểm xét tuyển</th>
              <th className="px-6 py-3 text-left text-xs text-gray-500">Đối tượng ưu tiên</th>
              <th className="px-6 py-3 text-left text-xs text-gray-500">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs text-gray-500">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {apps.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{app.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{app.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{app.dob}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{app.score}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{app.priority}</td>
                <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openViewDialog(app)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng hồ sơ</p>
              <p className="text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đang xét</p>
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
              <p className="text-sm text-gray-500">Không đạt</p>
              <p className="text-gray-900">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="pending">Đang xét</TabsTrigger>
          <TabsTrigger value="approved">Đã duyệt</TabsTrigger>
          <TabsTrigger value="rejected">Không đạt</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {renderApplicationsTable(filterApplications())}
        </TabsContent>

        <TabsContent value="pending">
          {renderApplicationsTable(filterApplications('pending'))}
        </TabsContent>

        <TabsContent value="approved">
          {renderApplicationsTable(filterApplications('approved'))}
        </TabsContent>

        <TabsContent value="rejected">
          {renderApplicationsTable(filterApplications('rejected'))}
        </TabsContent>
      </Tabs>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết hồ sơ</DialogTitle>
            <DialogDescription>Xem thông tin chi tiết hồ sơ xét tuyển</DialogDescription>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Mã hồ sơ</p>
                  <p className="text-sm text-gray-900">{selectedApp.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Họ và tên</p>
                  <p className="text-sm text-gray-900">{selectedApp.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Ngày sinh</p>
                  <p className="text-sm text-gray-900">{selectedApp.dob}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Điểm xét tuyển</p>
                  <p className="text-sm text-gray-900">{selectedApp.score}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Đối tượng ưu tiên</p>
                  <p className="text-sm text-gray-900">{selectedApp.priority}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Trạng thái</p>
                  {getStatusBadge(selectedApp.status)}
                </div>
              </div>
              {selectedApp.status === 'pending' && (
                <div className="flex gap-2 justify-end pt-4 border-t">
                  <Button variant="outline" onClick={() => handleReject(selectedApp.id)}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Từ chối
                  </Button>
                  <Button onClick={() => handleApprove(selectedApp.id)}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Duyệt hồ sơ
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
