import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Types
type AdminData = {
    _id: string;
    email: string;
    role: 'admin';
    createdAt: string;
    __v: number;
};

type TeacherData = {
    _id: string;
    name: string;
    email: string;
    department: string;
    role: 'teacher';
    createdAt: string;
    updatedAt: string;
    __v: number;
};

export type RoleOption = 'admin' | 'teacher';
type UserData = AdminData | TeacherData | null;

interface AuthState {
    user: UserData;
    loading: boolean;
    error: string | null;
}

// Teacher signup payload type
export interface TeacherSignupData {
    name: string;
    email: string;
    password: string;
    department: string;
    role: string;
}

// Helper function to get initial state from localStorage
const getInitialState = (): AuthState => {
    if (typeof window === 'undefined') {
        return {
            user: null,
            loading: false,
            error: null,
        };
    }

    try {
        const persistedUser = localStorage.getItem('user');
        return {
            user: persistedUser ? JSON.parse(persistedUser) : null,
            loading: false,
            error: null,
        };
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return {
            user: null,
            loading: false,
            error: null,
        };
    }
};

// Initial state
const initialState: AuthState = getInitialState();

// Async thunk for teacher signup
export const signupTeacher = createAsyncThunk<
    { data: TeacherData },
    TeacherSignupData,
    { rejectValue: string }
>('auth/signupTeacher', async (values, thunkAPI) => {
    try {
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/teacher/sign-up`,
            values
        );
        return res.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(
            err.response?.data?.message || 'Registration failed'
        );
    }
});

// Async thunk for login
export const loginUser = createAsyncThunk<
    { data: AdminData | TeacherData },
    { email: string; password: string; role: RoleOption },
    { rejectValue: string }
>('auth/loginUser', async (values, thunkAPI) => {
    const url = values.role === 'admin'
        ? `${process.env.NEXT_PUBLIC_API_URL}/auth/admin/login`
        : `${process.env.NEXT_PUBLIC_API_URL}/auth/teacher/login`;

    try {
        const res = await axios.post(url, {
            email: values.email,
            password: values.password,
        });
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(res.data.data));
        return res.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(
            err.response?.data?.message || 'Login failed'
        );
    }
});

// Auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.error = null;
            // Clear localStorage on logout
            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
            }
        },
        clearError: (state) => {
            state.error = null;
        },
        // Add a reducer to restore auth state
        restoreAuth: (state) => {
            const persistedState = getInitialState();
            state.user = persistedState.user;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ data: UserData }>) => {
                state.loading = false;
                state.user = action.payload.data;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Signup cases
            .addCase(signupTeacher.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupTeacher.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(signupTeacher.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout, clearError, restoreAuth } = authSlice.actions;
export default authSlice.reducer; 