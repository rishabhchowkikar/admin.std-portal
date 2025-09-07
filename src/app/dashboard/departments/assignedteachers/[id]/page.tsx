'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Search, Users, CheckCircle, Trash2, UserPlus, ArrowLeft } from 'lucide-react';
import { Teacher } from '@/types/teacher';
import { fetchAllTeachers } from '@/utils/api/teacherApi';
import { assignTeachersToCourse, getCourseData } from '@/utils/api/courseApi';
import { toast } from 'sonner';

export default function AssignedTeachersPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;

    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [assignedTeachers, setAssignedTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
    const [courseName, setCourseName] = useState('Course');

    // Load teachers and course info when page loads
    useEffect(() => {
        if (courseId) {
            loadData();
        }
    }, [courseId]);

    const loadData = async () => {
        try {
            setLoading(true);

            // Load all data in parallel
            await Promise.all([
                loadTeachers(),
                loadCourseData()
            ]);
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const loadTeachers = async () => {
        try {
            const teachersData = await fetchAllTeachers();
            setTeachers(teachersData);
        } catch (error: any) {
            console.error('Error loading teachers:', error);
            toast.error('Failed to load teachers');
        }
    };

    const loadCourseData = async () => {
        try {
            console.log('Loading course data for ID:', courseId);
            
            const response = await getCourseData(courseId);
            console.log('Course API response:', response);

            if (response.status && response.data && response.data.length > 0) {
                const courseData = response.data[0];
                
                // Set course name
                setCourseName(courseData.name);
                
                // Set assigned teachers from the course data
                setAssignedTeachers(courseData.assignedTeachers || []);
                
                console.log('Course loaded:', {
                    name: courseData.name,
                    assignedTeachers: courseData.assignedTeachers
                });
            } else {
                throw new Error('Course not found');
            }
        } catch (error: any) {
            console.error('Error loading course data:', error);
            toast.error('Failed to load course data');
            // Set empty array as fallback
            setAssignedTeachers([]);
        }
    };

    // Get assigned teacher IDs
    const assignedTeacherIds = assignedTeachers.map(teacher => teacher._id);

    // Filter teachers into assigned and unassigned
    const getFilteredTeachers = () => {
        const filtered = teachers.filter(teacher =>
            teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.department.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return {
            assigned: filtered.filter(teacher => assignedTeacherIds.includes(teacher._id)),
            unassigned: filtered.filter(teacher => !assignedTeacherIds.includes(teacher._id))
        };
    };

    const handleTeacherToggle = (teacherId: string) => {
        setSelectedTeachers(prev =>
            prev.includes(teacherId)
                ? prev.filter(id => id !== teacherId)
                : [...prev, teacherId]
        );
    };

    const handleSelectAllUnassigned = () => {
        const { unassigned } = getFilteredTeachers();
        const allSelected = unassigned.every(teacher =>
            selectedTeachers.includes(teacher._id)
        );

        if (allSelected) {
            // Deselect all unassigned teachers
            setSelectedTeachers(prev =>
                prev.filter(id => !unassigned.some(teacher => teacher._id === id))
            );
        } else {
            // Select all unassigned teachers
            const newSelections = unassigned
                .filter(teacher => !selectedTeachers.includes(teacher._id))
                .map(teacher => teacher._id);
            setSelectedTeachers(prev => [...prev, ...newSelections]);
        }
    };

    const handleAssign = async () => {
        if (selectedTeachers.length === 0) {
            toast.error('Please select at least one teacher');
            return;
        }

        try {
            setAssigning(true);

            console.log('Assigning teachers:', {
                courseId,
                selectedTeachers,
                assignedTeacherIds,
                allTeacherIds: [...assignedTeacherIds, ...selectedTeachers]
            });

            // Combine currently assigned teachers with newly selected ones
            const allTeacherIds = [...assignedTeacherIds, ...selectedTeachers];

            const response = await assignTeachersToCourse({
                courseId,
                teacherIds: allTeacherIds
            });

            console.log('Assignment response:', response);

            if (response.status) {
                toast.success(`Successfully assigned ${selectedTeachers.length} teachers`);

                // Reload course data to get updated assigned teachers
                await loadCourseData();
                
                // Clear selected teachers
                setSelectedTeachers([]);
            } else {
                throw new Error(response.message || 'Assignment failed');
            }
        } catch (error: any) {
            console.error('Assignment error:', error);
            toast.error(error.message || 'Failed to assign teachers');
        } finally {
            setAssigning(false);
        }
    };

    const handleRemoveTeacher = async (teacherId: string) => {
        try {
            setAssigning(true);

            console.log('Removing teacher:', {
                courseId,
                teacherId,
                currentAssignedIds: assignedTeacherIds,
                updatedIds: assignedTeacherIds.filter(id => id !== teacherId)
            });

            // Remove the teacher from assigned list
            const updatedTeacherIds = assignedTeacherIds.filter(id => id !== teacherId);

            const response = await assignTeachersToCourse({
                courseId,
                teacherIds: updatedTeacherIds
            });

            console.log('Removal response:', response);

            if (response.status) {
                toast.success('Teacher removed successfully');

                // Reload course data to get updated assigned teachers
                await loadCourseData();
            } else {
                throw new Error(response.message || 'Removal failed');
            }
        } catch (error: any) {
            console.error('Removal error:', error);
            toast.error(error.message || 'Failed to remove teacher');
        } finally {
            setAssigning(false);
        }
    };

    const { assigned, unassigned } = getFilteredTeachers();
    const allUnassignedSelected = unassigned.length > 0 &&
        unassigned.every(teacher => selectedTeachers.includes(teacher._id));

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
                                <Users className="h-8 w-8 text-purple-600" />
                                Assign Teachers to {courseName}
                            </h1>
                            <p className="text-gray-600 mt-1">Manage teacher assignments for this course</p>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        placeholder="Search teachers by name, email, or department..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 h-12 text-base"
                    />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {/* Unassigned Teachers Section */}
                    <Card className='gap-2'>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                                    <UserPlus className="h-6 w-6 text-blue-600" />
                                    Available Teachers
                                </CardTitle>
                                <Badge variant="secondary" className="bg-blue-50 text-blue-600 text-base px-3 py-1">
                                    {unassigned.length} available
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Select All for Unassigned */}
                            {unassigned.length > 0 && (
                                <div className="flex items-center space-x-3 mb-4">
                                    <Checkbox
                                        id="select-all-unassigned"
                                        checked={allUnassignedSelected}
                                        onCheckedChange={handleSelectAllUnassigned}
                                        className="h-5 w-5"
                                    />
                                    <Label htmlFor="select-all-unassigned" className="text-base font-medium">
                                        Select All ({unassigned.length} teachers)
                                    </Label>
                                </div>
                            )}

                            <div className="border-t overflow-hidden">
                                <ScrollArea className="h-[600px]">
                                    {loading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="text-lg text-gray-500">Loading teachers...</div>
                                        </div>
                                    ) : unassigned.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                                            <User className="h-16 w-16 mb-4" />
                                            <p className="text-lg">No available teachers</p>
                                        </div>
                                    ) : (
                                        <div className="pt-3 space-y-3">
                                            {unassigned.map((teacher) => (
                                                <div
                                                    key={teacher._id}
                                                    className="flex items-start space-x-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                                                >
                                                    <Checkbox
                                                        id={teacher._id}
                                                        checked={selectedTeachers.includes(teacher._id)}
                                                        onCheckedChange={() => handleTeacherToggle(teacher._id)}
                                                        className="mt-1 h-5 w-5"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <p className="text-base font-medium text-gray-900">
                                                                {teacher.name}
                                                            </p>
                                                            {selectedTeachers.includes(teacher._id) && (
                                                                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-500 mb-3">{teacher.email}</p>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline" className="text-sm px-2 py-1">
                                                                {teacher.department}
                                                            </Badge>
                                                            <Badge variant="secondary" className="text-sm px-2 py-1">
                                                                {teacher.role}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Assigned Teachers Section */}
                    <Card className='gap-2'>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                    Assigned Teachers
                                </CardTitle>
                                <Badge variant="secondary" className="bg-green-50 text-green-600 text-base px-3 py-1">
                                    {assigned.length} assigned
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="border-t overflow-hidden">
                                <ScrollArea className="h-[600px]">
                                    {assigned.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                                            <Users className="h-16 w-16 mb-4" />
                                            <p className="text-lg">No teachers assigned yet</p>
                                        </div>
                                    ) : (
                                        <div className="pt-3 space-y-3">
                                            {assigned.map((teacher) => (
                                                <div
                                                    key={teacher._id}
                                                    className="flex items-start space-x-4 p-4 rounded-lg border bg-green-50 border-green-200 hover:bg-green-100 transition-colors"
                                                >
                                                    <div className="mt-1">
                                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <p className="text-base font-medium text-gray-900">
                                                                {teacher.name}
                                                            </p>
                                                            <Badge variant="secondary" className="text-sm px-2 py-1 bg-green-100 text-green-700">
                                                                Assigned
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-gray-500 mb-3">{teacher.email}</p>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline" className="text-sm px-2 py-1">
                                                                {teacher.department}
                                                            </Badge>
                                                            <Badge variant="secondary" className="text-sm px-2 py-1">
                                                                {teacher.role}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemoveTeacher(teacher._id)}
                                                        disabled={assigning}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-6 border-t">
                    <Button variant="outline" onClick={() => router.back()} disabled={assigning} className="h-12 px-6">
                        Back to Courses
                    </Button>
                    <Button
                        onClick={handleAssign}
                        disabled={assigning || selectedTeachers.length === 0}
                        className="bg-purple-600 hover:bg-purple-700 h-12 px-6"
                    >
                        {assigning ? 'Processing...' : `Assign ${selectedTeachers.length} Teachers`}
                    </Button>
                </div>
            </div>
        </div>
    );
}