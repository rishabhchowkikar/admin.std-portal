import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Types for the dashboard data
interface Student {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
    rollno: number;
}

interface Payment {
    _id: string;
    studentId: {
        _id: string;
        name: string;
        rollno: number;
    };
    paymentMethod: string;
    finalAmount: number;
    paidDate: string;
}

interface HostelApplication {
    _id: string;
    userId: {
        _id: string;
        name: string;
        rollno: number;
    };
    roomType: string;
    roomNumber: string;
    floor: string;
    hostelName: string;
    allocated: boolean;
    academicYear: string;
    paymentStatus: string;
    paymentAmount: number;
    razorpayOrderId: string;
    adminNotified: boolean;
    createdAt: string;
    updatedAt: string;
    paymentDate?: string;
    razorpayPaymentId?: string;
}

interface DepartmentStat {
    _id: string;
    studentCount: number;
    courses: {
        name: string;
        count: number;
    }[];
}

interface QuickLink {
    title: string;
    path: string;
}

interface DashboardData {
    overview: {
        totalStudents: number;
        totalTeachers: number;
        totalDepartments: number;
        totalCourses: number;
    };
    pendingActions: {
        hostelRequests: number;
        busPassRequests: number;
        profileUpdates: number;
        total: number;
    };
    todayStats: {
        feeCollection: number;
        feeTransactions: number;
    };
    recentActivities: {
        newStudents: Student[];
        recentPayments: Payment[];
        hostelApplications: HostelApplication[];
    };
    departmentStats: DepartmentStat[];
    quickLinks: QuickLink[];
}

interface DashboardResponse {
    status: boolean;
    message: string;
    data: DashboardData;
}

interface DashboardState {
    data: DashboardData | null;
    loading: boolean;
    error: string | null;
    lastFetched: string | null;
}

// Initial state
const initialState: DashboardState = {
    data: null,
    loading: false,
    error: null,
    lastFetched: null
};

// Async thunk for fetching dashboard data
export const fetchDashboardStats = createAsyncThunk<
    DashboardResponse,
    void,
    { rejectValue: string }
>('dashboard/fetchStats', async (_, thunkAPI) => {
    try {
        const response = await axios.get<DashboardResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/dashboard/admin/stats`,
            { withCredentials: true }
        );

        if (!response.data.status || !response.data.data) {
            throw new Error('Invalid response structure');
        }

        return response.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(
            err.response?.data?.message || 'Failed to fetch dashboard stats'
        );
    }
});

// Dashboard slice
const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetDashboard: (state) => {
            state.data = null;
            state.error = null;
            state.lastFetched = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
                state.error = null;
                state.lastFetched = new Date().toISOString();
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;