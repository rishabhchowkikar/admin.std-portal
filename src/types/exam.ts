export interface Subject {
  _id: string;
  subjectId: {
    _id: string;
    code: string;
    name: string;
  };
  earlierMarks: number;
}

export interface Course {
  _id: string;
  name: string;
  code: string;
  department: string;
  school: string;
}

export interface Student {
  _id: string;
  name: string;
  email: string;
  courseId: Course;
  rollno: number;
}

export interface ExamRegistration {
  isAllowed: boolean;
  isSubmitted: boolean;
  registrationDate: string;
  isVerified: boolean;
  hallTicketAvailable: boolean;
  hallTicketEnabled?: boolean;
  hallTicketHeld?: boolean;
}

export interface ExamForm {
  _id: string;
  studentId: Student;
  semester: number;
  currentSession: string;
  type: string;
  month: string;
  subjects: Subject[];
  examRegistration: ExamRegistration;
  __v: number;
}

export interface ExamSummary {
  total: number;
  verified: number;
  pending: number;
  hallTicketAvailable: number;
}

export interface ExamFormsApiResponse {
  data: ExamForm[];
  summary: ExamSummary;
  status: boolean;
  message: string;
}

export class ExamApiError extends Error {
  status?: number;
  
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ExamApiError';
    this.status = status;
  }
}
