import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface Teacher {
    _id: string;
    name: string;
    email: string;
    department: string;
}

export interface Subject {
    _id: string;
    code: string;
    name: string;
    courseId: string;
    semester: number;
    teacherId: Teacher;
    __v: number;
}

export interface Period {
    _id?: string;
    time: string;
    subjectId: Subject;
}

export interface DaySchedule {
    _id?: string;
    day: string;
    periods: Period[];
}

export interface Timetable {
    _id: string;
    courseId: {
        _id: string;
        name: string;
        code: string;
        department: string;
    };
    semester: number;
    schedule: DaySchedule[];
    __v: number;
}

export interface CourseTimetablesResponse {
    data: Timetable[];
    timetablesBySemester: Record<string, Timetable[]>;
    status: boolean;
    count: number;
    courseId: string;
    message: string;
}

export const getCourseTimetables = async (courseId: string): Promise<CourseTimetablesResponse> => {
    try {
        const response = await axios.get<CourseTimetablesResponse>(
            `${API_BASE_URL}/academics/timetable/course/${courseId}`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch course timetables');
    }
}; 