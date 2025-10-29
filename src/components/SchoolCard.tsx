import { MapPin, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

export interface School {
  id: string;
  name: string;
  address: string;
  phone: string;
  provinceId: string;
  districtId: string;
}

interface SchoolCardProps {
  school: School;
  onRegister: (school: School) => void;
}

export function SchoolCard({ school, onRegister }: SchoolCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <h3 className="text-blue-700">{school.name}</h3>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{school.address}</span>
        </div>
        <div className="flex gap-2 text-sm text-muted-foreground">
          <Phone className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{school.phone}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => onRegister(school)}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Đăng ký nguyện vọng
        </Button>
      </CardFooter>
    </Card>
  );
}
