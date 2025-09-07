// src/app/dashboard/teachers/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Building2,
  Calendar,
  Mail,
  AlertCircle,
  UserPlus
} from 'lucide-react';
import { fetchTeacherProfile, TeacherProfile } from '@/utils/api/teacherApi';
import { toast } from 'sonner';

export default function TeacherProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTeacherProfile(params.id as string);
        setProfile(data);
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadProfile();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-12 w-[200px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-6">
        <Alert className="border-purple-200 bg-purple-50">
          <AlertCircle className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-800">
            {error || 'Failed to load teacher profile'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-purple-100 pb-6">
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
            <h1 className="text-2xl font-semibold text-gray-900">{profile.basicInfo.name}</h1>
            <p className="text-purple-600 font-medium">{profile.basicInfo.role}</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{profile.teachingStats.totalSubjects}</p>
          <p className="text-sm text-gray-600">Subjects</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{profile.teachingStats.semestersTeaching}</p>
          <p className="text-sm text-gray-600">Semesters</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{profile.teachingStats.coursesInvolved}</p>
          <p className="text-sm text-gray-600">Courses</p>
        </div>
      </div>

      {/* Basic Info & Course */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card className="border-purple-100">
          <CardHeader className="border-b border-purple-50">
            <CardTitle className="text-lg text-gray-900">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-purple-500" />
              <a href={`mailto:${profile.basicInfo.email}`} className="text-purple-600 hover:underline">
                {profile.basicInfo.email}
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Building2 className="h-4 w-4 text-purple-500" />
              <span className="text-gray-700">{profile.basicInfo.department}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-purple-500" />
              <span className="text-gray-700">
                Joined {new Date(profile.basicInfo.createdAt).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

       {/* Assigned Course or No Course Alert */}
       {profile.assignedCourse ? (
          <Card className="border-purple-100">
            <CardHeader className="border-b border-purple-50">
              <CardTitle className="text-lg text-gray-900">Assigned Course</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{profile.assignedCourse.name}</h3>
                  <p className="text-sm text-gray-600">{profile.assignedCourse.department}</p>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                    <span>{profile.assignedCourse.duration} years</span>
                    <span>•</span>
                    <span>{profile.assignedCourse.totalSemesters} semesters</span>
                  </div>
                </div>
                <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                  {profile.assignedCourse.code}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="border-b border-orange-100">
              <CardTitle className="text-lg text-orange-900 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                No Course Assigned
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-center py-4">
                <UserPlus className="h-12 w-12 text-orange-500 mx-auto mb-3" />
                <p className="text-orange-800 font-medium mb-2">
                  This teacher is not assigned to any course yet
                </p>
                <p className="text-sm text-orange-700 mb-4">
                  Please assign a course to this teacher to enable teaching activities and timetable management.
                </p>
                <Button 
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                  onClick={() => {
                    // Navigate to courses page or open assign course dialog
                    router.push('/dashboard/departments');
                  }}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assign Course
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Semester Details */}
      {profile.semesterDetails.map((semester) => (
        <Card key={semester.semester} className="border-purple-100">
          <CardHeader className="border-b border-purple-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-gray-900">
                Semester {semester.semester}
              </CardTitle>
              <Badge variant="secondary" className="bg-purple-50 text-purple-600">
                {semester.totalPeriods} Periods
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Subjects */}
            <div className="space-y-4 mb-6">
              {semester.subjects.map((subject) => (
                <div
                  key={subject._id}
                  className="flex items-center justify-between p-3 bg-purple-50/50 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{subject.name}</h4>
                    <p className="text-sm text-gray-600">{subject.course.department}</p>
                  </div>
                  <Badge className="bg-white border-purple-200 text-purple-600">
                    {subject.code}
                  </Badge>
                </div>
              ))}
            </div>

            {/* Schedule */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Class Schedule</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {semester.timetablePeriods.map((period, index) => (
                  <div
                    key={index}
                    className="p-3 bg-purple-50/50 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    <p className="font-medium text-gray-900">{period.day}</p>
                    <p className="text-sm text-purple-600">{period.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}