'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/lib/hook';
import { restoreAuth, checkAuth } from '@/app/lib/authSlice';

export default function AuthInitializer() {
    const dispatch = useAppDispatch();
    const { isInitialized } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!isInitialized) {
            // First try to restore from localStorage
            dispatch(restoreAuth());

            // Then verify with the server
            dispatch(checkAuth());
        }
    }, [dispatch, isInitialized]);

    return null; // This component doesn't render anything
} 