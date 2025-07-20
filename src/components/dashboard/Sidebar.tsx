'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@/app/lib/hook';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    Calendar,
    FileText,
    Settings,
    LogOut,
    ChevronLeft,
    Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/app/lib/hook';
import { logout } from '@/app/lib/authSlice';
import { useRouter } from 'next/navigation';

// Navigation items configuration
const teacherNavItems = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard
    },
    {
        title: 'Students',
        href: '/dashboard/students',
        icon: Users
    },
    {
        title: 'Classes',
        href: '/dashboard/classes',
        icon: GraduationCap
    },
    {
        title: 'Schedule',
        href: '/dashboard/schedule',
        icon: Calendar
    },
    {
        title: 'Reports',
        href: '/dashboard/reports',
        icon: FileText
    },
    {
        title: 'Settings',
        href: '/dashboard/settings',
        icon: Settings
    }
];

const adminNavItems = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard
    },
    {
        title: 'Teachers',
        href: '/dashboard/teachers',
        icon: GraduationCap
    },
    {
        title: 'Students',
        href: '/dashboard/students',
        icon: Users
    },
    {
        title: 'Departments',
        href: '/dashboard/departments',
        icon: FileText
    },
    {
        title: 'Settings',
        href: '/dashboard/settings',
        icon: Settings
    }
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { user } = useAppSelector((state) => state.auth);

    // Select navigation items based on user role
    const navItems = user?.role === 'admin' ? adminNavItems : teacherNavItems;

    // Get display name based on user type
    const displayName = user?.role === 'teacher' ? (user as any).name : user?.email;
    const displayInitial = displayName?.[0]?.toUpperCase() || '?';

    const handleLogout = () => {
        dispatch(logout());
        router.push('/login');
    };

    return (
        <div
            className={cn(
                "flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300",
                collapsed ? "w-16" : "w-64"
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                {!collapsed && (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-purple-600">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-xl font-semibold">CUH Portal</span>
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                    className="ml-auto"
                >
                    {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-2">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                                        isActive
                                            ? "bg-purple-100 text-purple-600"
                                            : "text-gray-600 hover:bg-gray-100",
                                        collapsed && "justify-center"
                                    )}
                                >
                                    <item.icon className="h-5 w-5 shrink-0" />
                                    {!collapsed && <span>{item.title}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User Section */}
            <div className="border-t p-4">
                <div className={cn(
                    "flex items-center gap-3",
                    collapsed && "justify-center"
                )}>
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                        {displayInitial}
                    </div>
                    {!collapsed && (
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">
                                {displayName}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                                {user?.role}
                            </p>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                        className="text-gray-500 hover:text-red-600"
                    >
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
} 