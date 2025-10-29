import { X, CalendarDays, School, Mail, Phone, User } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface Registration {
  studentName: string;
  email: string;
  phone: string;
  schoolId: string;
  schoolName: string;
  timestamp: string;
}

interface RegisteredListProps {
  registrations: Registration[];
  onRemove: (index: number) => void;
}

export function RegisteredList({ registrations, onRemove }: RegisteredListProps) {
  if (registrations.length === 0) {
    return null;
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mt-12">
      <div className="bg-white rounded-lg shadow-sm border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-blue-700 mb-1">Danh sách nguyện vọng đã đăng ký</h2>
            <p className="text-sm text-muted-foreground">
              Bạn đã đăng ký {registrations.length}/3 nguyện vọng
            </p>
          </div>
          <Badge variant="secondary" className="text-blue-700 bg-blue-50">
            {registrations.length} nguyện vọng
          </Badge>
        </div>

        <div className="space-y-4">
          {registrations.map((registration, index) => (
            <Card key={index} className="relative hover:shadow-md transition-shadow">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={() => onRemove(index)}
              >
                <X className="w-4 h-4" />
              </Button>

              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                    <School className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 pr-8">
                    <Badge variant="outline" className="mb-2 text-blue-600 border-blue-600">
                      Nguyện vọng {index + 1}
                    </Badge>
                    <h3 className="text-blue-700">{registration.schoolName}</h3>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex gap-2 text-sm">
                    <User className="w-4 h-4 flex-shrink-0 mt-0.5 text-muted-foreground" />
                    <div>
                      <span className="text-muted-foreground">Học sinh: </span>
                      <span>{registration.studentName}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 text-sm">
                    <Mail className="w-4 h-4 flex-shrink-0 mt-0.5 text-muted-foreground" />
                    <div>
                      <span className="text-muted-foreground">Email: </span>
                      <span>{registration.email}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 text-sm">
                    <Phone className="w-4 h-4 flex-shrink-0 mt-0.5 text-muted-foreground" />
                    <div>
                      <span className="text-muted-foreground">SĐT: </span>
                      <span>{registration.phone}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 text-sm">
                    <CalendarDays className="w-4 h-4 flex-shrink-0 mt-0.5 text-muted-foreground" />
                    <div>
                      <span className="text-muted-foreground">Đăng ký: </span>
                      <span>{formatDate(registration.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
