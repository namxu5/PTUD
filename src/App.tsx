import { useState } from 'react';
import { Home, Users, ClipboardCheck, BookOpen, FileEdit, UserCog, GraduationCap, FileText, Menu, Bell, LogOut, Settings } from 'lucide-react';
import { StudentManagement } from './components/StudentManagement';
import { AttendanceApp } from './components/AttendanceApp';
import { HomeworkManagement } from './components/HomeworkManagement';
import { GradeCorrectionRequest } from './components/GradeCorrectionRequest';
import { TeacherAssignment } from './components/TeacherAssignment';
import { AdmissionManagement } from './components/AdmissionManagement';
import { AspirationsRegistration } from './components/AspirationsRegistration';
import { Button } from './components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Badge } from './components/ui/badge';
import { Toaster } from './components/ui/sonner';

function App() {
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', name: 'Trang chủ', icon: Home },
    { id: 'students', name: 'Quản lý học sinh', icon: Users },
    { id: 'attendance', name: 'Điểm danh', icon: ClipboardCheck },
    { id: 'homework', name: 'Làm bài tập', icon: BookOpen },
    { id: 'grade-correction', name: 'Phiếu sửa điểm', icon: FileEdit },
    { id: 'teacher-assignment', name: 'Phân công giáo viên', icon: UserCog },
    { id: 'admission', name: 'Xét tuyển', icon: GraduationCap },
    { id: 'aspirations', name: 'Đăng ký nguyện vọng', icon: FileText },
  ];

  const renderModule = () => {
    switch (activeModule) {
      case 'students':
        return <StudentManagement />;
      case 'attendance':
        return <AttendanceApp />;
      case 'homework':
        return <HomeworkManagement />;
      case 'grade-correction':
        return <GradeCorrectionRequest />;
      case 'teacher-assignment':
        return <TeacherAssignment />;
      case 'admission':
        return <AdmissionManagement />;
      case 'aspirations':
        return <AspirationsRegistration />;
      default:
        return <Dashboard menuItems={menuItems} setActiveModule={setActiveModule} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-gray-900">QLGD</h1>
                <p className="text-xs text-gray-500">Hệ thống quản lý</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeModule === item.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm">{item.name}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Thu gọn</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-gray-900">
                {menuItems.find((item) => item.id === activeModule)?.name || 'Trang chủ'}
              </h2>
              <p className="text-sm text-gray-500">Chào mừng bạn đến với hệ thống quản lý giáo dục</p>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500">
                  3
                </Badge>
              </Button>

              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>

              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-blue-600 text-white">GV</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm text-gray-900">Nguyễn Văn A</p>
                  <p className="text-xs text-gray-500">Giáo viên</p>
                </div>
              </div>

              <Button variant="ghost" size="icon">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderModule()}
        </main>
      </div>
      <Toaster />
    </div>
  );
}

function Dashboard({ menuItems, setActiveModule }: { menuItems: any[]; setActiveModule: (id: string) => void }) {
  const stats = [
    { label: 'Tổng học sinh', value: '1,245', change: '+12%', color: 'bg-blue-500' },
    { label: 'Giáo viên', value: '85', change: '+3%', color: 'bg-green-500' },
    { label: 'Lớp học', value: '42', change: '+5%', color: 'bg-purple-500' },
    { label: 'Điểm danh hôm nay', value: '98%', change: '+2%', color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-gray-900 mt-2">{stat.value}</p>
                <p className="text-xs text-green-600 mt-1">{stat.change} so với tháng trước</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg bg-opacity-10 flex items-center justify-center`}>
                <div className={`w-6 h-6 ${stat.color} rounded`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-4">Chức năng chính</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {menuItems.slice(1).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className="flex flex-col items-center gap-3 p-6 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                <item.icon className="w-6 h-6 text-blue-600 group-hover:text-white" />
              </div>
              <span className="text-sm text-gray-700 group-hover:text-blue-600 text-center">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Hoạt động gần đây</h3>
          <div className="space-y-4">
            {[
              { action: 'Điểm danh lớp 10A1', time: '10 phút trước', icon: ClipboardCheck },
              { action: 'Phê duyệt phiếu sửa điểm', time: '1 giờ trước', icon: FileEdit },
              { action: 'Thêm học sinh mới', time: '2 giờ trước', icon: Users },
              { action: 'Phân công giáo viên', time: '3 giờ trước', icon: UserCog },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <activity.icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Thông báo</h3>
          <div className="space-y-4">
            {[
              { title: 'Họp phụ huynh lớp 10A1', time: 'Thứ 5, 10:00 AM', type: 'meeting' },
              { title: 'Hạn nộp phiếu sửa điểm', time: 'Còn 2 ngày', type: 'deadline' },
              { title: 'Xét tuyển học sinh mới', time: 'Bắt đầu 01/11', type: 'event' },
              { title: 'Đăng ký nguyện vọng', time: 'Đang mở', type: 'registration' },
            ].map((notification, index) => (
              <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{notification.title}</p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
