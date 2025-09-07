import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Building2, Clock, BookOpen, Users, GraduationCap, Calendar, MoreHorizontal,NotebookPen, UserPlus } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { AssignSubjectsDrawer } from "./AssignSubjectsDrawer";
import { useState } from "react";

interface Teacher {
    _id: string;
    name: string;
    email: string;
}

interface CourseCardProps {
    course: {
        _id: string;
        name: string;
        code: string;
        department: string;
        description: string;
        duration: number;
        totalSemesters: number;
        school: string;
        isActive: boolean;
        assignedTeachers: Teacher[];
        createdAt: string;
        updatedAt: string;
    };
    onEdit?: (courseId: string) => void;
    onView?: (courseId: string) => void;
    onViewFaculty?: (courseId: string) => void;
    onViewTimetable?: (courseId: string) => void;
    onAssignTeachers?: (courseId: string) => void;
}

export function CourseCard({ course, onEdit, onView, onViewFaculty, onViewTimetable, onAssignTeachers }: CourseCardProps) {
    const router = useRouter();
    const [isAssignSubjectsOpen, setIsAssignSubjectsOpen] = useState(false);

    const handleAssignTeachers = () => {
        router.push(`/dashboard/departments/assignedteachers/${course._id}`);
    };

    const handleAssignSubjects = () => {
        router.push(`/dashboard/departments/assignsubjects/${course._id}`);
    };
    return (
        <>
        <Card className="w-full group transition-all duration-200 hover:shadow-lg hover:shadow-purple-100 border-l-4 border-l-purple-500 gap-0">
            {/* TOP ROW */}
            <CardHeader className="pb-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    {/* Left Info */}
                    <div className="flex-1 min-w-0">

                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <CardTitle className="text-2xl font-bold text-purple-700">
                                        {course.name}
                                    </CardTitle>
                                    <Badge
                                        className={
                                            course.isActive
                                                ? "bg-green-100 text-green-800 border-green-300"
                                                : "bg-gray-100 text-gray-700"
                                        }
                                    >
                                        {course.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 mb-2 text-muted-foreground text-base">
                                    <span className="font-mono font-semibold text-purple-700 bg-purple-50 px-2 py-1 rounded">
                                        {course.code}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Building2 className="h-5 w-5" />{course.school}
                                    </span>
                                </div>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="rounded-xl border border-gray-300 bg-white p-3 ml-2 hover:bg-gray-50 transition">
                                        <MoreHorizontal className="h-6 w-6" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => onViewFaculty?.(course._id)}>
                                        <Users className="w-4 h-4" />
                                        View Faculty
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onViewTimetable?.(course._id)}>
                                        <Clock className="w-4 h-4" />
                                        Timetable
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleAssignTeachers}>
                                        <UserPlus className="w-4 h-4" />
                                        Assign Teachers to Course
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleAssignSubjects}>
                                        <UserPlus className="w-4 h-4" />
                                        Assign Subjects To Teachers
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        {/* Stats */}
                        <div className="flex flex-row gap-4 my-2">
                            {/* Years */}
                            <div className="flex-1 flex flex-row items-center justify-center rounded-xl py-4">
                                <span className="font-extrabold text-5xl text-blue-900">{course.duration}</span>
                                <div className="flex flex-col items-start ml-2">
                                    <Clock className="h-7 w-7 text-blue-600" />
                                    <span className="text-blue-600 text-base">Years</span>
                                </div>
                            </div>
                            {/* Semesters */}
                            <div className="flex-1 flex flex-row items-center justify-center py-4">
                                <span className="font-extrabold text-5xl text-green-900">{course.totalSemesters}</span>
                               <div className="flex flex-col items-start ml-2">
                                 <BookOpen className="h-7 w-7 text-green-600" />
                                <span className="text-green-600 text-base">Semesters</span>
                               </div>
                            </div>
                            {/* Teachers */}
                            <div className="flex-1 flex flex-row items-center justify-center py-4">
                                <span className="font-extrabold text-5xl text-purple-900">{course.assignedTeachers.length}</span>
                                <div className="flex flex-col items-start ml-2">
                                    <Users className="h-7 w-7 mb-1 text-purple-600" />
                                <span className="text-purple-600 text-base">Teachers</span>
                                </div>
                            </div>
                        </div>


                    </div>
                    {/* Menu Button */}

                </div>
            </CardHeader>

            {/* SECOND ROW: Only Department and Updated */}
            <CardContent className="">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-y-4 gap-x-6">
                    <div className="flex items-center flex-nowrap bg-gray-50 rounded-xl px-6 py-3">
                        <GraduationCap className="h-6 w-6 text-gray-600 mr-3" />
                        <span className="font-medium text-lg text-gray-900">{course.department}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
        <AssignSubjectsDrawer
                isOpen={isAssignSubjectsOpen}
                onClose={() => setIsAssignSubjectsOpen(false)}
                courseId={course._id}
            />
        </>
    );
}
