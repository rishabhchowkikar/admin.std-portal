import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExamForm } from '@/types/exam';
import { 
  User, 
  Mail, 
  GraduationCap, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Ticket,
  BookOpen,
  Hash,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/lib/store';
import { holdStudentHallTicketAction, releaseStudentHallTicketAction } from '@/app/lib/examSlice';
import { toast } from 'sonner';

interface ExamFormDetailsDialogProps {
  examForm: ExamForm | null;
  isOpen: boolean;
  onClose: () => void;
  onVerify: (examFormId: string) => void;
  onGenerateHallTicket: (examForm: { examFormId: string; studentId: string; courseId: string; semester: number }) => void;
}

const ExamFormDetailsDialog: React.FC<ExamFormDetailsDialogProps> = ({
  examForm,
  isOpen,
  onClose,
  onVerify,
  onGenerateHallTicket
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isHoldingHallTicket, setIsHoldingHallTicket] = useState(false);
  const [isReleasingHallTicket, setIsReleasingHallTicket] = useState(false);
  const [hallTicketHeld, setHallTicketHeld] = useState(false);

  if (!examForm) return null;

  const getStatusBadge = (isVerified: boolean, isSubmitted: boolean) => {
    if (isVerified) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Verified</Badge>;
    }
    if (isSubmitted) {
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Pending Verification</Badge>;
    }
    return <Badge variant="outline">Not Submitted</Badge>;
  };

  const getHallTicketBadge = (isAvailable: boolean) => {
    if (hallTicketHeld) {
      return <Badge variant="destructive">Held - Verification Required</Badge>;
    }
    if (isAvailable) {
      return <Badge variant="default" className="bg-purple-100 text-purple-800">Available</Badge>;
    }
    return <Badge variant="outline">Not Available</Badge>;
  };

  const handleHoldHallTicket = async () => {
    setIsHoldingHallTicket(true);
    try {
      await dispatch(holdStudentHallTicketAction(examForm.studentId._id)).unwrap();
      setHallTicketHeld(true);
      toast.success('Hall ticket held successfully - Student needs additional verification');
    } catch (error: any) {
      toast.error(error || 'Failed to hold hall ticket');
    } finally {
      setIsHoldingHallTicket(false);
    }
  };

  const handleReleaseHallTicket = async () => {
    setIsReleasingHallTicket(true);
    try {
      await dispatch(releaseStudentHallTicketAction({
        studentId: examForm.studentId._id,
        courseId: examForm.studentId.courseId._id,
        semester: examForm.semester
      })).unwrap();
      setHallTicketHeld(false);
      toast.success('Hall ticket released successfully - Student can now access their hall ticket');
    } catch (error: any) {
      toast.error(error || 'Failed to release hall ticket');
    } finally {
      setIsReleasingHallTicket(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Exam Form Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Student Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Name:</span>
                  <span>{examForm.studentId.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Email:</span>
                  <span>{examForm.studentId.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Roll No:</span>
                  <span>{examForm.studentId.rollno}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Course:</span>
                  <span>{examForm.studentId.courseId.name}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <div>Code: {examForm.studentId.courseId.code}</div>
                  <div>Department: {examForm.studentId.courseId.department}</div>
                  <div>School: {examForm.studentId.courseId.school}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Exam Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Exam Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Semester:</span>
                  <Badge variant="outline">Semester {examForm.semester}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Session:</span>
                  <span>{examForm.currentSession}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Type:</span>
                  <Badge variant="secondary">{examForm.type}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Month:</span>
                  <span>{examForm.month}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Registration Date:</span>
                  <span>{format(new Date(examForm.examRegistration.registrationDate), 'MMM dd, yyyy HH:mm')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  {getStatusBadge(examForm.examRegistration.isVerified, examForm.examRegistration.isSubmitted)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Hall Ticket:</span>
                  {getHallTicketBadge(examForm.examRegistration.hallTicketAvailable)}
                </div>
              </div>
            </div>
          </div>

          {/* Subjects */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Subjects ({examForm.subjects.length})
            </h3>
            <div className="space-y-3">
              {examForm.subjects.map((subject, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 flex items-center gap-2">
                      <div className="font-medium">{subject.subjectId.name}</div>
                      <div className="text-sm text-gray-600">({subject.subjectId.code})</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {!examForm.examRegistration.isVerified && (
              <Button
                onClick={() => onVerify(examForm._id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Verify Form
              </Button>
            )}
            {examForm.examRegistration.isVerified && !examForm.examRegistration.hallTicketAvailable && (
              <Button
                onClick={() => onGenerateHallTicket({
                  examFormId: examForm._id,
                  studentId: examForm.studentId._id,
                  courseId: examForm.studentId.courseId._id,
                  semester: examForm.semester
                })}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Ticket className="h-4 w-4" />
                Generate Hall Ticket
              </Button>
            )}
            {examForm.examRegistration.isVerified && examForm.examRegistration.hallTicketAvailable && !hallTicketHeld && (
              <Button
                onClick={handleHoldHallTicket}
                disabled={isHoldingHallTicket}
                variant="destructive"
              >
                {isHoldingHallTicket ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <AlertTriangle className="h-4 w-4 mr-2" />
                )}
                Hold Hall Ticket
              </Button>
            )}
            {examForm.examRegistration.isVerified && hallTicketHeld && (
              <Button
                onClick={handleReleaseHallTicket}
                disabled={isReleasingHallTicket}
                className="bg-green-600 hover:bg-green-700"
              >
                {isReleasingHallTicket ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Release Hall Ticket
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExamFormDetailsDialog;
