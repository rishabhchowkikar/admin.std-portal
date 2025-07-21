// src/types/teacher.ts
export interface Teacher {
  _id: string;
  name: string;
  email: string;
  department: string;
  role: string;
}

export interface TeachersApiResponse {
  data: Teacher[];
  status: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
}
