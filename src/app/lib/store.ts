import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import dashboardReducer from './dashboardSlice';
import courseReducer from './courseSlice';
import financeReducer from './financeSlice';
import examReducer from './examSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        dashboard: dashboardReducer,
        courses: courseReducer,
        finance: financeReducer,
        exam: examReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 