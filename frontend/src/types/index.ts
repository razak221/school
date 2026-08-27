export type UserRole = 'admin' | 'teacher' | 'parent' | 'student';

export interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  organization?: {
    id: string;
    name: string;
    affiliation: string;
    zone: string;
    district: string;
    state: string;
    code?: string;
  };
}

export interface ClassSection {
  _id: string;
  className: string;
  gradeLevel: number;
  section: string;
  roomNumber?: string;
  capacity?: number;
  subjects: string[];
  classTeacherId?: {
    _id: string;
    name: string;
  };
}

export interface AttendanceRosterItem {
  studentId: string;
  userId: string;
  name: string;
  rollNumber: number;
  admissionNumber: string;
  gender: string;
  midDayMealOpted: boolean;
  status: 'present' | 'absent' | 'late' | 'leave';
  midDayMealConsumed: boolean;
  remarks?: string;
}

export interface ExamResultItem {
  _id: string;
  examName: string;
  term: string;
  percentage: number;
  overallGrade: string;
  aiRemarks?: string;
  teacherRemarks?: string;
  studentId?: {
    _id: string;
    rollNumber: number;
    userId?: {
      name: string;
      avatarUrl?: string;
    };
  };
  classId?: {
    className: string;
    section: string;
  };
  subjectMarks: {
    subjectName: string;
    maxMarks: number;
    obtainedMarks: number;
    grade: string;
  }[];
}

export interface NoticeItem {
  _id: string;
  title: string;
  body: string;
  category: 'academic' | 'holiday' | 'scheme_update' | 'event' | 'urgent';
  targetAudience: string[];
  isPinned: boolean;
  translations?: {
    ur?: { title: string; body: string };
    ks?: { title: string; body: string };
    hi?: { title: string; body: string };
  };
  createdAt: string;
  createdBy?: {
    name: string;
    role: string;
  };
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  noticesCount: number;
  todayAttendancePercentage: string;
  presentToday: number;
  absentToday: number;
  midDayMealServedCount: number;
  grants: {
    allocated: number;
    utilized: number;
    balance: number;
  };
}
