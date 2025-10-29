// Node.js API Base URL
const API_BASE_URL = 'http://localhost:3001/api';

// Types
interface Student {
  studentId: string;
  fullName: string;
  class: string;
  email?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'transferred';
  dateOfBirth?: Date;
  address?: string;
  parentContact?: string;
}

interface Class {
  classId: string;
  className: string;
  homeRoomTeacher: string;
  academicYear: string;
  maxStudents: number;
  currentStudents: number;
  schedule: {
    days: string[];
    timeSlot: string;
  };
  status: 'active' | 'inactive';
}

interface AttendanceRecord {
  studentId: string;
  studentName: string;
  classId: string;
  date: Date;
  session: 'morning' | 'afternoon' | 'evening';
  status: 'present' | 'absent-excused' | 'absent-unexcused' | 'late';
  note?: string;
  recordedBy: string;
  recordedAt?: Date;
}

interface AttendanceStats {
  presentCount: number;
  totalCount: number;
  absentCount?: number;
}

export class AttendanceService {
  // Helper method for API calls
  private static async apiCall(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Get all classes
  static async getAllClasses(): Promise<Class[]> {
    try {
      const response = await this.apiCall('/classes');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw error;
    }
  }

  // Get classes by date
  static async getClassesByDate(date: Date): Promise<Class[]> {
    try {
      const dateStr = date.toISOString().split('T')[0];
      const response = await this.apiCall(`/classes/by-date/${dateStr}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching classes by date:', error);
      throw error;
    }
  }

  // Get class by ID
  static async getClassById(classId: string): Promise<Class | null> {
    try {
      const response = await this.apiCall(`/classes/${classId}`);
      return response.data || null;
    } catch (error) {
      console.error('Error fetching class by ID:', error);
      throw error;
    }
  }

  // Get students by class
  static async getStudentsByClass(classId: string): Promise<Student[]> {
    try {
      const response = await this.apiCall(`/students/class/${classId}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching students by class:', error);
      throw error;
    }
  }

  // Get all students
  static async getAllStudents(classFilter?: string): Promise<Student[]> {
    try {
      const queryParams = classFilter ? `?class=${classFilter}` : '';
      const response = await this.apiCall(`/students${queryParams}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching all students:', error);
      throw error;
    }
  }

  // Search students
  static async searchStudents(query: string, classFilter?: string): Promise<Student[]> {
    try {
      const queryParams = new URLSearchParams({ query });
      if (classFilter) queryParams.append('class', classFilter);
      
      const response = await this.apiCall(`/students/search?${queryParams}`);
      return response.data || [];
    } catch (error) {
      console.error('Error searching students:', error);
      throw error;
    }
  }

  // Get attendance by date and class
  static async getAttendanceByDateAndClass(
    date: Date, 
    classId: string, 
    session: 'morning' | 'afternoon' | 'evening' = 'morning'
  ): Promise<AttendanceRecord[]> {
    try {
      const dateStr = date.toISOString().split('T')[0];
      const queryParams = new URLSearchParams({ session });
      
      const response = await this.apiCall(`/attendance/class/${classId}/date/${dateStr}?${queryParams}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }
  }

  // Save single attendance record
  static async saveAttendance(attendanceData: Omit<AttendanceRecord, 'recordedAt'>): Promise<AttendanceRecord> {
    try {
      const response = await this.apiCall('/attendance', {
        method: 'POST',
        body: JSON.stringify(attendanceData),
      });
      return response.data;
    } catch (error) {
      console.error('Error saving attendance:', error);
      throw error;
    }
  }

  // Save multiple attendance records
  static async saveMultipleAttendance(attendanceData: Omit<AttendanceRecord, 'recordedAt'>[]): Promise<AttendanceRecord[]> {
    try {
      const response = await this.apiCall('/attendance/bulk', {
        method: 'POST',
        body: JSON.stringify({ attendanceData }),
      });
      return response.data || [];
    } catch (error) {
      console.error('Error saving multiple attendance:', error);
      throw error;
    }
  }

  // Get attendance statistics for a class on a specific date
  static async getAttendanceStatsForClass(
    classId: string, 
    date: Date, 
    session: 'morning' | 'afternoon' | 'evening' = 'morning'
  ): Promise<AttendanceStats | null> {
    try {
      const dateStr = date.toISOString().split('T')[0];
      const queryParams = new URLSearchParams({ session });
      
      const response = await this.apiCall(`/attendance/stats/class/${classId}/date/${dateStr}?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
      return null;
    }
  }

  // Get attendance statistics for a class over a period
  static async getAttendanceStats(
    classId: string,
    startDate?: Date,
    endDate?: Date,
    session: 'morning' | 'afternoon' | 'evening' = 'morning'
  ): Promise<any> {
    try {
      const queryParams = new URLSearchParams({ session });
      if (startDate) queryParams.append('startDate', startDate.toISOString().split('T')[0]);
      if (endDate) queryParams.append('endDate', endDate.toISOString().split('T')[0]);
      
      const response = await this.apiCall(`/attendance/stats/${classId}?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance statistics:', error);
      throw error;
    }
  }

  // Get student attendance history
  static async getStudentAttendanceHistory(
    studentId: string,
    startDate?: Date,
    endDate?: Date,
    session?: 'morning' | 'afternoon' | 'evening'
  ): Promise<AttendanceRecord[]> {
    try {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('startDate', startDate.toISOString().split('T')[0]);
      if (endDate) queryParams.append('endDate', endDate.toISOString().split('T')[0]);
      if (session) queryParams.append('session', session);
      
      const response = await this.apiCall(`/attendance/student/${studentId}?${queryParams}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching student attendance history:', error);
      throw error;
    }
  }

  // Confirm attendance
  static async confirmAttendance(
    classId: string, 
    date: Date, 
    session: 'morning' | 'afternoon' | 'evening' = 'morning'
  ): Promise<any> {
    try {
      const response = await this.apiCall('/attendance/confirm', {
        method: 'POST',
        body: JSON.stringify({
          classId,
          date: date.toISOString(),
          session,
        }),
      });
      return response.data;
    } catch (error) {
      console.error('Error confirming attendance:', error);
      throw error;
    }
  }

  // Delete attendance record
  static async deleteAttendance(attendanceId: string): Promise<boolean> {
    try {
      await this.apiCall(`/attendance/${attendanceId}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error('Error deleting attendance:', error);
      return false;
    }
  }

  // Create new class
  static async createClass(classData: Omit<Class, 'currentStudents'>): Promise<Class> {
    try {
      const response = await this.apiCall('/classes', {
        method: 'POST',
        body: JSON.stringify(classData),
      });
      return response.data;
    } catch (error) {
      console.error('Error creating class:', error);
      throw error;
    }
  }

  // Update class
  static async updateClass(classId: string, classData: Partial<Class>): Promise<Class> {
    try {
      const response = await this.apiCall(`/classes/${classId}`, {
        method: 'PUT',
        body: JSON.stringify(classData),
      });
      return response.data;
    } catch (error) {
      console.error('Error updating class:', error);
      throw error;
    }
  }

  // Create new student
  static async createStudent(studentData: Omit<Student, 'status'>): Promise<Student> {
    try {
      const response = await this.apiCall('/students', {
        method: 'POST',
        body: JSON.stringify(studentData),
      });
      return response.data;
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

  // Update student
  static async updateStudent(studentId: string, studentData: Partial<Student>): Promise<Student> {
    try {
      const response = await this.apiCall(`/students/${studentId}`, {
        method: 'PUT',
        body: JSON.stringify(studentData),
      });
      return response.data;
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }

  // Delete student
  static async deleteStudent(studentId: string): Promise<boolean> {
    try {
      await this.apiCall(`/students/${studentId}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error('Error deleting student:', error);
      return false;
    }
  }

  // Health check
  static async healthCheck(): Promise<boolean> {
    try {
      await this.apiCall('/health');
      return true;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }
}