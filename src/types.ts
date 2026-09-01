export type AttendanceStatus = 'on-track' | 'warning' | 'critical';

export interface ClassLog {
  id: string;
  date: string;
  topic: string;
  status: 'present' | 'absent' | 'excused';
}

export interface SubjectAttendance {
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  professor: string;
  credits: number;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  minimumRequired: number; // usually 75
  status: AttendanceStatus;
  schedule: string; // e.g. "Mon, Wed 10:00 AM"
  room: string;
  recentLogs: ClassLog[];
}

export interface MonthlyAttendanceData {
  month: string;
  attendancePercentage: number;
  attended: number;
  total: number;
}

export interface SubjectGrade {
  code: string;
  name: string;
  credits: number;
  internalMarks: number; // e.g. 28/30
  internalMax: number;
  externalMarks: number; // e.g. 62/70
  externalMax: number;
  totalMarks: number; // e.g. 90/100
  gradeLetter: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'P' | 'F';
  gradePoint: number; // 10, 9, 8, 7, 6, 5, 4, 0
}

export interface SemesterRecord {
  semesterNumber: number;
  semesterName: string;
  academicYear: string;
  sgpa: number;
  creditsEarned: number;
  totalCredits: number;
  subjects: SubjectGrade[];
}

export type AchievementCategory = 'certificate' | 'award' | 'hackathon' | 'extracurricular' | 'sports' | 'publication' | 'club';

export interface Achievement {
  id: string;
  title: string;
  category: AchievementCategory;
  issuedBy: string;
  issueDate: string;
  credentialId?: string;
  description: string;
  verificationStatus: 'verified' | 'pending';
  badgeIcon: string; // icon identifier
  tier: 'Diamond' | 'Gold' | 'Silver' | 'Bronze' | 'Special';
  skills: string[];
}

export type EventType = 'exam' | 'assignment' | 'event' | 'workshop' | 'holiday';
export type PriorityLevel = 'urgent' | 'medium' | 'low';

export interface EventDeadline {
  id: string;
  title: string;
  type: EventType;
  subjectCode?: string;
  subjectName?: string;
  dueDate: string; // ISO or YYYY-MM-DD
  dueTime: string;
  locationOrPlatform: string;
  description: string;
  priority: PriorityLevel;
  status: 'pending' | 'submitted' | 'completed';
  weightage?: string; // e.g. "15% of Final Grade"
  isPersonalReminder?: boolean;
}

export type AnnouncementCategory = 'urgent' | 'exam' | 'academic' | 'placement' | 'general' | 'club';

export interface FacultyAnnouncement {
  id: string;
  title: string;
  senderName: string;
  senderRole: string;
  senderAvatar: string;
  department: string;
  timestamp: string;
  content: string;
  category: AnnouncementCategory;
  isRead: boolean;
  isPinned: boolean;
  tags: string[];
  attachmentName?: string;
  attachmentSize?: string;
}

export interface StudentProfile {
  id: string;
  rollNumber: string;
  prnNumber: string;
  fullName: string;
  avatar: string;
  course: string;
  department: string;
  degree: string;
  year: string;
  semester: number;
  batch: string;
  collegeEmail: string;
  personalEmail: string;
  phone: string;
  dob: string;
  bloodGroup: string;
  mentorName: string;
  mentorEmail: string;
  address: string;
  cgpa: number;
  totalCreditsEarned: number;
  overallAttendance: number;
  rankInBatch: number;
  totalStudentsInBatch: number;
}

export interface PrivacySettings {
  hideGpaInHeader: boolean;
  maskRollNumber: boolean;
  enableSoundEffects: boolean;
  emailAlerts: boolean;
}
