// src/app/(auth)/layout.tsx
import AuthBrandPanel from '@/components/AuthBrandPanel';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="relative min-h-screen flex">
            {/* Left Panel - Login Form */}
            <div className="relative w-full md:w-2/5 lg:w-[35%] min-h-screen bg-white flex items-center justify-center p-8 overflow-y-auto">
                <div className="absolute top-6 left-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-xl font-semibold">CUH Portal</span>
                    </div>
                </div>

                <div className="w-full max-w-md space-y-8 px-4">
                    {children}
                </div>

            </div>

            {/* Right Panel - Branding */}
            <div className="hidden md:block md:w-3/5 lg:w-[65%] min-h-screen">
                <AuthBrandPanel />
            </div>
        </main>
    );
}
