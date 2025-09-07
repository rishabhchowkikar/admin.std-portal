'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
    BookOpen, 
    Users, 
    GraduationCap, 
    Calendar,
    User,
    Mail,
    Building2,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { getCourseSubjects, getCourseData } from '@/utils/api/courseApi';
import { toast } from 'sonner';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';

interface AssignSubjectsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    courseId: string;
}

export function AssignSubjectsDrawer({ isOpen, onClose, courseId }: AssignSubjectsDrawerProps) {
    const [subjects, setSubjects] = useState<any[]>([]);
    const [assignedTeachers, setAssignedTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [courseName, setCourseName] = useState('Course');

    useEffect(() => {
        if (isOpen && courseId) {
            loadData();
        }
    }, [isOpen, courseId]);

    const loadData = async () => {
        try {
            setLoading(true);
            await Promise.all([
                loadSubjects(),
                loadCourseData()
            ]);
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const loadSubjects = async () => {
        try {
            const response = await getCourseSubjects(courseId);
            setSubjects(response.data || []);
        } catch (error: any) {
            console.error('Error loading subjects:', error);
            toast.error('Failed to load subjects');
        }
    };

    const loadCourseData = async () => {
        try {
            const response = await getCourseData(courseId);
            if (response.status && response.data && response.data.length > 0) {
                const courseData = response.data[0];
                setCourseName(courseData.name);
                setAssignedTeachers(courseData.assignedTeachers || []);
            }
        } catch (error: any) {
            console.error('Error loading course data:', error);
        }
    };

    // Group subjects by semester
    const subjectsBySemester = subjects.reduce((acc, subject) => {
        const semester = subject.semester;
        if (!acc[semester]) {
            acc[semester] = [];
        }
        acc[semester].push(subject);
        return acc;
    }, {} as Record<number, any[]>);

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent className="max-h-[90vh]">
                <DrawerHeader className="border-b">
                    <DrawerTitle className="text-2xl font-bold text-purple-700 flex items-center gap-3">
                        <BookOpen className="h-8 w-8" />
                        Assign Subjects to Teachers - {courseName}
                    </DrawerTitle>
                    <DrawerDescription>
                        Manage subject assignments for teachers in this course
                    </DrawerDescription>
                </DrawerHeader>

                <div className="flex-1 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 h-full">
                        {/* Left Side - Subjects by Semester */}
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <BookOpen className="h-5 w-5 text-blue-600" />
                                        Subjects by Semester
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-[400px]">
                                        {loading ? (
                                            <div className="flex items-center justify-center py-8">
                                                <div className="text-gray-500">Loading subjects...</div>
                                            </div>
                                        ) : Object.keys(subjectsBySemester).length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                                <BookOpen className="h-12 w-12 mb-2" />
                                                <p>No subjects found</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {Object.entries(subjectsBySemester)
                                                    .sort(([a], [b]) => Number(a) - Number(b))
                                                    .map(([semester, semesterSubjects]: any) => (
                                                        <div key={semester} className="space-y-3">
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="outline" className="text-sm">
                                                                    Semester {semester}
                                                                </Badge>
                                                                <span className="text-sm text-gray-500">
                                                                    {semesterSubjects.length} subjects
                                                                </span>
                                                            </div>
                                                            <div className="space-y-2 ml-4">
                                                                {semesterSubjects.map((subject: any) => (
                                                                    <div
                                                                        key={subject._id}
                                                                        className="p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors"
                                                                    >
                                                                        <div className="flex items-start justify-between">
                                                                            <div className="flex-1">
                                                                                <div className="flex items-center gap-2 mb-1">
                                                                                    <p className="font-medium text-gray-900">
                                                                                        {subject.name}
                                                                                    </p>
                                                                                    <Badge variant="secondary" className="text-xs">
                                                                                        {subject.code}
                                                                                    </Badge>
                                                                                </div>
                                                                                {subject.teacherId ? (
                                                                                    <div className="flex items-center gap-2 text-sm text-green-600">
                                                                                        <CheckCircle className="h-4 w-4" />
                                                                                        <span>Assigned to {subject.teacherId.name}</span>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="flex items-center gap-2 text-sm text-orange-600">
                                                                                        <AlertCircle className="h-4 w-4" />
                                                                                        <span>Not assigned</span>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Side - Assigned Teachers */}
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Users className="h-5 w-5 text-green-600" />
                                        Assigned Teachers
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-[400px]">
                                        {assignedTeachers.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                                <Users className="h-12 w-12 mb-2" />
                                                <p>No teachers assigned to this course</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {assignedTeachers.map((teacher) => (
                                                    <div
                                                        key={teacher._id}
                                                        className="p-4 rounded-lg border bg-green-50 border-green-200 hover:bg-green-100 transition-colors"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className="mt-1">
                                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <p className="font-medium text-gray-900">
                                                                        {teacher.name}
                                                                    </p>
                                                                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                                                        {teacher.role}
                                                                    </Badge>
                                                                </div>
                                                                <div className="space-y-1 text-sm text-gray-600">
                                                                    <div className="flex items-center gap-2">
                                                                        <Mail className="h-4 w-4" />
                                                                        <span>{teacher.email}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Building2 className="h-4 w-4" />
                                                                        <span>{teacher.department}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                <DrawerFooter className="border-t">
                    <div className="flex justify-end gap-3">
                        <DrawerClose asChild>
                            <Button variant="outline">Close</Button>
                        </DrawerClose>
                        <Button className="bg-purple-600 hover:bg-purple-700">
                            Save Changes
                        </Button>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
} 