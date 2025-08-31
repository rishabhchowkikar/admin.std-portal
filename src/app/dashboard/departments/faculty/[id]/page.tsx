'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  Users,
  Crown,
  GraduationCap,
  UserCheck,
  Mail,
  Calendar,
  RefreshCw,
  Building2
} from 'lucide-react';
import { getCourseTeachers, CourseTeacher } from '@/utils/api/courseApi';
import { toast } from 'sonner';

// Role hierarchy for sorting
const ROLE_HIERARCHY = {
  'Head Of Department': 1,
  'Professor': 2,
  'Associate Professor': 3,
  'Assistant Professor': 4,
  'Lecturer': 5,
  'Teaching Assistant': 6
};

// Role display names and colors
const ROLE_DISPLAY = {
  'Head Of Department': { label: 'Head of Department', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  'Professor': { label: 'Professor', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  'Associate Professor': { label: 'Associate Professor', color: 'bg-green-100 text-green-800 border-green-300' },
  'Assistant Professor': { label: 'Assistant Professor', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  'Lecturer': { label: 'Lecturer', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  'Teaching Assistant': { label: 'Teaching Assistant', color: 'bg-gray-100 text-gray-800 border-gray-300' }
};

export default function FacultyTreePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [teachers, setTeachers] = useState<CourseTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (courseId) {
      fetchCourseTeachers();
    }
  }, [courseId]);

  const fetchCourseTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCourseTeachers(courseId);
      setTeachers(response.data);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to fetch course teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/dashboard/departments');
  };

  const getRoleDisplay = (role: string) => {
    return ROLE_DISPLAY[role as keyof typeof ROLE_DISPLAY] ||
      { label: role, color: 'bg-gray-100 text-gray-800 border-gray-300' };
  };

  const sortedTeachers = [...teachers].sort((a, b) => {
    const aRank = ROLE_HIERARCHY[a.role as keyof typeof ROLE_HIERARCHY] || 999;
    const bRank = ROLE_HIERARCHY[b.role as keyof typeof ROLE_HIERARCHY] || 999;
    return aRank - bRank;
  });

  const groupedTeachers = sortedTeachers.reduce((acc, teacher) => {
    const role = teacher.role;
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(teacher);
    return acc;
  }, {} as Record<string, CourseTeacher[]>);

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
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Faculty</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchCourseTeachers} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          onClick={handleBack}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="text-center">
          <Button
            onClick={fetchCourseTeachers}
            variant="outline"
            className="flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Faculty Tree</h1>
        </div>
      </div>

      {/* Course Info Card */}
      {teachers.length > 0 && (
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent>
            <div className="flex items-center gap-4">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-blue-900">
                  {teachers[0].courseId.name}
                </h2>
                <p className="text-blue-700 font-mono">
                  {teachers[0].courseId.code}
                </p>
                <p className="text-blue-600">
                  {teachers[0].courseId.department}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Faculty Tree */}
      <div className="space-y-8">
        {Object.entries(groupedTeachers).map(([role, roleTeachers]) => (
          <Card key={role} >
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {role === 'Head Of Department' && <Crown className="h-6 w-6 text-purple-600" />}
                  {role === 'Professor' && <GraduationCap className="h-6 w-6 text-blue-600" />}
                  {role === 'Associate Professor' && <UserCheck className="h-6 w-6 text-green-600" />}
                  {role === 'Assistant Professor' && <Users className="h-6 w-6 text-orange-600" />}
                  {!['Head Of Department', 'Professor', 'Associate Professor', 'Assistant Professor'].includes(role) &&
                    <Users className="h-6 w-6 text-gray-600" />}

                  <CardTitle className="">
                    <Badge
                      className={`${getRoleDisplay(role).color} border text-xl`}
                    >
                      {getRoleDisplay(role).label}
                    </Badge>
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roleTeachers.map((teacher) => (
                  <Card key={teacher._id} className="hover:shadow-md transition-shadow">
                    <CardContent>
                      <div className="text-center space-y-3">
                        {/* Teacher Info */}
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {teacher.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {teacher.department}
                          </p>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-center gap-2 text-gray-600">
                            <Mail className="h-4 w-4" />
                            <span className="truncate">{teacher.email}</span>
                          </div>
                        </div>

                        {/* Role Badge */}
                        {/* <Badge 
                                                    className={`${getRoleDisplay(teacher.role).color} border`}
                                                >
                                                    {getRoleDisplay(teacher.role).label}
                                                </Badge> */}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {teachers.length === 0 && !loading && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Faculty Found</h3>
            <p className="text-gray-500 mb-4">
              No teachers have been assigned to this course yet.
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