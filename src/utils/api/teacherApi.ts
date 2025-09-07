// src/utils/api/teachersApi.ts
import { Teacher, TeachersApiResponse, ApiError } from '@/types/teacher';
import axios, { AxiosResponse, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export class TeachersApiError extends Error {
  status?: number;
  
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'TeachersApiError';
    this.status = status;
  }
}


export const fetchAllTeachers = async (): Promise<Teacher[]> => {
  try {
    const response: AxiosResponse<TeachersApiResponse> = await axios.get(
      `${API_BASE_URL}/academics/teachers`,
      {withCredentials: true}
    );

    const result = response.data;

    if (!result.status) {
      throw new TeachersApiError('API returned unsuccessful status');
    }

    return result.data;
  } catch (error) {
    if (error instanceof TeachersApiError) {
      throw error;
    }

    // Handle axios-specific errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response) {
        // Server responded with error status
        throw new TeachersApiError(
          `HTTP Error: ${axiosError.response.status} ${axiosError.response.statusText}`,
          axiosError.response.status
        );
      } else if (axiosError.request) {
        // Network error - request was made but no response received
        throw new TeachersApiError('Network error - no response from server');
      } else {
        // Request setup error
        throw new TeachersApiError('Request configuration error');
      }
    }
    
    // Handle other errors
    throw new TeachersApiError(
      error instanceof Error ? error.message : 'Failed to fetch teachers'
    );
  }
};

/**
 * Get teacher count (utility function)
 * @returns Promise<number> - Total number of teachers
 */
export const getTeachersCount = async (): Promise<number> => {
  const teachers = await fetchAllTeachers();
  return teachers.length;
};

/**
 * Filter teachers by department
 * @param department - Department name to filter by
 * @returns Promise<Teacher[]> - Filtered teachers array
 */
export const getTeachersByDepartment = async (department: string): Promise<Teacher[]> => {
  const teachers = await fetchAllTeachers();
  return teachers.filter(teacher => 
    teacher.department.toLowerCase().includes(department.toLowerCase())
  );
};

/**
 * Filter teachers by role
 * @param role - Role to filter by (e.g., "Professor", "Assistant Professor")
 * @returns Promise<Teacher[]> - Filtered teachers array
 */
export const getTeachersByRole = async (role: string): Promise<Teacher[]> => {
  const teachers = await fetchAllTeachers();
  return teachers.filter(teacher => 
    teacher.role.toLowerCase().includes(role.toLowerCase())
  );
};


// src/utils/api/teacherApi.ts
// ... existing code ...

export interface TeacherProfile {
  basicInfo: {
    _id: string;
    name: string;
    email: string;
    department: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  assignedCourse: {
    _id: string;
    name: string;
    code: string;
    department: string;
    school: string;
    duration: number;
    totalSemesters: number;
  };
  teachingStats: {
    totalSubjects: number;
    semestersTeaching: number;
    coursesInvolved: number;
  };
  subjectsBySemester: {
    [key: string]: {
      _id: string;
      name: string;
      code: string;
      course: {
        _id: string;
        name: string;
        code: string;
        department: string;
      };
    }[];
  };
  semesterDetails: Array<{
    semester: number;
    courseName: string;
    courseCode: string;
    subjects: Array<{
      _id: string;
      name: string;
      code: string;
      course: {
        _id: string;
        name: string;
        code: string;
        department: string;
      };
    }>;
    timetablePeriods: Array<{
      day: string;
      time: string;
      subject: {
        name: string;
        code: string;
      };
    }>;
    totalPeriods: number;
  }>;
  allSubjects: Array<{
    _id: string;
    name: string;
    code: string;
    semester: number;
    course: {
      _id: string;
      name: string;
      code: string;
      department: string;
    };
  }>;
  viewMode: string;
}

export const fetchTeacherProfile = async (teacherId: string): Promise<TeacherProfile> => {
  try {
    const response = await fetch(`${API_BASE_URL}/teacher/profile/${teacherId}`,{credentials: 'include'});
    const data = await response.json();

    if (!response.ok) {
      throw new TeachersApiError(data.message || 'Failed to fetch teacher profile');
    }

    return data.data;
  } catch (error) {
    if (error instanceof TeachersApiError) {
      throw error;
    }
    throw new TeachersApiError('Failed to fetch teacher profile');
  }
};