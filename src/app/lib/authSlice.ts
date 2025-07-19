// src/lib/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

type AdminData = {
    _id: string;
    email: string;
    role: "admin";
    createdAt: string;
    __v: number;
};

type TeacherData = {
    _id: string;
    name: string;
    email: string;
    department: string;
    role: "teacher";
    createdAt: string;
    updatedAt: string;
    __v: number;
};

export type RoleOption = "admin" | "teacher";
type UserData = AdminData | TeacherData | null;

interface AuthState {
    user: UserData;
    loading: boolean;
    error: string | null;
}
const initialState: AuthState = { user: null, loading: false, error: null };

export const loginUser = createAsyncThunk<
    // Return type of payload
    { data: AdminData | TeacherData },
    // First param for payload creator
    { email: string; password: string; role: RoleOption },
    // thunkAPI config
    { rejectValue: string }
>("auth/loginUser", async (values, thunkAPI) => {
    const url =
        values.role === "admin"
            ? "https://student-manage-api-uid4.onrender.com/api/auth/admin/login"
            : "https://student-manage-api-uid4.onrender.com/api/auth/teacher/login";
    try {
        const res = await axios.post(url, {
            email: values.email,
            password: values.password,
        });
        return res.data;
    } catch (err: any) {
        return thunkAPI.rejectWithValue(
            err.response?.data?.message || "Login failed"
        );
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: state => {
            state.user = null;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(loginUser.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ data: UserData }>) => {
                state.loading = false;
                state.user = action.payload.data;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
