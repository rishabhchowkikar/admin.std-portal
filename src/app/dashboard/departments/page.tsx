// pages/courses.tsx or app/courses/page.tsx
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

// Update the path below to the correct relative path if needed
import type { RootState, AppDispatch } from '@/app/lib/store';
import { fetchCourses } from '@/app/lib/courseSlice';
import { CourseCard } from '@/components/courses/CourseCard';
import { CourseFilters } from '@/components/courses/CourseFilter';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Plus,
    RefreshCw,
    AlertCircle,
    BookOpen,
    GraduationCap,
    Building2,
    Users
} from "lucide-react";

export default function CoursesPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { courses, loading, error, lastFetched } = useSelector(
        (state: RootState) => state.courses
    );

    // Filter states
    const [filters, setFilters] = useState({
        search: '',
        department: null as string | null,
        status: null as string | null,
    });

    useEffect(() => {
        // Fetch courses if not already loaded or if it's been more than 5 minutes
        const shouldFetch = !courses.length || !lastFetched ||
            (Date.now() - new Date(lastFetched).getTime()) > 5 * 60 * 1000;

        if (shouldFetch) {
            dispatch(fetchCourses());
        }
    }, [dispatch, courses.length, lastFetched]);

    // Get unique departments for filtering
    const departments = useMemo(() => {
        return Array.from(new Set(courses.map(course => course.department))).sort();
    }, [courses]);

    // Filter courses based on active filters
    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const matchesSearch = !filters.search ||
                course.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                course.code.toLowerCase().includes(filters.search.toLowerCase()) ||
                course.description.toLowerCase().includes(filters.search.toLowerCase());

            const matchesDepartment = !filters.department ||
                course.department === filters.department;

            const matchesStatus = !filters.status ||
                (filters.status === 'active' ? course.isActive : !course.isActive);

            return matchesSearch && matchesDepartment && matchesStatus;
        });
    }, [courses, filters]);

    // Calculate stats
    const stats = useMemo(() => {
        const activeCourses = courses.filter(c => c.isActive).length;
        const totalTeachers = new Set(
            courses.flatMap(c => c.assignedTeachers.map(t => t._id))
        ).size;

        return {
            total: courses.length,
            active: activeCourses,
            inactive: courses.length - activeCourses,
            departments: departments.length,
            teachers: totalTeachers
        };
    }, [courses, departments]);

    const handleRefresh = () => {
        dispatch(fetchCourses());
    };

    const handleSearch = (query: string) => {
        setFilters(prev => ({ ...prev, search: query }));
    };

    const handleFilterByDepartment = (department: string | null) => {
        setFilters(prev => ({ ...prev, department }));
    };

    const handleFilterByStatus = (status: string | null) => {
        setFilters(prev => ({ ...prev, status }));
    };

    const handleClearFilters = () => {
        setFilters({
            search: '',
            department: null,
            status: null,
        });
    };

    const handleEditCourse = (courseId: string) => {
        // Navigate to edit course page
        console.log('Edit course:', courseId);
    };

    const handleViewCourse = (courseId: string) => {
        // Navigate to course details page
        console.log('View course:', courseId);
    };

    const handleViewFaculty = (courseId: string) => {
        router.push(`/dashboard/departments/faculty/${courseId}`);
    };



    if (loading && courses.length === 0) {
        return <CoursesPageSkeleton />;
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Error loading courses: {error}
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

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <BookOpen className="h-8 w-8 text-purple-600" />
                        Courses
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage university courses and programs
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={loading}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Course
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-3">
                        <BookOpen className="h-8 w-8 text-purple-600" />
                        <div>
                            <p className="text-2xl font-bold text-purple-900">{stats.total}</p>
                            <p className="text-sm text-purple-700">Total Courses</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                        <GraduationCap className="h-8 w-8 text-green-600" />
                        <div>
                            <p className="text-2xl font-bold text-green-900">{stats.active}</p>
                            <p className="text-sm text-green-700">Active Courses</p>
                        </div>
                    </div>
                </div>


                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                        <Building2 className="h-8 w-8 text-blue-600" />
                        <div>
                            <p className="text-2xl font-bold text-blue-900">{stats.departments}</p>
                            <p className="text-sm text-blue-700">Departments</p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Filters */}
            <CourseFilters
                onSearch={handleSearch}
                onFilterByDepartment={handleFilterByDepartment}
                onFilterByStatus={handleFilterByStatus}
                departments={departments}
                activeFilters={filters}
                onClearFilters={handleClearFilters}
            />

            {/* Results Summary */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing {filteredCourses.length} of {courses.length} courses
                </p>
                {filteredCourses.length !== courses.length && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearFilters}
                    >
                        Show All Courses
                    </Button>
                )}
            </div>

            {/* Courses Grid */}
            {filteredCourses.length === 0 ? (
                <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                    <p className="text-muted-foreground mb-4">
                        {courses.length === 0
                            ? "No courses have been added yet."
                            : "Try adjusting your filters to see more results."
                        }
                    </p>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Course
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredCourses.map((course) => (
                        <CourseCard
                            key={course._id}
                            course={course}
                            onEdit={handleEditCourse}
                            onView={handleViewCourse}
                            onViewFaculty={handleViewFaculty}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// Loading skeleton component
function CoursesPageSkeleton() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex gap-3">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                ))}
            </div>

            <Skeleton className="h-16 w-full" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton className="h-48 w-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}
