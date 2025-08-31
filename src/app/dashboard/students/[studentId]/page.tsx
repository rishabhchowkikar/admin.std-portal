"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { getStudentDetail, StudentsApiError } from "@/utils/api/studentApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  GraduationCap,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Building,
  BookOpen,
  Droplets,
  Flag,
  Heart,
  UserCheck,
  Home,
} from "lucide-react";

const StudentDetailSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-4">
      <Skeleton className="h-10 w-20" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-32 w-32 rounded-full mx-auto" />
            <div className="text-center space-y-2">
              <Skeleton className="h-6 w-40 mx-auto" />
              <Skeleton className="h-4 w-32 mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2 space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

const StudentDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const studentId = params.studentId as string;
  
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        setError(null);
        const studentData = await getStudentDetail(studentId);
        setStudent(studentData);
      } catch (err) {
        const errorMessage = err instanceof StudentsApiError
          ? err.message
          : 'Failed to fetch student details';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudent();
    }
  }, [studentId]);

  const getPermissionStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'requested':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPermissionStatusVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'requested':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getCategoryVariant = (category: string) => {
    switch (category) {
      case "General":
        return "default";
      case "OBC":
        return "secondary";
      case "SC":
        return "outline";
      case "ST":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <StudentDetailSkeleton />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">
            {error || 'Student not found'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{student.name}</h1>
          <p className="text-muted-foreground">Roll No: {student.rollno}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Avatar className="h-32 w-32 mx-auto mb-4">
                  <AvatarImage src={student.photo} alt={student.name} />
                  <AvatarFallback className="text-2xl">
                    {student.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{student.name}</h2>
                <p className="text-muted-foreground">{student.email}</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Roll Number:</span>
                  <Badge variant="outline">{student.rollno}</Badge>
                </div>
                
                {student.category && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Category:</span>
                    <Badge variant={getCategoryVariant(student.category)}>
                      {student.category}
                    </Badge>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Gender:</span>
                  <span className="text-sm">{student.gender || 'Not specified'}</span>
                </div>

                {student.bloodGroup && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Droplets className="h-3 w-3" />
                      Blood Group:
                    </span>
                    <Badge variant="outline">{student.bloodGroup}</Badge>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <Flag className="h-3 w-3" />
                    Nationality:
                  </span>
                  <span className="text-sm">{student.nationality || 'Not specified'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                  </div>
                </div>

                {student.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{student.phone}</p>
                    </div>
                  </div>
                )}

                {student.altPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Alt Phone</p>
                      <p className="text-sm text-muted-foreground">{student.altPhone}</p>
                    </div>
                  </div>
                )}

                {student.dob && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Date of Birth</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(student.dob).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {student.address && (
                  <div className="flex items-start gap-3 md:col-span-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">{student.address}</p>
                    </div>
                  </div>
                )}

                {student.aadharNumber && (
                  <div className="flex items-center gap-3">
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Aadhar Number</p>
                      <p className="text-sm text-muted-foreground">{student.aadharNumber}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Family Information */}
          {(student.fatherName || student.motherName) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Family Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {student.fatherName && (
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Father's Name</p>
                        <p className="text-sm text-muted-foreground">{student.fatherName}</p>
                      </div>
                    </div>
                  )}

                  {student.motherName && (
                    <div className="flex items-center gap-3">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Mother's Name</p>
                        <p className="text-sm text-muted-foreground">{student.motherName}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Academic Information */}
          {student.academicInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Course</p>
                      <p className="text-sm text-muted-foreground">{student.academicInfo.courseName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Course Code</p>
                      <p className="text-sm text-muted-foreground">{student.academicInfo.courseCode}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Department</p>
                      <p className="text-sm text-muted-foreground">{student.academicInfo.department}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">School</p>
                      <p className="text-sm text-muted-foreground">{student.academicInfo.school}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Duration</p>
                      <p className="text-sm text-muted-foreground">{student.academicInfo.courseDuration} years</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Total Semesters</p>
                      <p className="text-sm text-muted-foreground">{student.academicInfo.totalSemesters}</p>
                    </div>
                  </div>
                </div>

                {/* {student.academicInfo.assignedTeachers && student.academicInfo.assignedTeachers.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Assigned Teachers</p>
                    <div className="space-y-2">
                      {student.academicInfo.assignedTeachers.map((teacher: any) => (
                        <div key={teacher._id} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm">{teacher.name}</span>
                          <span className="text-xs text-muted-foreground">{teacher.email}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )} */}
              </CardContent>
            </Card>
          )}

          {/* Hostel Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Hostel Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Hostel Status:</span>
                  <Badge variant={student.hostel_allocated ? "default" : "secondary"}>
                    {student.hostel_allocated ? "Allocated" : "Not Allocated"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Application Status:</span>
                  <Badge variant={student.want_to_apply_for_hostel ? "default" : "outline"}>
                    {student.want_to_apply_for_hostel ? "Applied" : "Not Applied"}
                  </Badge>
                </div>

                {student.isPwd !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">PWD Status:</span>
                    <Badge variant={student.isPwd ? "default" : "outline"}>
                      {student.isPwd ? "Yes" : "No"}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Permission Status */}
          {student.permissionDetails && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getPermissionStatusIcon(student.permissionDetails.status)}
                  Permission Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current Status:</span>
                  <Badge variant={getPermissionStatusVariant(student.permissionDetails.status)}>
                    {student.permissionDetails.status.charAt(0).toUpperCase() + 
                     student.permissionDetails.status.slice(1)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Can Update:</span>
                  <Badge variant={student.permissionDetails.canUpdate ? "default" : "secondary"}>
                    {student.permissionDetails.canUpdate ? "Yes" : "No"}
                  </Badge>
                </div>

                {student.permissionDetails.requestDate && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Request Date</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(student.permissionDetails.requestDate).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {student.permissionDetails.approvedDate && (
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Approved Date</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(student.permissionDetails.approvedDate).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {student.permissionDetails.rejectedDate && (
                  <div className="flex items-start gap-3">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Rejected Date</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(student.permissionDetails.rejectedDate).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {student.permissionDetails.adminComments && (
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Admin Comments</p>
                      <p className="text-sm text-muted-foreground">
                        {student.permissionDetails.adminComments}
                      </p>
                    </div>
                  </div>
                )}

                {student.permissionDetails.requestReason && (
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Request Reason</p>
                      <p className="text-sm text-muted-foreground">
                        {student.permissionDetails.requestReason}
                      </p>
                    </div>
                  </div>
                )}

                {student.permissionDetails.changesSummary && (
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Changes Summary</p>
                      <p className="text-sm text-muted-foreground">
                        {student.permissionDetails.changesSummary}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Account Information */}
          {/* <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(student.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Account Age</p>
                    <p className="text-sm text-muted-foreground">{student.accountAge} days</p>
                  </div>
                </div>

                {student.profileCompletionStatus && (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Profile Status</p>
                      <Badge variant={student.profileCompletionStatus === 'complete' ? 'default' : 'secondary'}>
                        {student.profileCompletionStatus}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage;
