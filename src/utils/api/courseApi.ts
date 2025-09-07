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

export interface AssignTeachersRequest {
    courseId: string;
    teacherIds: string[];
}

export interface AssignTeachersResponse {
    message: string;
    status: boolean;
    data: any;
}

export interface CourseData {
    _id: string;
    name: string;
    code: string;
    department: string;
    assignedTeachers: CourseTeacher[];
    duration: number;
    totalSemesters: number;
    isActive: boolean;
    school: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface CourseResponse {
    data: CourseData[];
    status: boolean;
}


// New interfaces for subjects
export interface Subject {
    _id: string;
    code: string;
    name: string;
    courseId: {
        _id: string;
        name: string;
        code: string;
    };
    semester: number;
    teacherId?: {
        _id: string;
        name: string;
        email: string;
        department: string;
        role: string;
    };
}


export interface SubjectsResponse {
    message: string;
    status: boolean;
    data: Subject[];
    subjectsBySemester: Record<string, Subject[]>;
    stats: {
        totalSubjects: number;
        totalSemesters: number;
        assignedTeachers: number;
    };
    count: number;
    courseId: string;
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

// New function to get course data with assigned teachers
export const getCourseData = async (courseId: string): Promise<CourseResponse> => {
    try {
        const response = await axios.get<CourseResponse>(
            `${API_BASE_URL}/course?id=${courseId}`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch course data');
    }
};

// New function to get subjects for a course
export const getCourseSubjects = async (courseId: string): Promise<SubjectsResponse> => {
    try {
        const response = await axios.get<SubjectsResponse>(
            `${API_BASE_URL}/academics/courses/${courseId}/subjects`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch course subjects');
    }
};


export const assignTeachersToCourse = async (data: AssignTeachersRequest): Promise<AssignTeachersResponse> => {
    try {
        const response = await axios.put<AssignTeachersResponse>(
            `${API_BASE_URL}/course/assign-teachers`,
            data,
            { withCredentials: true }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to assign teachers to course');
    }
};

