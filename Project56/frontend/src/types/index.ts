export interface Course {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  duration: string;
  ageRange: string;
  materials: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  teacher: string;
  tags: string[];
  scheduleCount: number;
  enrolledCount: number;
  rating: number;
}

export interface Schedule {
  id: number;
  courseId: number;
  courseName: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  enrolled: number;
  classroom: string;
  teacher: string;
}

export interface Enrollment {
  id: number;
  courseId: number;
  courseName: string;
  courseImage: string;
  scheduleId: number;
  scheduleDate: string;
  scheduleTime: string;
  childName: string;
  childAge: number;
  parentName: string;
  parentPhone: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled' | 'completed';
  payTime?: string;
  createTime: string;
}

export interface AttendanceRecord {
  id: number;
  enrollmentId: number;
  courseId: number;
  courseName: string;
  scheduleId: number;
  scheduleDate: string;
  childName: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  checkInTime?: string;
  remark?: string;
}

export interface ParentInfo {
  id: number;
  name: string;
  phone: string;
  avatar: string;
  children: ChildInfo[];
}

export interface ChildInfo {
  id: number;
  name: string;
  age: number;
  gender: 'boy' | 'girl';
  avatar?: string;
}
