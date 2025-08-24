
// import { Student, StudentsApiResponse, ApiError } from '@/types/student';
// import axios, { AxiosResponse, AxiosError } from 'axios';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// export class StudentsApiError extends Error {
//   status?: number;
  
//   constructor(message: string, status?: number) {
//     super(message);
//     this.name = 'StudentsApiError';
//     this.status = status;
//   }
// }


// export const fetchAllStudents = async (): Promise<Student[]> => {
//   try {
//     const response: AxiosResponse<StudentsApiResponse> = await axios.get(
//       `${API_BASE_URL}/academics/getallstudents`,
//      {withCredentials: true}
//     );
//     const result = response.data;

//     if (!result.status) {
//       throw new StudentsApiError('API returned unsuccessful status');
//     }

//     return result.data;
//   } catch (error) {
//     if (error instanceof StudentsApiError) {
//       throw error;
//     }
//     if (axios.isAxiosError(error)) {
//       const axiosError = error as AxiosError;
      
//       if (axiosError.response) {
//         throw new StudentsApiError(
//           `HTTP Error: ${axiosError.response.status} ${axiosError.response.statusText}`,
//           axiosError.response.status
//         );
//       } else if (axiosError.request) {
//         throw new StudentsApiError('Network error - no response from server');
//       } else {
//         throw new StudentsApiError('Request configuration error');
//       }
//     }
    
//     // Handle other errors
//     throw new StudentsApiError(
//       error instanceof Error ? error.message : 'Failed to fetch students'
//     );
//   }
// };


// export const getStudentsCount = async (): Promise<number> => {
//   const students = await fetchAllStudents();
//   return students.length;
// };

// export const getStudentsByCourse = async (courseName: string): Promise<Student[]> => {
//   const students = await fetchAllStudents();
//   return students.filter(student => 
//     student.courseId.name.toLowerCase().includes(courseName.toLowerCase())
//   );
// };


// export const getStudentsByHostelStatus = async (allocated: boolean): Promise<Student[]> => {
//   const students = await fetchAllStudents();
//   return students.filter(student => student.hostel_allocated === allocated);
// };


// export const getStudentsByCategory = async (category: string): Promise<Student[]> => {
//   const students = await fetchAllStudents();
//   return students.filter(student => 
//     student.category?.toLowerCase() === category.toLowerCase()
//   );
// };


// export const getStudentsByDepartment = async (department: string): Promise<Student[]> => {
//   const students = await fetchAllStudents();
//   return students.filter(student => 
//     student.courseId.department.toLowerCase().includes(department.toLowerCase())
//   );
// };


import { Student, StudentsApiResponse, ApiError } from '@/types/student';
import axios, { AxiosResponse, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export class StudentsApiError extends Error {
  status?: number;
  
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'StudentsApiError';
    this.status = status;
  }
}

export const fetchAllStudents = async (): Promise<Student[]> => {
  try {
    const response: AxiosResponse<StudentsApiResponse> = await axios.get(
      `${API_BASE_URL}/academics/getallstudents`,
     {withCredentials: true}
    );
    const result = response.data;

    if (!result.status) {
      throw new StudentsApiError('API returned unsuccessful status');
    }

    return result.data;
  } catch (error) {
    if (error instanceof StudentsApiError) {
      throw error;
    }
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response) {
        throw new StudentsApiError(
          `HTTP Error: ${axiosError.response.status} ${axiosError.response.statusText}`,
          axiosError.response.status
        );
      } else if (axiosError.request) {
        throw new StudentsApiError('Network error - no response from server');
      } else {
        throw new StudentsApiError('Request configuration error');
      }
    }
    
    throw new StudentsApiError(
      error instanceof Error ? error.message : 'Failed to fetch students'
    );
  }
};

// NEW - Approve update permission
export const approveUpdatePermission = async (studentId: string, adminComments?: string): Promise<any> => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/auth/approve-update-permission/${studentId}`,
      { adminComments },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new StudentsApiError(
        error.response?.data?.message || 'Failed to approve permission',
        error.response?.status
      );
    }
    throw new StudentsApiError('Failed to approve permission');
  }
};

// NEW - Reject update permission
export const rejectUpdatePermission = async (studentId: string, adminComments: string): Promise<any> => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/auth/reject-update-permission/${studentId}`,
      { adminComments },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new StudentsApiError(
        error.response?.data?.message || 'Failed to reject permission',
        error.response?.status
      );
    }
    throw new StudentsApiError('Failed to reject permission');
  }
};

// NEW - Get all update requests
export const getAllUpdateRequests = async (): Promise<any[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/auth/all-update-requests`,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new StudentsApiError(
        error.response?.data?.message || 'Failed to fetch update requests',
        error.response?.status
      );
    }
    throw new StudentsApiError('Failed to fetch update requests');
  }
};

export const getStudentsCount = async (): Promise<number> => {
  const students = await fetchAllStudents();
  return students.length;
};

export const getStudentsByCourse = async (courseName: string): Promise<Student[]> => {
  const students = await fetchAllStudents();
  return students.filter(student => 
    student.courseId.name.toLowerCase().includes(courseName.toLowerCase())
  );
};

export const getStudentsByHostelStatus = async (allocated: boolean): Promise<Student[]> => {
  const students = await fetchAllStudents();
  return students.filter(student => student.hostel_allocated === allocated);
};

export const getStudentsByCategory = async (category: string): Promise<Student[]> => {
  const students = await fetchAllStudents();
  return students.filter(student => 
    student.category?.toLowerCase() === category.toLowerCase()
  );
};

export const getStudentsByDepartment = async (department: string): Promise<Student[]> => {
  const students = await fetchAllStudents();
  return students.filter(student => 
    student.courseId.department.toLowerCase().includes(department.toLowerCase())
  );
};
