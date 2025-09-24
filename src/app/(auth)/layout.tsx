// src/app/(auth)/layout.tsx
import AuthBrandPanel from '@/components/AuthBrandPanel';
import Image from 'next/image';


export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="relative min-h-screen flex">
            {/* Left Panel - Login Form */}
            <div className="relative w-full md:w-2/5 lg:w-[35%] min-h-screen bg-white flex items-center justify-center p-8 overflow-y-auto">
                <div className="absolute top-6 left-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8">
                            <Image src={`/Central_University_of_Haryana_logo.png`} alt="CUH logo" width={500} height={500} />
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
