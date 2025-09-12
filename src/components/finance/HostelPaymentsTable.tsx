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
  Search,
  MoreHorizontal,
  Eye,
  Building,
  User,
  Phone,
  Mail,
  Calendar,
  Receipt,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { getPaymentDetailsHostelPaymentId } from '@/utils/api/financeApi';

interface HostelPaymentRecord {
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
  roomType?: string;
  roomNumber?: string;
  floor?: string;
  hostelName?: string;
  allocated?: boolean;
  academicYear: string;
  paymentStatus: string;
  paymentAmount?: number;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  adminNotified?: boolean;
  createdAt: string;
  updatedAt: string;
  paymentDate?: string;
  allocationDate?: string;
  buildingId?: string;
  roomId?: string;
}

interface HostelPaymentsTableProps {
  payments?: HostelPaymentRecord[];
  loading?: boolean;
  onViewDetails?: (paymentId: string) => void;
  selectedYear?: string;
  showStudentDetails?: boolean; // Add this prop
}

export function HostelPaymentsTable({ 
  payments = [], 
  loading = false,
  onViewDetails,
  selectedYear,
  showStudentDetails = false // Add this prop with default value
}: HostelPaymentsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  
  // Add state for selected payment details
  const [selectedPayment, setSelectedPayment] = useState<HostelPaymentRecord | null>(null);
  const [loadingPaymentDetails, setLoadingPaymentDetails] = useState(false);
  const [paymentDetailsError, setPaymentDetailsError] = useState<string | null>(null);

  const filteredPayments = (payments || []).filter(payment => {
    const matchesSearch = 
      payment.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.userId?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.razorpayOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.hostelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || payment.paymentStatus === filterStatus;
    
    const matchesYear = !selectedYear || payment.academicYear === selectedYear;
    
    return matchesSearch && matchesStatus && matchesYear;
  });

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

  const getRoomTypeBadge = (roomType: string) => {
    return roomType === 'AC' ? 
      <Badge variant="outline" className="bg-blue-50 text-blue-700">AC</Badge> :
      <Badge variant="outline" className="bg-gray-50 text-gray-700">Normal</Badge>;
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
      ['Student Name', 'Roll No', 'Email', 'Course', 'Room Type', 'Room Number', 'Hostel', 'Amount', 'Status', 'Payment Date', 'Academic Year', 'Order ID', 'Payment ID'],
      ...filteredPayments.map(payment => [
        payment.userId?.name || 'N/A',
        payment.userId?.rollno || 'N/A',
        payment.userId?.email || 'N/A',
        typeof payment.userId?.courseId === 'object' ? payment.userId.courseId.name : 'N/A',
        payment.roomType || 'N/A',
        payment.roomNumber || 'N/A',
        payment.hostelName || 'N/A',
        payment.paymentAmount || 0,
        payment.paymentStatus,
        payment.paymentDate || 'N/A',
        payment.academicYear,
        payment.razorpayOrderId,
        payment.razorpayPaymentId || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hostel-payments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleViewDetails = async (paymentId: string) => {
    try {
      setLoadingPaymentDetails(true);
      setPaymentDetailsError(null);
      
      // Find the payment in the current payments array
      const payment = payments.find(p => p._id === paymentId || p.razorpayPaymentId === paymentId);
      
      if (payment) {
        setSelectedPayment(payment);
      } else {
        // If not found locally, try to fetch from API
        const response = await getPaymentDetailsHostelPaymentId(paymentId);
        setSelectedPayment(response.data);
      }
    } catch (error: any) {
      setPaymentDetailsError(error.message || 'Failed to fetch payment details');
      setSelectedPayment(null);
    } finally {
      setLoadingPaymentDetails(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hostel Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading hostel payments...</div>
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
            <CardTitle>Hostel Payments</CardTitle>
            <Button onClick={exportToCSV} size="sm" className="gap-2">
              <Building className="h-4 w-4" />
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
                placeholder="Search by name, email, order ID, hostel, or room number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {selectedYear && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Filtered by year:</span>
                <Badge variant="outline">{selectedYear}</Badge>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Room Details</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No hostel payments found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payment.userId?.name || 'N/A'}</div>
                          <div className="text-sm text-muted-foreground">
                            Roll No: {payment.userId?.rollno || 'N/A'}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {payment.userId?.email || 'N/A'}
                          </div>
                          {payment.userId?.phone && (
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {payment.userId.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {typeof payment.userId?.courseId === 'object' ? payment.userId.courseId.name : 'N/A'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {typeof payment.userId?.courseId === 'object' ? payment.userId.courseId.code : 'N/A'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {typeof payment.userId?.courseId === 'object' ? payment.userId.courseId.department : 'N/A'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {getRoomTypeBadge(payment.roomType || 'Normal')}
                            <span className="text-sm font-medium">
                              Room {payment.roomNumber || 'N/A'}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {payment.hostelName || 'N/A'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Floor: {payment.floor || 'N/A'}
                          </div>
                          <div className="text-sm">
                            {payment.allocated ? (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                Allocated
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                Not Allocated
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          ₹{(payment.paymentAmount || 0).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(payment.paymentStatus)}
                      </TableCell>
                      <TableCell>
                        {payment.paymentDate ? 
                          formatDate(payment.paymentDate) : 
                          'N/A'
                        }
                      </TableCell>
                      <TableCell>
                        {payment.academicYear}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-mono">
                          {payment.razorpayOrderId}
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
                            <DropdownMenuItem onClick={() => handleViewDetails(payment.razorpayPaymentId || payment._id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
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
            Showing {filteredPayments.length} of {payments.length} hostel payments
          </div>
        </CardContent>
      </Card>

      {/* Payment Details Section - Only show when showStudentDetails is true */}
      {showStudentDetails && (
        <>
          {!selectedPayment && !loadingPaymentDetails && (
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  <div className="text-center">
                    <Building className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Please select a payment to view detailed information</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {loadingPaymentDetails && (
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-muted-foreground">Loading payment details...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {paymentDetailsError && (
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <p className="text-red-600 font-medium">Error loading payment details</p>
                    <p className="text-sm text-muted-foreground mt-1">{paymentDetailsError}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedPayment && (
            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Hostel Payment Details
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedPayment.userId?.name} - {selectedPayment.hostelName}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedPayment(null)}
                  >
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Student Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Student Name</p>
                    <p className="font-medium">{selectedPayment.userId?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedPayment.userId?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Roll Number</p>
                    <p className="font-medium">{selectedPayment.userId?.rollno || 'N/A'}</p>
                  </div>
                </div>

                {/* Course Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Course</p>
                    <p className="font-medium">
                      {typeof selectedPayment.userId?.courseId === 'object' 
                        ? selectedPayment.userId.courseId.name 
                        : 'N/A'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {typeof selectedPayment.userId?.courseId === 'object' 
                        ? selectedPayment.userId.courseId.code 
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Department</p>
                    <p className="font-medium">
                      {typeof selectedPayment.userId?.courseId === 'object' 
                        ? selectedPayment.userId.courseId.department 
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Hostel Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Hostel Name</p>
                    <p className="font-medium">{selectedPayment.hostelName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Room Details</p>
                    <p className="font-medium">
                      Room {selectedPayment.roomNumber || 'N/A'} - Floor {selectedPayment.floor || 'N/A'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Type: {selectedPayment.roomType || 'Normal'}
                    </p>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Payment Information</h3>
                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Basic Info */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Academic Year</span>
                          </div>
                          <p className="font-medium">{selectedPayment.academicYear}</p>
                          
                          <div className="flex items-center gap-2">
                            <Receipt className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Order ID</span>
                          </div>
                          <p className="font-mono text-sm">{selectedPayment.razorpayOrderId}</p>
                        </div>

                        {/* Payment Info */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Payment Details</span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm">
                              <span className="text-muted-foreground">Amount: </span>
                              <span className="font-medium">₹{(selectedPayment.paymentAmount || 0).toLocaleString()}</span>
                            </p>
                            <p className="text-sm">
                              <span className="text-muted-foreground">Status: </span>
                              {selectedPayment.paymentStatus === 'paid' ? (
                                <Badge variant="default" className="bg-green-100 text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Paid
                                </Badge>
                              ) : (
                                <Badge variant="secondary">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {selectedPayment.paymentStatus}
                                </Badge>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Transaction Info */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Transaction Info</span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm">
                              <span className="text-muted-foreground">Payment ID: </span>
                              <span className="font-mono text-xs">{selectedPayment.razorpayPaymentId || 'N/A'}</span>
                            </p>
                            <p className="text-sm">
                              <span className="text-muted-foreground">Allocated: </span>
                              {selectedPayment.allocated ? (
                                <Badge variant="default" className="bg-green-100 text-green-800">
                                  Yes
                                </Badge>
                              ) : (
                                <Badge variant="secondary">
                                  No
                                </Badge>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Payment Date</p>
                          <p className="font-medium">
                            {selectedPayment.paymentDate ? formatDate(selectedPayment.paymentDate) : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Allocation Date</p>
                          <p className="font-medium">
                            {selectedPayment.allocationDate ? formatDate(selectedPayment.allocationDate) : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
