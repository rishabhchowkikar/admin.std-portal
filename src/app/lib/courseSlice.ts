import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Types for course data
interface Teacher {
    _id: string;
    name: string;
    email: string;
}

interface CreatedBy {
    _id: string;
    email: string;
}

interface Course {
    _id: string;
    createdAt: string;
    duration: number;
    name: string;
    code: string;
    createdBy: CreatedBy;
    department: string;
    description: string;
    isActive: boolean;
    school: string;
    updatedAt: string;
    assignedTeachers: Teacher[];
    totalSemesters: number;
    __v: number;
}

interface CourseResponse {
    status: boolean;
    data: Course[];
}

interface CourseState {
    courses: Course[];
    loading: boolean;
    error: string | null;
    lastFetched: string | null;
}

// Initial state
const initialState: CourseState = {
    courses: [],
    loading: false,
    error: null,
    lastFetched: null
};

// Async thunk for fetching courses
export const fetchCourses = createAsyncThunk<
    CourseResponse,
    void,
    { rejectValue: string }
>('courses/fetchCourses', async (_, thunkAPI) => {
    try {
        const response = await axios.get<CourseResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/course`,
            { withCredentials: true }
        );

        if (!response.data.status || !response.data.data) {
            throw new Error('Invalid response structure');
        }

        return response.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(
            err.response?.data?.message || 'Failed to fetch courses'
        );
    }
});

// Course slice
const courseSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetCourses: (state) => {
            state.courses = [];
            state.error = null;
            state.lastFetched = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload.data;
                state.error = null;
                state.lastFetched = new Date().toISOString();
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, resetCourses } = courseSlice.actions;
export default courseSlice.reducer;
