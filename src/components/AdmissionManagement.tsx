import { useState } from "react";
import { TrendingUp, Users, CheckCircle, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { toast } from "sonner@2.0.3";
import { Alert, AlertDescription } from "./ui/alert";

interface Application {
  id: string;
  name: string;
  math: number;
  literature: number;
  english: number;
  total: number;
  priority: 1 | 2 | 3;
  result?: string;
  admitted?: boolean;
}

interface School {
  id: string;
  name: string;
  quota: number;
}

const schools: School[] = [
  { id: "le-hong-phong", name: "THPT Lê Hồng Phong", quota: 300 },
  { id: "nguyen-hue", name: "THPT Nguyễn Huệ", quota: 350 },
  { id: "tran-dai-nghia", name: "THPT Trần Đại Nghĩa", quota: 280 },
  { id: "mac-dinh-chi", name: "THPT Mạc Đĩnh Chi", quota: 320 },
  { id: "nguyen-thi-minh-khai", name: "THPT Nguyễn Thị Minh Khai", quota: 340 },
  { id: "bui-thi-xuan", name: "THPT Bùi Thị Xuân", quota: 360 },
  { id: "vo-thi-sau", name: "THPT Võ Thị Sáu", quota: 310 },
];

// Hàm sinh ngẫu nhiên 300 thí sinh
function generateRandomApplications(count: number): Application[] {
  const firstNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Huỳnh", "Võ", "Đặng", "Phan", "Bùi", "Đỗ"];
  const middleNames = ["Văn", "Thị", "Minh", "Hoàng", "Thu", "Hồng", "Anh", "Bảo", "Quốc", "Tấn"];
  const lastNames = ["An", "Linh", "Hùng", "Trang", "Phúc", "Duy", "Lan", "Nam", "Hà", "Việt", "Hương", "Tú", "Đạt"];

  const apps: Application[] = [];

  for (let i = 1; i <= count; i++) {
    const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
      middleNames[Math.floor(Math.random() * middleNames.length)]
    } ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;

    const math = +(Math.random() * 5 + 5).toFixed(1); // 5–10
    const literature = +(Math.random() * 5 + 5).toFixed(1);
    const english = +(Math.random() * 5 + 5).toFixed(1);
    const total = +(math + literature + english).toFixed(1);
    const priority = (Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3;

    apps.push({
      id: `HCM${String(i).padStart(3, "0")}`,
      name,
      math,
      literature,
      english,
      total,
      priority,
    });
  }

  return apps;
}

export function AdmissionManagement() {
  const [selectedSchool, setSelectedSchool] = useState("le-hong-phong");
  const [admissionMethod, setAdmissionMethod] = useState("score-quota");
  const [minScore, setMinScore] = useState("16.0");
  const [hasProcessed, setHasProcessed] = useState(false);

  const [applications, setApplications] = useState<Application[]>(
    generateRandomApplications(300)
  );

  const currentSchool = schools.find((s) => s.id === selectedSchool)!;

  const processAdmission = () => {
    const minScoreNum = parseFloat(minScore);
    const quotaNum = currentSchool.quota;

    // Danh sách đủ điều kiện
    const eligible = applications
      .filter((a) => a.total >= minScoreNum)
      .sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        return b.total - a.total;
      });

    let admittedCount = 0;
    const processed = applications.map((a) => {
      const isEligible = a.total >= minScoreNum;
      if (!isEligible) return { ...a, admitted: false, result: "Không trúng tuyển" };

      const rank = eligible.findIndex((e) => e.id === a.id);
      if (rank < quotaNum && admittedCount < quotaNum) {
        admittedCount++;
        return {
          ...a,
          admitted: true,
          result: `Trúng tuyển NV${a.priority}`,
        };
      }

      return { ...a, admitted: false, result: "Không trúng tuyển" };
    });

    setApplications(processed);
    setHasProcessed(true);
    toast.success(
      `Đã xét tuyển ${admittedCount}/${quotaNum} học sinh cho ${currentSchool.name}.`
    );
  };

  const stats = {
    quota: currentSchool.quota,
    eligible: applications.filter((a) => a.total >= parseFloat(minScore)).length,
    admitted: applications.filter((a) => a.admitted).length,
    rejected: applications.filter(
      (a) => a.result === "Không trúng tuyển"
    ).length,
    registered: applications.length,
  };

  const getPriorityBadge = (priority: number) => {
    const colors = {
      1: "bg-blue-500 text-white",
      2: "bg-purple-500 text-white",
      3: "bg-orange-500 text-white",
    };
    return <Badge className={colors[priority as keyof typeof colors]}>NV{priority}</Badge>;
  };

  const getResultBadge = (result?: string) => {
    if (!result) return null;
    if (result.includes("Không")) {
      return (
        <Badge className="bg-red-500 text-white">
          <XCircle className="w-3 h-3 mr-1" /> Không trúng tuyển
        </Badge>
      );
    }
    return (
      <Badge className="bg-green-500 text-white">
        <CheckCircle className="w-3 h-3 mr-1" /> {result}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Form xét tuyển */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-gray-900 mb-2">Xét tuyển vào lớp 10</h3>
        <p className="text-sm text-gray-500 mb-6">
          Trường: {currentSchool.name} | Chỉ tiêu: {currentSchool.quota} | Tổng thí sinh: {stats.registered}
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Chọn trường *</Label>
            <Select value={selectedSchool} onValueChange={setSelectedSchool}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {schools.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} (Chỉ tiêu: {s.quota})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Điểm tối thiểu</Label>
            <Input
              type="number"
              step="0.1"
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
            />
          </div>

          <Button
            className="w-full bg-black hover:bg-gray-800"
            size="lg"
            onClick={processAdmission}
          >
            Xét tuyển
          </Button>

          {hasProcessed && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Đã xét tuyển {stats.admitted}/{stats.quota} học sinh.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-blue-500 w-6 h-6" />
            <div>
              <p className="text-sm text-gray-500">Chỉ tiêu</p>
              <p className="text-2xl">{stats.quota}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <Users className="text-purple-500 w-6 h-6" />
            <div>
              <p className="text-sm text-gray-500">Đủ điều kiện</p>
              <p className="text-2xl">{stats.eligible}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-500 w-6 h-6" />
            <div>
              <p className="text-sm text-gray-500">Trúng tuyển</p>
              <p className="text-2xl">{stats.admitted}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <XCircle className="text-red-500 w-6 h-6" />
            <div>
              <p className="text-sm text-gray-500">Không trúng tuyển</p>
              <p className="text-2xl">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bảng kết quả */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <h3 className="text-gray-900">Kết quả xét tuyển</h3>
          <p className="text-sm text-gray-500">
            Hiển thị đầy đủ cả thí sinh trúng tuyển và không trúng tuyển
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Mã thí sinh</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Họ và tên</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Toán</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Văn</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Anh</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Tổng điểm</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Nguyện vọng</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Kết quả</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {applications.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{a.id}</td>
                  <td className="px-6 py-4 text-sm">{a.name}</td>
                  <td className="px-6 py-4 text-sm">{a.math}</td>
                  <td className="px-6 py-4 text-sm">{a.literature}</td>
                  <td className="px-6 py-4 text-sm">{a.english}</td>
                  <td className="px-6 py-4 text-sm">{a.total}</td>
                  <td className="px-6 py-4">{getPriorityBadge(a.priority)}</td>
                  <td className="px-6 py-4">{getResultBadge(a.result)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
