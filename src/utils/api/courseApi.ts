import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface CourseTeacher {
    _id: string;
    name: string;
    email: string;
    department: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    courseId: {
        _id: string;
        name: string;
        code: string;
        department: string;
    };
}

export interface CourseTeachersResponse {
    message: string;
    status: boolean;
    data: CourseTeacher[];
    count: number;
}

export const getCourseTeachers = async (courseId: string): Promise<CourseTeachersResponse> => {
    try {
        const response = await axios.get<CourseTeachersResponse>(
            `${API_BASE_URL}/teacher/course-teachers/${courseId}`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch course teachers');
    }
}; 