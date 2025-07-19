// src/components/AuthBrandPanel.tsx
export default function AuthBrandPanel() {
    return (
        <div className="text-white text-center px-12 max-w-xl">
            <h2 className="text-4xl font-extrabold mb-4 drop-shadow-lg">
                CUH Student Management System
            </h2>
            <p className="text-lg mb-8">
                Streamline your campus admin and academics with our comprehensive digital platform.
            </p>
            <div className="flex gap-8 justify-center text-2xl font-semibold mb-4">
                <div>
                    <div>10,000+</div>
                    <div className="text-sm font-normal">STUDENT RECORDS</div>
                </div>
                <div>
                    <div>99.9%</div>
                    <div className="text-sm font-normal">UPTIME</div>
                </div>
            </div>
            <span className="text-md opacity-70">
                Secure. Reliable. University Approved.
            </span>
        </div>
    );
}
