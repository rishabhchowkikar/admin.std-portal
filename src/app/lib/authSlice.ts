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

export type RoleOption = 'admin' | 'teacher';
type UserData = AdminData | TeacherData | null;

interface AuthState {
    user: UserData;
    loading: boolean;
    error: string | null;
    isInitialized: boolean;
}

// Helper function to get initial state from localStorage
const getInitialState = (): AuthState => {
    if (typeof window === 'undefined') {
        return {
            user: null,
            loading: true,
            error: null,
            isInitialized: false
        };
    }

    try {
        const persistedUser = localStorage.getItem('user');
        return {
            user: persistedUser ? JSON.parse(persistedUser) : null,
            loading: true,
            error: null,
            isInitialized: false
        };
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return {
            user: null,
            loading: true,
            error: null,
            isInitialized: false
        };
    }
};

// Initial state
const initialState: AuthState = getInitialState();

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

        // Validate response structure
        if (!response.data.data || !response.data.status) {
            throw new Error('Invalid response structure');
        }

        // Update localStorage with fresh data
        localStorage.setItem('user', JSON.stringify(response.data.data));
        return response.data;
    } catch (err: any) {
        // Clear localStorage on auth check failure
        localStorage.removeItem('user');
        return thunkAPI.rejectWithValue(
            err.response?.data?.message || 'Authentication failed'
        );
    }
});

// Async thunk for login
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

        // Validate response structure
        if (!res.data.data || !res.data.status) {
            throw new Error('Invalid response structure');
        }

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
            state.isInitialized = true;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
            }
        },
        clearError: (state) => {
            state.error = null;
        },
        restoreAuth: (state) => {
            const persistedState = getInitialState();
            state.user = persistedState.user;
            state.isInitialized = true;
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
            });
    },
});

// Type guard functions to check user role
export const isTeacher = (user: UserData): user is TeacherData => {
    return user?.role === 'teacher';
};

export const isAdmin = (user: UserData): user is AdminData => {
    return user?.role === 'admin';
};

export const { logout, clearError, restoreAuth } = authSlice.actions;
export default authSlice.reducer; 