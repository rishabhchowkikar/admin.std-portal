// src/app/(auth)/layout.tsx
import AuthBrandPanel from "@/components/AuthBrandPanel";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            {/* Left: Form */}
            <div className="w-full md:w-1/3 flex items-center justify-center bg-white shadow-lg z-10 relative">
                {children}
            </div>
            {/* Right: Branded Panel */}
            <div className="hidden md:flex w-2/3 items-center justify-center bg-gradient-to-br from-blue-900 to-orange-300">
                <AuthBrandPanel />
            </div>
        </div>
    );
}
