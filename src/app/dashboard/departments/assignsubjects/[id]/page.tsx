'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    BookOpen, 
    Users, 
    Mail,
    Building2,
    CheckCircle,
    AlertCircle,
    ArrowLeft,
    UserPlus,
    Link
} from 'lucide-react';
import { getCourseSubjects, getCourseData,assignSubjectToTeacher } from '@/utils/api/courseApi';
import { toast } from 'sonner';

export default function AssignSubjectsPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;

    const [subjects, setSubjects] = useState<any[]>([]);
    const [assignedTeachers, setAssignedTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [courseName, setCourseName] = useState('Course');
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [selectedTeacher, setSelectedTeacher] = useState<string>('');
    const [assigning, setAssigning] = useState(false);

    useEffect(() => {
        if (courseId) {
            loadData();
        }
    }, [courseId]);

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

    const handleAssignSubject = async () => {
        if (!selectedSubject || !selectedTeacher) {
            toast.error('Please select both subject and teacher');
            return;
        }

        try {
            setAssigning(true);
            
            console.log('Assigning subject:', selectedSubject, 'to teacher:', selectedTeacher);
            
            // Call the API to assign subject to teacher
            const response = await assignSubjectToTeacher(selectedSubject, selectedTeacher);
            
            if (response.status) {
                toast.success('Subject assigned successfully');
                
                // Reset selections
                setSelectedSubject('');
                setSelectedTeacher('');
                
                // Reload data to show updated assignments
                await loadSubjects();
            } else {
                throw new Error(response.message || 'Assignment failed');
            }
        } catch (error: any) {
            console.error('Assignment error:', error);
            toast.error(error.message || 'Failed to assign subject');
        } finally {
            setAssigning(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-6">
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => router.back()}
                            variant="ghost"
                            size="sm"
                            className="hover:bg-purple-50"
                        >
                            <ArrowLeft className="h-4 w-4 text-purple-600" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <BookOpen className="h-8 w-8 text-purple-600" />
                                Assign Subjects to Teachers - {courseName}
                            </h1>
                            <p className="text-gray-600 mt-1">Manage subject assignments for teachers in this course</p>
                        </div>
                    </div>
                </div>

                {/* Top Section - Subjects by Semester */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                            Subjects by Semester
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px]">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-lg text-gray-500">Loading subjects...</div>
                                </div>
                            ) : Object.keys(subjectsBySemester).length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                                    <BookOpen className="h-16 w-16 mb-4" />
                                    <p className="text-lg">No subjects found</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {Object.entries(subjectsBySemester)
                                        .sort(([a], [b]) => Number(a) - Number(b))
                                        .map(([semester, semesterSubjects]: any) => (
                                            <div key={semester} className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="outline" className="text-base px-3 py-1">
                                                        Semester {semester}
                                                    </Badge>
                                                    <span className="text-sm text-gray-500">
                                                        {semesterSubjects.length} subjects
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ml-4">
                                                    {semesterSubjects.map((subject: any) => (
                                                        <div
                                                            key={subject._id}
                                                            className="p-4 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors"
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <p className="font-medium text-gray-900 text-sm">
                                                                            {subject.name}
                                                                        </p>
                                                                    </div>
                                                                   <div className='flex items-center justify-start gap-2'>
                                                                   <Badge variant="outline" className="text-xs bg-purple-300 border-purple-700 text-white font-bold">
                                                                        {subject.code}
                                                                    </Badge>
                                                                    {subject.teacherId ? (
                                                                        <div className="flex items-center gap-2 text-xs text-green-600">
                                                                            <CheckCircle className="h-3 w-3" />
                                                                            <span>Assigned to {subject.teacherId.name}</span>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex items-center gap-2 text-xs text-orange-600">
                                                                            <AlertCircle className="h-3 w-3" />
                                                                            <span>Not assigned</span>
                                                                        </div>
                                                                    )}
                                                                   </div>
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

                {/* Bottom Section - Assignment Interface */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <UserPlus className="h-6 w-6 text-purple-600" />
                            Assign Subject to Teacher
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Subject Selection */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700">
                                    Select Subject
                                </label>
                                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Choose a subject..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subjects.map((subject) => (
                                            <SelectItem key={subject._id} value={subject._id}>
                                                <div className="flex gap-2 items-center justify-center">
                                                    <span className="font-medium">{subject.name}</span>
                                                    <span className="text-xs text-gray-500">
                                                        {subject.code} - Semester {subject.semester}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Teacher Selection */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700">
                                    Select Teacher
                                </label>
                                <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Choose a teacher..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {assignedTeachers.map((teacher) => (
                                            <SelectItem key={teacher._id} value={teacher._id}>
                                                <div className="flex gap-2 items-center justify-center">
                                                    <span className="font-medium">{teacher.name}</span>
                                                    <span className="text-xs text-gray-500">
                                                        {teacher.role}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Assignment Button */}
                        <div className="flex justify-end mt-6">
                            <Button
                                onClick={handleAssignSubject}
                                disabled={assigning || !selectedSubject || !selectedTeacher}
                                className="bg-purple-600 hover:bg-purple-700 h-12 px-8"
                            >
                                {assigning ? (
                                    'Assigning...'
                                ) : (
                                    <>
                                        <Link className="h-4 w-4 mr-2" />
                                        Assign Subject to Teacher
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}