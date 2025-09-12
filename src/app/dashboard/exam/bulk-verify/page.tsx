'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/lib/store';
import { 
  fetchExamForms, 
  bulkVerifyExamFormsAction,
  enableStudentHallTicketAction,
  bulkEnableHallTicketsAction,
  holdStudentHallTicketAction
} from '@/app/lib/examSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  CheckCircle, 
  Users, 
  GraduationCap, 
  Calendar,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Course {
  _id: string;
  name: string;
  code: string;
  department: string;
  school: string;
}

const BulkVerifyPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { examForms, loading, error } = useSelector((state: RootState) => state.exam);
  
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [selectedSession, setSelectedSession] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isEnablingHallTicket, setIsEnablingHallTicket] = useState(false);
  const [hallTicketStates, setHallTicketStates] = useState<Record<string, { enabled: boolean; held: boolean }>>({});

  // Get unique courses from exam forms
  const courses = React.useMemo(() => {
    const courseMap = new Map<string, Course>();
    examForms.forEach(form => {
      const course = form.studentId.courseId;
      courseMap.set(course._id, course);
    });
    return Array.from(courseMap.values());
  }, [examForms]);

  // Get unique semesters from exam forms
  const semesters = React.useMemo(() => {
    const semesterSet = new Set<number>();
    examForms.forEach(form => {
      semesterSet.add(form.semester);
    });
    return Array.from(semesterSet).sort();
  }, [examForms]);

  // Get unique sessions from exam forms
  const sessions = React.useMemo(() => {
    const sessionSet = new Set<string>();
    examForms.forEach(form => {
      sessionSet.add(form.currentSession);
    });
    return Array.from(sessionSet).sort();
  }, [examForms]);

  // Get current academic session (you can modify this logic as needed)
  const getCurrentAcademicSession = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 0-based month
    
    // Assuming academic year starts in July
    if (month >= 7) {
      return `${year}-${year + 1}`;
    } else {
      return `${year - 1}-${year}`;
    }
  };

  // Helper function to get hall ticket state for a student
  const getHallTicketState = (studentId: string) => {
    const state = hallTicketStates[studentId];
    if (state) {
      return state;
    }
    // Default state - if hall ticket is available, consider it enabled
    return { enabled: false, held: false };
  };

  // Helper function to update hall ticket state
  const updateHallTicketState = (studentId: string, updates: Partial<{ enabled: boolean; held: boolean }>) => {
    setHallTicketStates(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        enabled: false,
        held: false,
        ...updates
      }
    }));
  };

  // Filter exam forms based on selection
  const filteredForms = React.useMemo(() => {
    if (!selectedCourse || !selectedSemester || !selectedSession) return [];
    
    return examForms.filter(form => 
      form.studentId.courseId._id === selectedCourse._id &&
      form.semester === selectedSemester &&
      form.currentSession === selectedSession &&
      !form.examRegistration.isVerified // Only show unverified forms
    );
  }, [examForms, selectedCourse, selectedSemester, selectedSession]);

  useEffect(() => {
    dispatch(fetchExamForms());
  }, [dispatch]);

  useEffect(() => {
    // Set default session to current academic session
    if (sessions.length > 0 && !selectedSession) {
      const currentSession = getCurrentAcademicSession();
      if (sessions.includes(currentSession)) {
        setSelectedSession(currentSession);
      } else {
        setSelectedSession(sessions[0]);
      }
    }
  }, [sessions, selectedSession]);

  const handleBulkVerify = async () => {
    if (!selectedCourse || !selectedSemester || !selectedSession) {
      toast.error('Please select course, semester, and session');
      return;
    }

    if (filteredForms.length === 0) {
      toast.error('No unverified forms found for the selected criteria');
      return;
    }

    setIsVerifying(true);
    try {
      await dispatch(bulkVerifyExamFormsAction({
        courseId: selectedCourse._id,
        semester: selectedSemester,
        currentSession: selectedSession
      })).unwrap();
      
      toast.success(`Successfully verified ${filteredForms.length} exam forms`);
      
      // Reset selections
      setSelectedCourse(null);
      setSelectedSemester(null);
      setSelectedSession('');
    } catch (error: any) {
      toast.error(error || 'Failed to bulk verify exam forms');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCourseChange = (courseId: string) => {
    const course = courses.find(c => c._id === courseId);
    setSelectedCourse(course || null);
  };

  const handleSemesterChange = (semester: string) => {
    setSelectedSemester(parseInt(semester));
  };

  const handleSessionChange = (session: string) => {
    setSelectedSession(session);
  };

  const handleEnableStudentHallTicket = async (studentId: string) => {
    if (!selectedCourse || !selectedSemester) {
      toast.error('Please select course and semester');
      return;
    }

    setIsEnablingHallTicket(true);
    try {
      await dispatch(enableStudentHallTicketAction({
        studentId,
        courseId: selectedCourse._id,
        semester: selectedSemester
      })).unwrap();
      
      // Update local state
      updateHallTicketState(studentId, { enabled: true, held: false });
      
      toast.success('Hall ticket enabled successfully');
    } catch (error: any) {
      toast.error(error || 'Failed to enable hall ticket');
    } finally {
      setIsEnablingHallTicket(false);
    }
  };

  const handleBulkEnableHallTickets = async () => {
    if (!selectedCourse || !selectedSemester) {
      toast.error('Please select course and semester');
      return;
    }

    setIsEnablingHallTicket(true);
    try {
      await dispatch(bulkEnableHallTicketsAction({
        courseId: selectedCourse._id,
        semester: selectedSemester
      })).unwrap();
      
      // Update local state for all filtered forms
      filteredForms.forEach(form => {
        updateHallTicketState(form.studentId._id, { enabled: true, held: false });
      });
      
      toast.success('Hall tickets enabled successfully for all eligible students');
    } catch (error: any) {
      toast.error(error || 'Failed to enable hall tickets');
    } finally {
      setIsEnablingHallTicket(false);
    }
  };


  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/exam">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Bulk Verification</h1>
        </div>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Error loading exam data: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/exam">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Bulk Verification</h1>
          <p className="text-gray-600 mt-1">
            Verify multiple exam forms at once by course, semester, and session
          </p>
        </div>
      </div>

      {/* Selection Form */}
      <Card className='gap-2'>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Select Criteria for Bulk Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-3  grid-cols-1 sm:grid-cols-2">
            {/* Course Selection */}
            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <Select value={selectedCourse?._id || ''} onValueChange={handleCourseChange}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent className='w-full'>
                  {courses.map((course) => (
                    <SelectItem key={course._id} value={course._id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{course.name}</span>
                        <span className="text-sm text-gray-500">{course.code} - {course.department}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Semester Selection */}
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select 
                value={selectedSemester?.toString() || ''} 
                onValueChange={handleSemesterChange}
                disabled={!selectedCourse}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent className='w-full'>
                  {semesters.map((semester) => (
                    <SelectItem key={semester} value={semester.toString()}>
                      Semester {semester}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Session Selection */}
            <div className="space-y-2">
              <Label htmlFor="session">Academic Session</Label>
              <Select 
                value={selectedSession} 
                onValueChange={handleSessionChange}
                disabled={!selectedCourse || !selectedSemester}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>
                <SelectContent className='w-full'>
                  {sessions.map((session) => (
                    <SelectItem key={session} value={session}>
                      {session}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preview */}
          {selectedCourse && selectedSemester && selectedSession && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Verification Preview</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">
                    <strong>Course:</strong> {selectedCourse.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">
                    <strong>Semester:</strong> {selectedSemester}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">
                    <strong>Session:</strong> {selectedSession}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm">
                  <strong>Forms to verify:</strong> {filteredForms.length}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              onClick={handleBulkVerify}
              disabled={!selectedCourse || !selectedSemester || !selectedSession || filteredForms.length === 0 || isVerifying}
              className="bg-green-600 hover:bg-green-700"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify {filteredForms.length} Forms
                </>
              )}
            </Button>
            <Button
              onClick={handleBulkEnableHallTickets}
              disabled={!selectedCourse || !selectedSemester || isEnablingHallTicket}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isEnablingHallTicket ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enabling Hall Tickets...
                </>
              ) : (
                <>
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Enable All Hall Tickets
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Forms List */}
      {selectedCourse && selectedSemester && selectedSession && (
        <Card>
          <CardHeader>
            <CardTitle>
              Forms to be Verified ({filteredForms.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredForms.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">All forms already verified</h3>
                <p className="text-gray-500">No unverified forms found for the selected criteria.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredForms.map((form) => (
                  <div key={form._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{form.studentId.name}</div>
                        <div className="text-sm text-gray-500">
                          {form.studentId.email} • Roll No: {form.studentId.rollno}
                        </div>
                        <div className="flex gap-2 mt-1">
                          {(() => {
                            const hallTicketState = getHallTicketState(form.studentId._id);
                            if (hallTicketState.enabled) {
                              return <Badge variant="success">Hall Ticket Enabled</Badge>;
                            } else if (form.examRegistration.hallTicketAvailable) {
                              return <Badge variant="default" className="bg-purple-100 text-purple-800">Hall Ticket Available</Badge>;
                            } else {
                              return <Badge variant="secondary">Hall Ticket Not Available</Badge>;
                            }
                          })()}
                          <Badge variant="secondary">Pending Verification</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {(() => {
                        const hallTicketState = getHallTicketState(form.studentId._id);
                        
                        // Show Enable button if not enabled
                        if (!hallTicketState.enabled) {
                          return (
                            <Button
                              size="sm"
                              onClick={() => handleEnableStudentHallTicket(form.studentId._id)}
                              disabled={isEnablingHallTicket}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {isEnablingHallTicket ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <GraduationCap className="h-4 w-4 mr-2" />
                                  Enable Hall Ticket
                                </>
                              )}
                            </Button>
                          );
                        }
                        
                        return null;
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        )}
      </div>
  );
};

export default BulkVerifyPage;
