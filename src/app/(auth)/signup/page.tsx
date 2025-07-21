'use client';

import TeacherSignupForm from '@/components/TeacherSignupForm';
import { useAppSelector } from '@/app/lib/hook';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignupPage() {
    const router = useRouter();
    const { user, isInitialized } = useAppSelector((state) => state.auth);

    useEffect(() => {
        // If user is already authenticated, redirect to dashboard
        if (isInitialized && user) {
            router.push('/dashboard');
        }
    }, [user, isInitialized, router]);

    // Show loading state while checking auth
    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <div className="animate-spin h-5 w-5 border-2 border-purple-600 border-t-transparent rounded-full" />
                    <span className="text-gray-600">Loading...</span>
                </div>
            </div>
        );
    }

    // Only show signup form if user is not authenticated
    if (!user) {
        return (
            <div className="min-h-screen flex flex-col justify-center">
                <TeacherSignupForm />
            </div>
        );
    }

    return null; // This will never render as we redirect authenticated users
}