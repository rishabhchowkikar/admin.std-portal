// src/app/lib/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // adjust the path to where your slice lives

// Add your reducers here
export const store = configureStore({
    reducer: {
        auth: authReducer,
        // add other reducers here
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
