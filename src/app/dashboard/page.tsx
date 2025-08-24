// pages/dashboard.tsx or app/dashboard/page.tsx
"use client";

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/app/lib/store';
import { fetchDashboardStats } from '@/app/lib/dashboardSlice';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentActivities } from '@/components/dashboard/RecentActivities';
import { PendingActions } from '@/components/dashboard/PendingActions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
    Users, 
    GraduationCap, 
    Building, 
    BookOpen, 
    IndianRupee,
    CreditCard,
    RefreshCw,
    AlertCircle 
} from "lucide-react";

export default function DashboardPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { data, loading, error, lastFetched } = useSelector(
        (state: RootState) => state.dashboard
    );

    useEffect(() => {
        // Fetch dashboard data if not already loaded or if it's been more than 5 minutes
        const shouldFetch = !data || !lastFetched || 
            (Date.now() - new Date(lastFetched).getTime()) > 5 * 60 * 1000;
        
        if (shouldFetch) {
            dispatch(fetchDashboardStats());
        }
    }, [dispatch, data, lastFetched]);

    const handleRefresh = () => {
        dispatch(fetchDashboardStats());
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    if (loading && !data) {
        return <DashboardSkeleton />;
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Error loading dashboard: {error}
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="ml-4"
                            onClick={handleRefresh}
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retry
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back! Here's what's happening at your university.
                    </p>
                </div>
                <Button 
                    variant="outline" 
                    onClick={handleRefresh}
                    disabled={loading}
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Students"
                    value={data.overview.totalStudents}
                    icon={<Users />}
                    description="Active students enrolled"
                />
                <StatsCard
                    title="Total Teachers"
                    value={data.overview.totalTeachers}
                    icon={<GraduationCap />}
                    description="Faculty members"
                />
                <StatsCard
                    title="Departments"
                    value={data.overview.totalDepartments}
                    icon={<Building />}
                    description="Academic departments"
                />
                <StatsCard
                    title="Courses"
                    value={data.overview.totalCourses}
                    icon={<BookOpen />}
                    description="Available courses"
                />
            </div>

            {/* Today's Stats and Pending Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's Stats */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatsCard
                        title="Today's Collection"
                        value={formatCurrency(data.todayStats.feeCollection)}
                        icon={<IndianRupee />}
                        description="Fee collection today"
                        className="bg-green-50 border-green-200"
                    />
                    <StatsCard
                        title="Transactions"
                        value={data.todayStats.feeTransactions}
                        icon={<CreditCard />}
                        description="Payment transactions today"
                        className="bg-blue-50 border-blue-200"
                    />
                </div>

                {/* Pending Actions */}
                <PendingActions pendingActions={data.pendingActions} />
            </div>

            {/* Department Statistics */}
            <Card>
                <CardHeader>
                    <CardTitle>Department Statistics</CardTitle>
                    <CardDescription>
                        Student distribution across departments
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data.departmentStats.map((dept) => (
                            <div key={dept._id} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-medium">{dept._id}</h3>
                                    <Badge variant="secondary">
                                        {dept.studentCount} students
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    {dept.courses.map((course) => (
                                        <div key={course.name} className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">{course.name}</span>
                                            <span>{course.count} students</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activities */}
            <RecentActivities 
                newStudents={data.recentActivities.newStudents}
                recentPayments={data.recentActivities.recentPayments}
            />

            {/* Quick Links */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                        Frequently used admin functions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {data.quickLinks.map((link) => (
                            <Button
                                key={link.path}
                                variant="outline"
                                className="h-auto p-4 flex flex-col items-center gap-2"
                                asChild
                            >
                                <a href={link.path}>
                                    <span className="text-sm text-center">{link.title}</span>
                                </a>
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Loading skeleton component
function DashboardSkeleton() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="pb-2">
                            <Skeleton className="h-4 w-24" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16 mb-2" />
                            <Skeleton className="h-3 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Array.from({ length: 2 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-48" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Array.from({ length: 3 }).map((_, j) => (
                                    <div key={j} className="flex justify-between">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
