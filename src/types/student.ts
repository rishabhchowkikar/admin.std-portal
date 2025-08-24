// src/types/student.ts
export interface Student {
  _id: string;
  name: string;
  email: string;
  rollno: number;
  isPwd: boolean;
  courseId: {
    _id: string;
    duration: number;
    name: string;
    code: string;
    department: string;
  };
  want_to_apply_for_hostel: boolean;
  hostel_allocated: boolean;
  updatePermissionStatus: "none" | "requested" | "approved" | "rejected";
  updatePermissionReason?: string;
  changesSummary?: string;
  createdAt: string;
  updatedAt: string;
  aadharNumber?: string;
  address?: string;
  altPhone?: string;
  bloodGroup?: string;
  category?: string;
  dob?: string;
  fatherName?: string;
  gender?: string;
  motherName?: string;
  nationality?: string;
  phone?: string;
  photo?: string;
  updatePermissionRequestDate?: string;
}

export interface StudentsApiResponse {
  data: Student[];
  status: boolean;
  count: number;
  message: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
