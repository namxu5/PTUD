import { GraduationCap, LogOut } from "lucide-react";
import { Button } from "./ui/button";

interface NavbarProps {
  onLogout: () => void;
}

export function Navbar({ onLogout }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-blue-600">Đăng ký nguyện vọng</h1>
              <p className="text-sm text-muted-foreground">Hệ thống quản lý học sinh THCS/THPT</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </Button>
        </div>
      </div>
    </nav>
  );
}
