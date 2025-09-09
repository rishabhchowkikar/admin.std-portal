import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User, 
  Receipt,
  GraduationCap
} from 'lucide-react';

interface StudentFeeData {
  student: {
    _id: string;
    name: string;
    email: string;
    rollno: number;
    course: {
      _id: string;
      name: string;
      code: string;
      department: string;
      school: string;
      duration: number;
    };
  };
  fees: Array<{
    _id: string;
    studentId: string;
    courseId: {
      _id: string;
      name: string;
      code: string;
      department: string;
      school: string;
    };
    feeType: string;
    academicYear: string;
    amount: number;
    dueDate: string;
    paymentStatus: string;
    razorpayOrderId: string;
    paymentMethod: string;
    description: string;
    lateFee: number;
    discount: number;
    finalAmount: number;
    receiptNumber: string;
    createdAt: string;
    updatedAt: string;
    paidDate?: string;
    razorpayPaymentId?: string;
    transactionId?: string;
  }>;
}

interface PaymentDetailDialogProps {
  payment: StudentFeeData | any;
  isOpen: boolean;
  onClose: () => void;
  loading?: boolean;
}

export function PaymentDetailDialog({ 
  payment, 
  isOpen, 
  onClose, 
  loading = false 
}: PaymentDetailDialogProps) {
  if (!payment) return null;

  // Check if it's the new student fee data structure
  const isStudentFeeData = payment.student && payment.fees;
  const student = isStudentFeeData ? payment.student : payment.userId || payment.studentId;
  const fees = isStudentFeeData ? payment.fees : [payment];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default" className="bg-green-100 text-green-800">Paid</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Student Payment Details
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading payment details...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Student Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Student Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Name</div>
                    <div className="text-lg font-semibold">{student?.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Roll Number</div>
                    <div className="text-lg font-semibold">{student?.rollno}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="text-sm">{student?.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Course</div>
                    <div className="text-sm">
                      {student?.course?.name || student?.courseId?.name} 
                      ({student?.course?.code || student?.courseId?.code})
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fees Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Fee Payments ({fees.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fees.map((fee: any, index: number) => (
                    <div key={fee._id || index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Fee #{index + 1}</span>
                          {getStatusBadge(fee.paymentStatus)}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            ₹{(fee.finalAmount || fee.amount || 0).toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {fee.academicYear}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Due Date</div>
                          <div>{fee.dueDate ? formatDate(fee.dueDate) : 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Paid Date</div>
                          <div>{fee.paidDate ? formatDate(fee.paidDate) : 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Receipt Number</div>
                          <div className="font-mono text-xs">{fee.receiptNumber || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Payment Method</div>
                          <div>{fee.paymentMethod || 'N/A'}</div>
                        </div>
                      </div>
                      
                      {fee.description && (
                        <div className="mt-3">
                          <div className="text-sm text-muted-foreground">Description</div>
                          <div className="text-sm">{fee.description}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}