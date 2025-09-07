"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Teacher } from "@/types/teacher";
import { fetchAllTeachers, TeachersApiError } from "@/utils/api/teacherApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Mail, User, AlertCircle, Eye } from "lucide-react";
import { TeachersTableSkeleton } from "./TeacherTableSkeleton";
import { useRouter } from "next/navigation";

const TeachersTable = () => {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load teachers data
  const loadTeachers = async () => {
    setLoading(true);
    setError(null);

    try {
      const teachersData = await fetchAllTeachers();
      setTeachers(teachersData);
      toast.success(`Successfully loaded ${teachersData.length} teachers`);
    } catch (err) {
      const errorMessage = err instanceof TeachersApiError 
        ? err.message 
        : 'An unexpected error occurred';
      
      setError(errorMessage);
      toast.error(`Failed to load teachers: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadTeachers();
  }, []);

  // Handle refresh button
  const handleRefresh = () => {
    loadTeachers();
  };

  // Get badge variant based on role
  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case "professor":
        return "default" as const;
      case "assistant professor":
        return "secondary" as const;
      case "associate professor":
        return "outline" as const;
      default:
        return "secondary" as const;
    }
  };

  const handleViewProfile = (teacherId: string) => {
    router.push(`/dashboard/teachers/${teacherId}`);
  };

  // Show loading skeleton
  if (loading) {
    return <TeachersTableSkeleton rows={6} />;
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-4">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">
            <div className="flex items-center justify-between">
              <span>Failed to load teachers: {error}</span>
              <Button onClick={handleRefresh} size="sm" variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Teachers</h2>
          <p className="text-muted-foreground">
            Manage and view all teachers in the CUH system
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Teachers Table */}
      <div className="border rounded-lg shadow-sm bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Name
                </div>
              </TableHead>
              <TableHead className="font-semibold">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </div>
              </TableHead>
              <TableHead className="font-semibold">Department</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <User className="w-8 h-8" />
                    <span>No teachers found</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              teachers.map((teacher) => (
                <TableRow key={teacher._id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-medium">
                    {teacher.name}
                  </TableCell>
                  <TableCell>
                    <a 
                      href={`mailto:${teacher.email}`} 
                      className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                      {teacher.email}
                    </a>
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {teacher.department}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={getRoleBadgeVariant(teacher.role)}
                      className="font-medium"
                    >
                      {teacher.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewProfile(teacher._id)}
                      className="hover:bg-gray-100"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer Stats */}
      <div className="text-sm text-muted-foreground flex justify-between items-center">
        <span className="font-medium">
          Total Teachers: <span className="text-foreground">{teachers.length}</span>
        </span>
        <span>
          Last updated: {new Date().toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default TeachersTable;
