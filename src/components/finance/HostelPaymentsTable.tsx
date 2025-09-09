import React, { useState } from 'react';
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
  Mail
} from 'lucide-react';

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
}

export function HostelPaymentsTable({ 
  payments = [], 
  loading = false,
  onViewDetails,
  selectedYear
}: HostelPaymentsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

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

  // Debug logging
  console.log('HostelPaymentsTable Debug:', {
    totalPayments: payments.length,
    filteredPayments: filteredPayments.length,
    selectedYear,
    searchTerm,
    filterStatus
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
                          <DropdownMenuItem onClick={() => onViewDetails?.(payment.razorpayPaymentId || payment._id)}>
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
  );
}
