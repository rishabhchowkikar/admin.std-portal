"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Student } from "@/types/student";
import { 
  fetchAllStudents, 
  StudentsApiError, 
  approveUpdatePermission, 
  rejectUpdatePermission 
} from "@/utils/api/studentApi";
import { createColumns } from "./Columns";
import { DataTable } from "./DataTable";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, Users, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ApprovalDialog from "./ApprovalDialog";


const StudentsTableSkeleton = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-10 w-24" />
    </div>
    <div className="border rounded-lg p-4">
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const StudentsTable = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // NEW - Approval Dialog State
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadStudents = async () => {
    setLoading(true);
    setError(null);

    try {
      const studentsData = await fetchAllStudents();
      setStudents(studentsData);
      toast.success(`Successfully loaded ${studentsData.length} students`);
    } catch (err) {
      const errorMessage = err instanceof StudentsApiError
        ? err.message
        : 'An unexpected error occurred';

      setError(errorMessage);
      toast.error(`Failed to load students: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleRefresh = () => {
    loadStudents();
  };

  // NEW - Handle Approval Action
  const handleApprovalAction = (student: Student) => {
    setSelectedStudent(student);
    setApprovalDialogOpen(true);
  };

  // NEW - Handle Approve
  const handleApprove = async (studentId: string, comments?: string) => {
    setIsProcessing(true);
    try {
      await approveUpdatePermission(studentId, comments);
      
      // Update the student in the local state
      setStudents(prev => prev.map(student => 
        student._id === studentId 
          ? { ...student, updatePermissionStatus: 'approved' }
          : student
      ));
      
      setApprovalDialogOpen(false);
      setSelectedStudent(null);
      toast.success('Permission request approved successfully!');
    } catch (error) {
      const errorMessage = error instanceof StudentsApiError 
        ? error.message 
        : 'Failed to approve permission request';
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // NEW - Handle Reject
  const handleReject = async (studentId: string, comments: string) => {
    setIsProcessing(true);
    try {
      await rejectUpdatePermission(studentId, comments);
      
      // Update the student in the local state
      setStudents(prev => prev.map(student => 
        student._id === studentId 
          ? { ...student, updatePermissionStatus: 'rejected' }
          : student
      ));
      
      setApprovalDialogOpen(false);
      setSelectedStudent(null);
      toast.success('Permission request rejected successfully!');
    } catch (error) {
      const errorMessage = error instanceof StudentsApiError 
        ? error.message 
        : 'Failed to reject permission request';
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Create columns with approval action handler
  const columns = createColumns(handleApprovalAction);

  if (loading) {
    return <StudentsTableSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">
            <div className="flex items-center justify-between">
              <span>Failed to load students: {error}</span>
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
          <h2 className="text-3xl font-bold tracking-tight">Students</h2>
          <p className="text-muted-foreground">
            Manage and view all students in the CUH system
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between gap-2 w-full">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Total Students</span>
            </span>
            <p className="text-2xl font-bold text-blue-600">{students.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center w-full gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <span className="font-medium">Hostel Allocated</span>
            </span>
            <p className="text-2xl font-bold text-green-600">
              {students.filter(s => s.hostel_allocated).length}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2">
           <span className="flex items-center gap-2 w-full">
             <Users className="h-5 w-5 text-orange-600" />
            <span className="font-medium">Hostel Applicants</span>
           </span>
            <p className="text-2xl font-bold text-orange-600">
              {students.filter(s => s.want_to_apply_for_hostel && !s.hostel_allocated).length}
            </p>
          </div>
        </div>
        {/* NEW - Permission Requests Card */}
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-2 w-full">
              <AlertCircle className="h-5 w-5 text-purple-600" />
              <span className="font-medium">Pending Requests</span>
            </span>
            <p className="text-2xl font-bold text-purple-600">
              {students.filter(s => s.updatePermissionStatus === 'requested').length}
            </p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-lg">
        <DataTable columns={columns} data={students} />
      </div>

      {/* Footer */}
      <div className="text-sm text-muted-foreground flex justify-between items-center">
        <span>
          Showing <span className="font-medium">{students.length}</span> students
        </span>
        <span>
          Last updated: {new Date().toLocaleString()}
        </span>
      </div>

      {/* NEW - Approval Dialog */}
      <ApprovalDialog
        open={approvalDialogOpen}
        onOpenChange={setApprovalDialogOpen}
        student={selectedStudent}
        onApprove={handleApprove}
        onReject={handleReject}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default StudentsTable;
