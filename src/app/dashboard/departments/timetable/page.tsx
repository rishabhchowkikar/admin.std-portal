'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    ArrowLeft,
    Clock,
    BookOpen,
    Users,
    Calendar,
    Building2,
    RefreshCw,
    GraduationCap
} from 'lucide-react';
import { getCourseTimetables, Timetable } from '@/utils/api/timetableApi';
import { toast } from 'sonner';

export default function TimetablePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const courseId = searchParams.get('courseId');

    const [timetables, setTimetables] = useState<Timetable[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSemester, setSelectedSemester] = useState<string>('1');

    const fetchTimetables = useCallback(async () => {
        if (!courseId) return;

        try {
            setLoading(true);
            setError(null);
            const response = await getCourseTimetables(courseId);
            setTimetables(response.data);

            // Set first semester as default if available
            if (response.data.length > 0 && !selectedSemester) {
                setSelectedSemester(response.data[0].semester.toString());
            }
        } catch (err: any) {
            setError(err.message);
            toast.error('Failed to fetch timetables');
        } finally {
            setLoading(false);
        }
    }, [courseId, selectedSemester]);

    useEffect(() => {
        if (courseId) {
            fetchTimetables();
        }
    }, [courseId, fetchTimetables]);

    const handleBack = () => {
        router.push('/dashboard/departments');
    };

    const getSemesterTimetable = (semester: string) => {
        return timetables.find(t => t.semester.toString() === semester);
    };

    const getTimeSlotColor = (time: string) => {
        const hour = parseInt(time.split(':')[0]);
        if (hour < 10) return 'bg-blue-100 text-blue-800';
        if (hour < 12) return 'bg-green-100 text-green-800';
        if (hour < 15) return 'bg-orange-100 text-orange-800';
        return 'bg-purple-100 text-purple-800';
    };

    if (!courseId) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Course ID Required</h1>
                    <p className="text-gray-600 mb-4">Please provide a course ID to view timetables.</p>
                    <Button onClick={handleBack} variant="outline">
                    </Button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-32" />
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[1, 2, 3].map((j) => (
                                        <Skeleton key={j} className="h-24 w-full" />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
  return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Timetables</h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={fetchTimetables} variant="outline">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    const availableSemesters = timetables.map(t => t.semester).sort((a, b) => a - b);
    const currentTimetable = getSemesterTimetable(selectedSemester);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Button
                        onClick={handleBack}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    {/* Refresh Button */}
                    <Button
                        onClick={fetchTimetables}
                        variant="outline"
                        className="flex items-center gap-2"
                        disabled={loading}
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Course Timetables</h1>
                        <p className="text-gray-600">
                            {timetables[0]?.courseId?.name || 'Unknown Course'}
                        </p>
                    </div>
                </div>


            </div>

            {/* Course Info Card */}
            {timetables.length > 0 && (
                <Card className="mb-8 bg-blue-50 border-blue-200">
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <Building2 className="h-8 w-8 text-blue-600" />
                            <div>
                                <div className='flex items-center justify-center gap-2'>
                                    <h2 className="text-xl font-semibold text-blue-900">
                                        {timetables[0].courseId.name}
                                    </h2>
                                    <p className="text-blue-700 text-sm font-mono font-bold">
                                        ({timetables[0].courseId.code})
                                    </p>
                                </div>
                                <p className="text-blue-600">
                                    {timetables[0].courseId.department}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Semester Tabs */}
            {availableSemesters.length > 0 && (
                <div className="mb-8">
                    <div className="flex flex-wrap gap-2">
                        {availableSemesters.map((semester) => (
                            <Button
                                key={semester}
                                variant={selectedSemester === semester.toString() ? "default" : "outline"}
                                onClick={() => setSelectedSemester(semester.toString())}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <GraduationCap className="h-4 w-4" />
                                Semester {semester}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* Timetable Display */}
            {currentTimetable ? (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Semester {currentTimetable.semester}
                        </h2>
                        <Badge variant="secondary" className="text-lg px-3 py-1">
                            {currentTimetable.schedule.length} Days
                        </Badge>
                    </div>

                    {/* Simple Table Format */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-32">
                                            Time
                                        </th>
                                        {currentTimetable.schedule.map((daySchedule) => (
                                            <th key={daySchedule.day} className="px-6 py-4 text-left text-sm font-semibold text-gray-900 min-w-48">
                                                {daySchedule.day}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {/* Get all unique time slots */}
                                    {(() => {
                                        const allTimes = new Set<string>();
                                        currentTimetable.schedule.forEach(day => {
                                            day.periods.forEach(period => {
                                                allTimes.add(period.time);
                                            });
                                        });
                                        return Array.from(allTimes).sort();
                                    })().map((time) => (
                                        <tr key={time} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                <Badge className={`${getTimeSlotColor(time)} font-mono`}>
                                                    {time}
                                                </Badge>
                                            </td>
                                            {currentTimetable.schedule.map((daySchedule) => {
                                                const period = daySchedule.periods.find(p => p.time === time);
                                                return (
                                                    <td key={`${daySchedule.day}-${time}`} className="px-6 py-4">
                                                        {period ? (
                                                            <div className="space-y-2">
                                                                <div className="flex items-start gap-2">
                                                                    <BookOpen className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                                                    <div className="min-w-0 flex-1">
                                                                        <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                                                                            {period.subjectId.name}
                                                                        </h4>
                                                                        <p className="text-xs text-blue-600 font-mono mt-1">
                                                                            {period.subjectId.code}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-start gap-2">
                                                                    <Users className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                                    <div className="min-w-0 flex-1">
                                                                        <p className="text-xs font-medium text-gray-700">
                                                                            {period.subjectId.teacherId.name}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">
                                                                            {period.subjectId.teacherId.department}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="text-gray-400 text-sm italic">
                                                                No class
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                /* Empty State */
                <Card className="text-center py-12">
                    <CardContent>
                        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            No Timetable Found
                        </h3>
                        <p className="text-gray-500 mb-4">
                            {availableSemesters.length > 0
                                ? `No timetable available for Semester ${selectedSemester}`
                                : 'No timetables have been created for this course yet.'
                            }
                        </p>
                        <Button onClick={handleBack} variant="outline">
                            Back to Courses
                        </Button>
                    </CardContent>
                </Card>
            )}


        </div>
    );
}