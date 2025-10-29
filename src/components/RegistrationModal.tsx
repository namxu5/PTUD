import { useState } from "react";
import { School } from "./SchoolCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

interface RegistrationModalProps {
  school: School | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RegistrationData) => Promise<void>;
}

export interface RegistrationData {
  studentName: string;
  email: string;
  phone: string;
  schoolId: string;
}

export function RegistrationModal({
  school,
  isOpen,
  onClose,
  onSubmit,
}: RegistrationModalProps) {
  const [formData, setFormData] = useState<RegistrationData>({
    studentName: "",
    email: "",
    phone: "",
    schoolId: school?.id || "",
  });
  const [errors, setErrors] = useState<Partial<RegistrationData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<RegistrationData> = {};

    // Validate student name (Vietnamese characters only)
    const vietnameseNameRegex = /^[a-zA-ZàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ\s]+$/;
    const trimmedName = formData.studentName.trim();
    const nameWords = trimmedName.split(/\s+/).filter(word => word.length > 0);

    if (!trimmedName) {
      newErrors.studentName = "Vui lòng nhập họ tên học sinh";
    } else if (!vietnameseNameRegex.test(trimmedName)) {
      newErrors.studentName = "Họ tên chỉ được chứa chữ cái tiếng Việt";
    } else if (nameWords.length < 2) {
      newErrors.studentName = "Họ tên phải có ít nhất 2 từ (họ và tên)";
    } else if (trimmedName.length < 3) {
      newErrors.studentName = "Họ tên phải có ít nhất 3 ký tự";
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Validate phone
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ ...formData, schoolId: school?.id || "" });
      setFormData({ studentName: "", email: "", phone: "", schoolId: "" });
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ studentName: "", email: "", phone: "", schoolId: "" });
    setErrors({});
    onClose();
  };

  if (!school) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Đăng ký nguyện vọng</DialogTitle>
          <DialogDescription>
            Điền thông tin học sinh để đăng ký vào trường: <strong>{school.name}</strong>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="studentName">
                Họ tên học sinh <span className="text-destructive">*</span>
              </Label>
              <Input
                id="studentName"
                placeholder="Nhập họ tên đầy đủ"
                value={formData.studentName}
                onChange={(e) =>
                  setFormData({ ...formData, studentName: e.target.value })
                }
                className={errors.studentName ? "border-destructive" : ""}
              />
              {errors.studentName && (
                <p className="text-sm text-destructive">{errors.studentName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                Số điện thoại <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                placeholder="0123456789"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Đăng ký"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
