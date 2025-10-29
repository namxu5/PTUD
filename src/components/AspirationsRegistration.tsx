import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { SchoolFilter } from "../components/SchoolFilter";
import { SchoolCard, School } from "../components/SchoolCard";
import { RegistrationModal, RegistrationData } from "../components/RegistrationModal";
import { RegisteredList } from "../components/RegisteredList";
import { Toaster } from "../components/ui/sonner";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

interface Registration {
  studentName: string;
  email: string;
  phone: string;
  schoolId: string;
  schoolName: string;
  timestamp: string;
}

// Mock data
const provinces = [
  { id: "1", name: "Hà Nội" },
  { id: "2", name: "Hồ Chí Minh" },
  { id: "3", name: "Đà Nẵng" },
];

const districts = [
  { id: "1-1", name: "Quận Ba Đình", provinceId: "1" },
  { id: "1-2", name: "Quận Hoàn Kiếm", provinceId: "1" },
  { id: "1-3", name: "Quận Cầu Giấy", provinceId: "1" },
  { id: "2-1", name: "Quận 1", provinceId: "2" },
  { id: "2-2", name: "Quận 3", provinceId: "2" },
  { id: "2-3", name: "Quận Bình Thạnh", provinceId: "2" },
  { id: "3-1", name: "Quận Hải Châu", provinceId: "3" },
  { id: "3-2", name: "Quận Thanh Khê", provinceId: "3" },
];

const allSchools: School[] = [
  {
    id: "s1",
    name: "Trường THPT Chu Văn An",
    address: "26 Đường Nguyễn Bỉnh Khiêm, Quận Ba Đình, Hà Nội",
    phone: "024 3845 2966",
    provinceId: "1",
    districtId: "1-1",
  },
  {
    id: "s2",
    name: "Trường THCS Trần Phú",
    address: "15 Đinh Tiên Hoàng, Quận Hoàn Kiếm, Hà Nội",
    phone: "024 3826 1234",
    provinceId: "1",
    districtId: "1-2",
  },
  {
    id: "s3",
    name: "Trường THPT Cầu Giấy",
    address: "120 Xuân Thủy, Quận Cầu Giấy, Hà Nội",
    phone: "024 3754 8888",
    provinceId: "1",
    districtId: "1-3",
  },
  {
    id: "s4",
    name: "Trường THPT Lê Hồng Phong",
    address: "240 Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh",
    phone: "028 3829 5050",
    provinceId: "2",
    districtId: "2-2",
  },
  {
    id: "s5",
    name: "Trường THCS Nguyễn Du",
    address: "45 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
    phone: "028 3822 7777",
    provinceId: "2",
    districtId: "2-1",
  },
  {
    id: "s6",
    name: "Trường THPT Bình Thạnh",
    address: "68 Xô Viết Nghệ Tĩnh, Quận Bình Thạnh, TP. Hồ Chí Minh",
    phone: "028 3512 3456",
    provinceId: "2",
    districtId: "2-3",
  },
  {
    id: "s7",
    name: "Trường THPT Phan Châu Trinh",
    address: "55 Lê Duẩn, Quận Hải Châu, Đà Nẵng",
    phone: "0236 3821 234",
    provinceId: "3",
    districtId: "3-1",
  },
  {
    id: "s8",
    name: "Trường THCS Trưng Vương",
    address: "88 Ông Ích Khiêm, Quận Thanh Khê, Đà Nẵng",
    phone: "0236 3651 567",
    provinceId: "3",
    districtId: "3-2",
  },
];

export default function App() {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [filteredSchools, setFilteredSchools] = useState<School[]>(allSchools);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registeredSchools, setRegisteredSchools] = useState<string[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  // Load registrations from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("registrations");
    if (stored) {
      const loadedRegistrations = JSON.parse(stored);
      setRegistrations(loadedRegistrations);
      setRegisteredSchools(loadedRegistrations.map((r: Registration) => r.schoolId));
    }
  }, []);

  useEffect(() => {
    // Reset district when province changes
    setSelectedDistrict("");
  }, [selectedProvince]);

  const handleSearch = () => {
    if (!selectedProvince && !selectedDistrict) {
      setFilteredSchools(allSchools);
      return;
    }

    const filtered = allSchools.filter((school) => {
      const matchProvince = selectedProvince
        ? school.provinceId === selectedProvince
        : true;
      const matchDistrict = selectedDistrict
        ? school.districtId === selectedDistrict
        : true;
      return matchProvince && matchDistrict;
    });

    setFilteredSchools(filtered);
  };

  const handleRegister = (school: School) => {
    setSelectedSchool(school);
    setIsModalOpen(true);
  };

  const handleSubmitRegistration = async (data: RegistrationData) => {
    // Check if already registered
    if (registeredSchools.includes(data.schoolId)) {
      toast.error("Lỗi đăng ký", {
        description: "Bạn đã đăng ký nguyện vọng vào trường này rồi!",
      });
      setIsModalOpen(false);
      return;
    }

    // Check maximum registrations (example: max 3)
    if (registeredSchools.length >= 3) {
      toast.error("Vượt quá giới hạn", {
        description: "Bạn chỉ được đăng ký tối đa 3 nguyện vọng!",
      });
      setIsModalOpen(false);
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Create new registration
    const newRegistration = {
      ...data,
      timestamp: new Date().toISOString(),
      schoolName: selectedSchool?.name || "",
    };

    // Update registrations
    const updatedRegistrations = [...registrations, newRegistration];
    setRegistrations(updatedRegistrations);
    localStorage.setItem("registrations", JSON.stringify(updatedRegistrations));

    // Update registered schools list
    setRegisteredSchools([...registeredSchools, data.schoolId]);

    toast.success("Đăng ký thành công!", {
      description: `Đã đăng ký nguyện vọng vào ${selectedSchool?.name}`,
    });

    setIsModalOpen(false);
    setSelectedSchool(null);
  };

  const handleRemoveRegistration = (index: number) => {
    const registration = registrations[index];
    const updatedRegistrations = registrations.filter((_, i) => i !== index);
    
    setRegistrations(updatedRegistrations);
    localStorage.setItem("registrations", JSON.stringify(updatedRegistrations));
    
    // Update registered schools list
    const updatedSchools = updatedRegistrations.map((r) => r.schoolId);
    setRegisteredSchools(updatedSchools);

    toast.success("Đã xóa nguyện vọng", {
      description: `Đã xóa nguyện vọng vào ${registration.schoolName}`,
    });
  };

  const handleLogout = () => {
    toast.info("Đăng xuất", {
      description: "Bạn đã đăng xuất khỏi hệ thống",
    });
    // In a real app, this would clear session and redirect to login
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <SchoolFilter
            provinces={provinces}
            districts={districts}
            selectedProvince={selectedProvince}
            selectedDistrict={selectedDistrict}
            onProvinceChange={setSelectedProvince}
            onDistrictChange={setSelectedDistrict}
            onSearch={handleSearch}
          />
        </div>

        {filteredSchools.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-muted-foreground mb-2">
              Không có trường tại khu vực này
            </h3>
            <p className="text-sm text-muted-foreground">
              Vui lòng thử tìm kiếm với khu vực khác hoặc bỏ bộ lọc
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-muted-foreground">
                Hiển thị <strong>{filteredSchools.length}</strong> trường
              </p>
              {registeredSchools.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Đã đăng ký: {registeredSchools.length}/3 nguyện vọng
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchools.map((school) => (
                <SchoolCard
                  key={school.id}
                  school={school}
                  onRegister={handleRegister}
                />
              ))}
            </div>
          </>
        )}

        <RegisteredList
          registrations={registrations}
          onRemove={handleRemoveRegistration}
        />
      </div>

      <RegistrationModal
        school={selectedSchool}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSchool(null);
        }}
        onSubmit={handleSubmitRegistration}
      />

      <Toaster position="top-right" />
    </div>
  );
}
