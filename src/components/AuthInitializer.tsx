'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/app/lib/hook';
import { restoreAuth } from '@/app/lib/authSlice';

export default function AuthInitializer() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        // Restore auth state from localStorage on app initialization
        dispatch(restoreAuth());
    }, [dispatch]);

    return null; // This component doesn't render anything
} 