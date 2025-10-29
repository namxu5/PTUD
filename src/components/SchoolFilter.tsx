import { Search } from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface SchoolFilterProps {
  provinces: Array<{ id: string; name: string }>;
  districts: Array<{ id: string; name: string; provinceId: string }>;
  selectedProvince: string;
  selectedDistrict: string;
  onProvinceChange: (value: string) => void;
  onDistrictChange: (value: string) => void;
  onSearch: () => void;
}

export function SchoolFilter({
  provinces,
  districts,
  selectedProvince,
  selectedDistrict,
  onProvinceChange,
  onDistrictChange,
  onSearch,
}: SchoolFilterProps) {
  const filteredDistricts = districts.filter(
    (d) => d.provinceId === selectedProvince
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border p-6">
      <h2 className="mb-4">Bộ lọc tìm kiếm</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-2">Tỉnh/Thành phố</label>
          <Select value={selectedProvince} onValueChange={onProvinceChange}>
            <SelectTrigger className="bg-input-background">
              <SelectValue placeholder="Chọn tỉnh/thành phố" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((province) => (
                <SelectItem key={province.id} value={province.id}>
                  {province.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block mb-2">Quận/Huyện</label>
          <Select
            value={selectedDistrict}
            onValueChange={onDistrictChange}
            disabled={!selectedProvince}
          >
            <SelectTrigger className="bg-input-background">
              <SelectValue placeholder="Chọn quận/huyện" />
            </SelectTrigger>
            <SelectContent>
              {filteredDistricts.map((district) => (
                <SelectItem key={district.id} value={district.id}>
                  {district.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button onClick={onSearch} className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
            <Search className="w-4 h-4" />
            Tìm kiếm
          </Button>
        </div>
      </div>
    </div>
  );
}
