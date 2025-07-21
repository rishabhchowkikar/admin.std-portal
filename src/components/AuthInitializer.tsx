'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/app/lib/hook';
import { checkAuth } from '@/app/lib/authSlice';

export default function AuthInitializer() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        // Check auth status on mount and after any window focus
        const checkAuthStatus = () => {
            dispatch(checkAuth());
        };

        // Initial check
        checkAuthStatus();

        // Re-check auth when window gains focus
        window.addEventListener('focus', checkAuthStatus);

        return () => {
            window.removeEventListener('focus', checkAuthStatus);
        };
    }, [dispatch]);

    return null;
} 