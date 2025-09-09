import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Download, 
  Filter, 
  MoreHorizontal, 
  Search,
  User,
  Building,
  GraduationCap,
  Calendar,
  Receipt,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { getPaymentDetailsStudentId } from '@/utils/api/financeApi';

interface PaymentRecord {
  _id: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
    courseId: string | {
      _id: string;
      name: string;
      code: string;
      department: string;
      school: string;
    };
    rollno: number;
    phone?: string;
    address?: string;
  };
  studentId?: {
    _id: string;
    name: string;
    email: string;
    courseId: string | {
      _id: string;
      name: string;
      code: string;
      department: string;
      school: string;
    };
    rollno: number;
    phone?: string;
    address?: string;
  };
  courseId?: {
    _id: string;
    name: string;
    code: string;
    department: string;
    school: string;
  };
  roomType?: string;
  roomNumber?: string;
  floor?: string;
  hostelName?: string;
  allocated?: boolean;
  academicYear: string;
  paymentStatus: string;
  paymentAmount?: number;
  amount?: number;
  finalAmount?: number;
  paymentDate?: string;
  paidDate?: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  receiptNumber?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
  allocationDate?: string;
  buildingId?: string;
  roomId?: string;
  adminNotified?: boolean;
}

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

interface PaymentReportsTableProps {
  title: string;
  payments: PaymentRecord[];
  type: 'hostel' | 'course';
  loading?: boolean;
  onViewDetails?: (studentId: string) => void;
  showStudentDetails?: boolean; 
}

export function PaymentReportsTable({ 
  title,
  payments, 
  type,
  loading = false,
  onViewDetails,
  showStudentDetails = false
}: PaymentReportsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentFeeData | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [loadingStudentDetails, setLoadingStudentDetails] = useState(false);
  const [studentDetailsError, setStudentDetailsError] = useState<string | null>(null);

  const allPayments = payments.map(payment => ({ ...payment, type }));

  const filteredPayments = allPayments.filter(payment => {
    const matchesSearch = 
      payment.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.studentId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.razorpayOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || payment.paymentStatus === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const fetchStudentDetails = async (studentId: string, academicYear?: string) => {
    try {
      setLoadingStudentDetails(true);
      setStudentDetailsError(null);
      const response = await getPaymentDetailsStudentId(studentId);
      const studentData = response.data;
      
      setSelectedStudent(studentData);
      if (academicYear) {
        setSelectedYear(academicYear);
      } else if (studentData.fees.length > 0) {
        // Set to the most recent academic year by default
        const years = studentData.fees.map((fee: any) => fee.academicYear).sort().reverse();
        setSelectedYear(years[0]);
      }
    } catch (error: any) {
      setStudentDetailsError(error.message || 'Failed to fetch student details');
      setSelectedStudent(null);
    } finally {
      setLoadingStudentDetails(false);
    }
  };

  const handleViewDetails = (studentId: string, academicYear?: string) => {
    fetchStudentDetails(studentId, academicYear);
  };

  const getFilteredFees = () => {
    if (!selectedStudent) return [];
    if (!selectedYear) return selectedStudent.fees;
    return selectedStudent.fees.filter((fee: any) => fee.academicYear === selectedYear);
  };

  const getAvailableYears = () => {
    if (!selectedStudent) return [];
    return [...new Set(selectedStudent.fees.map((fee: any) => fee.academicYear))].sort().reverse();
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

  const getPaymentTypeIcon = (type: string) => {
    return type === 'hostel' ? <Building className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Student Name', 'Roll No', 'Amount', 'Status', 'Payment Date', 'Academic Year', 'Receipt Number/Payment ID', 'Transaction ID', 'Order ID'],
      ...filteredPayments.map(payment => [
        payment.userId?.name || payment.studentId?.name || 'N/A',
        payment.userId?.rollno || payment.studentId?.rollno || 'N/A',
        payment.paymentAmount || payment.finalAmount || payment.amount || 0,
        payment.paymentStatus,
        payment.paymentDate || payment.paidDate || 'N/A',
        payment.academicYear,
        payment.receiptNumber || payment.razorpayPaymentId || 'N/A',
        payment.transactionId || 'N/A',
        payment.razorpayOrderId || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading {title.toLowerCase()}...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{title}</CardTitle>
            <Button onClick={exportToCSV} size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, order ID, or receipt number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Status: {filterStatus === 'all' ? 'All' : filterStatus}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterStatus('all')}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('paid')}>Paid</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('pending')}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('overdue')}>Overdue</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Academic Year</TableHead>
                <TableHead>Receipt/Payment ID</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No payments found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => (
                  <TableRow key={payment._id}                               onClick={() => {
                    const studentId = payment.userId?._id || payment.studentId?._id;
                    const academicYear = payment.academicYear;
                    if (studentId) {
                      handleViewDetails(studentId, academicYear);
                    }
                  }}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {payment.userId?.name || payment.studentId?.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Roll No: {payment.userId?.rollno || payment.studentId?.rollno}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        ₹{(payment.paymentAmount || payment.finalAmount || payment.amount || 0).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(payment.paymentStatus)}
                    </TableCell>
                    <TableCell>
                      {payment.paymentDate || payment.paidDate ? 
                        formatDate(payment.paymentDate || payment.paidDate!) : 
                        'N/A'
                      }
                    </TableCell>
                    <TableCell>
                      {payment.academicYear}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-mono">
                        {payment.receiptNumber || payment.razorpayPaymentId || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-mono">
                        {payment.transactionId || 'N/A'}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm font-mono">
                        {payment.razorpayOrderId || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {type === 'course' && (
                            <DropdownMenuItem 
                            >
                              <User className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                          )}
                          {type !== 'course' && (
                            <DropdownMenuItem disabled>
                              <User className="h-4 w-4 mr-2" />
                              View Details (Course only)
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredPayments.length} of {allPayments.length} payments
        </div>
      </CardContent>
    </Card>

    {/* Student Details Section - Only show for Course tab */}
    {type === 'course' && showStudentDetails && (
      <>
        {!selectedStudent && !loadingStudentDetails && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <div className="text-center">
                  <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Please select a student to view detailed transaction information</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {loadingStudentDetails && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-muted-foreground">Loading student details...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {studentDetailsError && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-600 font-medium">Error loading student details</p>
                  <p className="text-sm text-muted-foreground mt-1">{studentDetailsError}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {selectedStudent && type === "course" && (
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Student Transaction Details
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedStudent.student.name} (Roll No: {selectedStudent.student.rollno})
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedStudent(null)}
            >
              Close
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Student Name</p>
              <p className="font-medium">{selectedStudent.student.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="font-medium">{selectedStudent.student.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Course</p>
              <p className="font-medium">{selectedStudent.student.course.name}</p>
              <p className="text-sm text-muted-foreground">{selectedStudent.student.course.code}</p>
            </div>
          </div>

          {getAvailableYears().length > 1 && (
            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Filter by Academic Year</label>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedYear === '' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedYear('')}
                >
                  All Years
                </Button>
                {getAvailableYears().map(year => (
                  <Button
                    key={year}
                    variant={selectedYear === year ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedYear(year)}
                  >
                    {year}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Transaction Details</h3>
            {getFilteredFees().length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No transactions found for the selected year
              </div>
            ) : (
              <div className="space-y-4">
                {getFilteredFees().map((fee) => (
                  <Card key={fee._id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Academic Year</span>
                          </div>
                          <p className="font-medium">{fee.academicYear}</p>
                          
                          <div className="flex items-center gap-2">
                            <Receipt className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Receipt Number</span>
                          </div>
                          <p className="font-mono text-sm">{fee.receiptNumber}</p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Payment Details</span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm">
                              <span className="text-muted-foreground">Amount: </span>
                              <span className="font-medium">₹{fee.finalAmount.toLocaleString()}</span>
                            </p>
                            <p className="text-sm">
                              <span className="text-muted-foreground">Method: </span>
                              <span className="font-medium capitalize">{fee.paymentMethod}</span>
                            </p>
                            <p className="text-sm">
                              <span className="text-muted-foreground">Status: </span>
                              {fee.paymentStatus === 'paid' ? (
                                <Badge variant="default" className="bg-green-100 text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Paid
                                </Badge>
                              ) : (
                                <Badge variant="secondary">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {fee.paymentStatus}
                                </Badge>
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Transaction Info</span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm">
                              <span className="text-muted-foreground">Order ID: </span>
                              <span className="font-mono text-xs">{fee.razorpayOrderId}</span>
                            </p>
                            {fee.razorpayPaymentId && (
                              <p className="text-sm">
                                <span className="text-muted-foreground">Payment ID: </span>
                                <span className="font-mono text-xs">{fee.razorpayPaymentId}</span>
                              </p>
                            )}
                            {fee.transactionId && (
                              <p className="text-sm">
                                <span className="text-muted-foreground">Transaction ID: </span>
                                <span className="font-mono text-xs">{fee.transactionId}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Due Date</p>
                          <p className="font-medium">{formatDate(fee.dueDate)}</p>
                        </div>
                        {fee.paidDate && (
                          <div>
                            <p className="text-sm text-muted-foreground">Paid Date</p>
                            <p className="font-medium">{formatDate(fee.paidDate)}</p>
                          </div>
                        )}
                      </div>

                      {fee.description && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-muted-foreground">Description</p>
                          <p className="font-medium">{fee.description}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
        )}
      </>
    )}
  </div>
  );
}
