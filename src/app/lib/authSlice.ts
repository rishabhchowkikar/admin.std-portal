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

// API Response types
interface AuthResponse {
    data: AdminData | TeacherData;
    status: boolean;
    message: string;
}

interface LogoutResponse {
    message: string;
    status: boolean;
}

export type RoleOption = 'admin' | 'teacher';
type UserData = AdminData | TeacherData | null;

interface AuthState {
    user: UserData;
    loading: boolean;
    error: string | null;
    isInitialized: boolean;
}

// Initial state
const initialState: AuthState = {
    user: null,
    loading: true,
    error: null,
    isInitialized: false
};

// Check auth status thunk
export const checkAuth = createAsyncThunk<
    AuthResponse,
    void,
    { rejectValue: string }
>('auth/checkAuth', async (_, thunkAPI) => {
    try {
        const response = await axios.get<AuthResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/check-auth`,
            { withCredentials: true }
        );

        if (!response.data.data || !response.data.status) {
            throw new Error('Invalid response structure');
        }

        return response.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(
            err.response?.data?.message || 'Authentication failed'
        );
    }
});

// Login thunk
export const loginUser = createAsyncThunk<
    AuthResponse,
    { email: string; password: string; role: RoleOption },
    { rejectValue: string }
>('auth/loginUser', async (values, thunkAPI) => {
    const url = values.role === 'admin'
        ? `${process.env.NEXT_PUBLIC_API_URL}/auth/admin/login`
        : `${process.env.NEXT_PUBLIC_API_URL}/auth/teacher/login`;

    try {
        const res = await axios.post<AuthResponse>(url, {
            email: values.email,
            password: values.password,
        }, { withCredentials: true });

        if (!res.data.data || !res.data.status) {
            throw new Error('Invalid response structure');
        }

        return res.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(
            err.response?.data?.message || 'Login failed'
        );
    }
});

// Logout thunk
export const logoutUser = createAsyncThunk<
    LogoutResponse,
    void,
    { rejectValue: string }
>('auth/logoutUser', async (_, thunkAPI) => {
    try {
        const response = await axios.post<LogoutResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
            {},
            { withCredentials: true }
        );

        return response.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(
            err.response?.data?.message || 'Logout failed'
        );
    }
});

// Auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Check Auth cases
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.data;
                state.error = null;
                state.isInitialized = true;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.error = action.payload as string;
                state.isInitialized = true;
            })
            // Login cases
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.data;
                state.error = null;
                state.isInitialized = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.user = null;
            })
            // Logout cases
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.error = null;
                state.isInitialized = true;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.error = action.payload as string;
                state.isInitialized = true;
            });
    },
});

// Type guard functions
export const isTeacher = (user: UserData): user is TeacherData => {
    return user?.role === 'teacher';
};

export const isAdmin = (user: UserData): user is AdminData => {
    return user?.role === 'admin';
};

export const { clearError } = authSlice.actions;
export default authSlice.reducer; 