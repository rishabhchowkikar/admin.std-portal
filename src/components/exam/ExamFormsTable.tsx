import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExamForm } from '@/types/exam';
import { CheckCircle, Clock, Ticket, Eye, User, Mail, GraduationCap, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface ExamFormsTableProps {
  examForms: ExamForm[];
  loading?: boolean;
  onVerify: (examFormId: string) => void;
  onGenerateHallTicket: (examForm: { examFormId: string; studentId: string; courseId: string; semester: number }) => void;
  onViewDetails: (examForm: ExamForm) => void;
}

const ExamFormsTable: React.FC<ExamFormsTableProps> = ({
  examForms,
  loading,
  onVerify,
  onGenerateHallTicket,
  onViewDetails
}) => {
  const getStatusBadge = (isVerified: boolean, isSubmitted: boolean) => {
    if (isVerified) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Verified</Badge>;
    }
    if (isSubmitted) {
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Pending</Badge>;
    }
    return <Badge variant="outline">Not Submitted</Badge>;
  };

  const getHallTicketBadge = (isAvailable: boolean) => {
    if (isAvailable) {
      return <Badge variant="default" className="bg-purple-100 text-purple-800">Available</Badge>;
    }
    return <Badge variant="outline">Not Available</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Exam Forms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (examForms.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Exam Forms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No exam forms found</h3>
            <p className="text-gray-500">No exam forms match your current filters.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='shadow-none border-none bg-transparent'>
      <CardHeader className='px-0 py-0'>
        <CardTitle>Submitted Exam Forms ({examForms.length})</CardTitle>
      </CardHeader>
      <CardContent className='px-0'>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>Type</TableHead>
                {/* <TableHead>Subjects</TableHead>x */}
                <TableHead>Status</TableHead>
                <TableHead>Hall Ticket</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {examForms.map((form) => (
                <TableRow key={form._id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{form.studentId.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Mail className="h-3 w-3" />
                        {form.studentId.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        Roll No: {form.studentId.rollno}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{form.studentId.courseId.name}</div>
                      <div className="text-sm text-gray-500">{form.studentId.courseId.code}</div>
                      <div className="text-sm text-gray-500">{form.studentId.courseId.department}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Semester {form.semester}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{form.currentSession}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{form.type}</Badge>
                  </TableCell>
                  {/* <TableCell>
                    <div className="space-y-1">
                      {form.subjects.map((subject, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium">{subject.subjectId.code}</div>
                          <div className="text-gray-500 truncate max-w-[150px]">
                            {subject.subjectId.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TableCell> */}
                  <TableCell>
                    {getStatusBadge(form.examRegistration.isVerified, form.examRegistration.isSubmitted)}
                  </TableCell>
                  <TableCell>
                    {getHallTicketBadge(form.examRegistration.hallTicketAvailable)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(form.examRegistration.registrationDate), 'MMM dd, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(form)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {!form.examRegistration.isVerified && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onVerify(form._id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamFormsTable;
