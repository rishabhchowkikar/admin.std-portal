import { ExamForm, ExamFormsApiResponse, ExamApiError } from '@/types/exam';
import { apiInstance } from '@/lib/apiInstance';
import { AxiosError, isAxiosError } from 'axios';

export const fetchAllExamForms = async (): Promise<ExamForm[]> => {
  try {
    const response = await apiInstance.get<ExamFormsApiResponse>('/exam/admin/exam-forms');
    const result = response.data;

    if (!result.status) {
      throw new ExamApiError('API returned unsuccessful status');
    }

    return result.data;
  } catch (error) {
    if (error instanceof ExamApiError) {
      throw error;
    }
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response) {
        throw new ExamApiError(
          `HTTP Error: ${axiosError.response.status} ${axiosError.response.statusText}`,
          axiosError.response.status
        );
      } else if (axiosError.request) {
        throw new ExamApiError('Network error - no response from server');
      } else {
        throw new ExamApiError('Request configuration error');
      }
    }
    
    throw new ExamApiError(
      error instanceof Error ? error.message : 'Failed to fetch exam forms'
    );
  }
};

export const getExamFormsSummary = async (): Promise<{ data: ExamForm[]; summary: any }> => {
  try {
    const response = await apiInstance.get<ExamFormsApiResponse>('/exam/admin/exam-forms');
    const result = response.data;

    if (!result.status) {
      throw new ExamApiError('API returned unsuccessful status');
    }

    return {
      data: result.data,
      summary: result.summary
    };
  } catch (error) {
    if (error instanceof ExamApiError) {
      throw error;
    }
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response) {
        throw new ExamApiError(
          `HTTP Error: ${axiosError.response.status} ${axiosError.response.statusText}`,
          axiosError.response.status
        );
      } else if (axiosError.request) {
        throw new ExamApiError('Network error - no response from server');
      } else {
        throw new ExamApiError('Request configuration error');
      }
    }
    
    throw new ExamApiError(
      error instanceof Error ? error.message : 'Failed to fetch exam forms summary'
    );
  }
};

export const verifyExamForm = async (examFormId: string): Promise<any> => {
  try {
    const response = await apiInstance.put(`/exam/admin/verify-exam-form/${examFormId}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;
      throw new ExamApiError(
        (axiosError.response?.data as any)?.message as string || 'Failed to verify exam form',
        axiosError.response?.status
      );
    }
    throw new ExamApiError('Failed to verify exam form');
  }
};

export const generateHallTicket = async (examForm: { studentId: string; courseId: string; semester: number }): Promise<any> => {
  try {
    const response = await apiInstance.put(`/exam/admin/hall-tickets/enable-student`, {
      studentId: examForm.studentId,
      courseId: examForm.courseId,
      semester: examForm.semester
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;
      throw new ExamApiError(
        (axiosError.response?.data as any)?.message   as string || 'Failed to generate hall ticket',
        axiosError.response?.status
      );
    }
    throw new ExamApiError('Failed to generate hall ticket');
  }
};

export const getExamFormsByStatus = async (status: 'verified' | 'pending'): Promise<ExamForm[]> => {
  const allForms = await fetchAllExamForms();
  return allForms.filter(form => 
    status === 'verified' ? form.examRegistration.isVerified : !form.examRegistration.isVerified
  );
};

export const getExamFormsBySemester = async (semester: number): Promise<ExamForm[]> => {
  const allForms = await fetchAllExamForms();
  return allForms.filter(form => form.semester === semester);
};

export const getExamFormsByCourse = async (courseCode: string): Promise<ExamForm[]> => {
  const allForms = await fetchAllExamForms();
  return allForms.filter(form => 
    form.studentId.courseId.code.toLowerCase().includes(courseCode.toLowerCase())
  );
};

export const bulkVerifyExamForms = async (courseId: string, semester: number, currentSession: string): Promise<any> => {
  try {
    const response = await apiInstance.put('/exam/admin/verify-bulk', {
      courseId,
      semester: semester.toString(),
      currentSession
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;
      throw new ExamApiError(
        (axiosError.response?.data as any)?.message as string || 'Failed to bulk verify exam forms',
        axiosError.response?.status
      );
    }
    throw new ExamApiError('Failed to bulk verify exam forms');
  }
};

export const enableStudentHallTicket = async (studentId: string, courseId: string, semester: number): Promise<any> => {
  try {
    const response = await apiInstance.put('/exam/admin/hall-tickets/enable-student', {
      studentId,
      courseId,
      semester
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;
      throw new ExamApiError(
        (axiosError.response?.data as any).message as string || 'Failed to enable student hall ticket',
        axiosError.response?.status
      );
    }
    throw new ExamApiError('Failed to enable student hall ticket');
  }
};

export const bulkEnableHallTickets = async (courseId: string, semester: number): Promise<any> => {
  try {
    const response = await apiInstance.put('/exam/admin/hall-tickets/enable', {
      courseId,
      semester
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;
      throw new ExamApiError(
        (axiosError.response?.data as any)?.message as string || 'Failed to bulk enable hall tickets',
        axiosError.response?.status
      );
    }
    throw new ExamApiError('Failed to bulk enable hall tickets');
  }
};

export const holdStudentHallTicket = async (studentId: string): Promise<any> => {
  try {
    const response = await apiInstance.put(`/exam/admin/hall-tickets/hold/${studentId}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;
      throw new ExamApiError(
        (axiosError.response?.data as any)?.message as string || 'Failed to hold student hall ticket',
        axiosError.response?.status 
      );
    }
    throw new ExamApiError('Failed to hold student hall ticket');
  }
};

export const releaseStudentHallTicket = async (studentId: string, courseId: string, semester: number): Promise<any> => {
  try {
    const response = await apiInstance.put('/exam/admin/hall-tickets/enable-student', {
      studentId,
      courseId,
      semester
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError;
      throw new ExamApiError(
        (axiosError.response?.data as any)?.message as string || 'Failed to release student hall ticket',
        axiosError.response?.status
      );
    }
    throw new ExamApiError('Failed to release student hall ticket');
  }
};
