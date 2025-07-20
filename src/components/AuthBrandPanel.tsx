// src/components/AuthBrandPanel.tsx
import React from 'react';
import Image from 'next/image';

export default function AuthBrandPanel() {
    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-700 opacity-90" />

            {/* Floating Shapes */}
            <div className="absolute inset-0">
                <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-20 left-20 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative max-w-xl px-12 py-16 text-white text-center">
                <div className="mb-8">
                    <h1 className="text-5xl font-bold mb-4 leading-tight">
                        Welcome to CUH
                        <span className="block text-4xl mt-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-100">
                            Student Portal
                        </span>
                    </h1>
                    <p className="text-xl mb-8 text-purple-100 leading-relaxed">
                        Empowering education through digital excellence at Central University of Haryana
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 mb-12">
                    <div className="p-4 rounded-xl bg-white/10 backdrop-blur-lg">
                        <div className="text-3xl font-bold">15K+</div>
                        <div className="text-sm text-purple-200">Students</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/10 backdrop-blur-lg">
                        <div className="text-3xl font-bold">500+</div>
                        <div className="text-sm text-purple-200">Faculty</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/10 backdrop-blur-lg">
                        <div className="text-3xl font-bold">50+</div>
                        <div className="text-sm text-purple-200">Programs</div>
                    </div>
                </div>

                {/* Features */}
                <div className="space-y-4 text-left">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/10">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span>Seamless Academic Management</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/10">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.625 2.655A9 9 0 0119 11a1 1 0 11-2 0 7 7 0 00-9.625-6.492 1 1 0 11-.75-1.853zM4.662 4.959A1 1 0 014.75 6.37 6.97 6.97 0 003 11a1 1 0 11-2 0 8.97 8.97 0 012.25-5.953 1 1 0 011.412-.088z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M5 11a5 5 0 1110 0 1 1 0 11-2 0 3 3 0 10-6 0c0 1.677-.345 3.276-.968 4.729a1 1 0 11-1.838-.789A9.964 9.964 0 005 11zm8.921 2.012a1 1 0 01.831 1.145 19.86 19.86 0 01-.545 2.436 1 1 0 11-1.92-.558c.207-.713.371-1.445.49-2.192a1 1 0 011.144-.831z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span>Real-time Updates & Notifications</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/10">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span>Secure & Reliable Platform</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
