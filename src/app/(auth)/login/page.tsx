'use client';

import LoginForm from '@/components/LoginForm';
import { useAppSelector } from '@/app/lib/hook';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LockKeyhole, User2 } from 'lucide-react';

export default function LoginPage() {
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

    // Only show login form if user is not authenticated
    if (!user) {
        return (
            <div className="min-h-screen flex flex-col justify-center">
                <LoginForm />
                <small className="flex flex-col justify-center items-center mx-6 p-4 bg-purple-100 rounded-xl text-sm">
                    <h5 className="text-base font-semibold text-gray-800 mb-2">
                        Dummy Admin Credentials
                    </h5>
                    <ul className="space-y-2">
                        <li className="flex items-center gap-3">
                            <User2 size={20} className="text-purple-600" />
                            <p className="font-mono text-black">admin@university.com</p>
                        </li>
                        <li className="flex items-center gap-3">
                            <LockKeyhole size={20} className="text-purple-600" />
                            <p className="font-mono text-black">Admin123</p>
                        </li>
                    </ul>
                </small>

            </div>

        );
    }

    return null;
}