'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
    ArrowLeft, 
    Users, 
    Building2, 
    CreditCard,
    AlertCircle,
    CheckCircle,
    Loader2,
    MapPin,
    GraduationCap
} from 'lucide-react';
import { 
    getPendingAllocations, 
    PendingAllocationStudent 
} from '@/utils/api/hostelApi';
import { toast } from 'sonner';
import RoomAllocationDialog from '@/components/hostel/RoomAllocationDialog';

export default function RoomAllocationPage() {
    const router = useRouter();
    const [pendingStudents, setPendingStudents] = useState<PendingAllocationStudent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<PendingAllocationStudent | null>(null);
    const [isAllocationDialogOpen, setIsAllocationDialogOpen] = useState(false);

    const fetchPendingStudents = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getPendingAllocations();
            setPendingStudents(response.data);
        } catch (err: any) {
            setError(err.message);
            toast.error('Failed to fetch pending allocations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingStudents();
    }, []);

    const handleBack = () => {
        router.push('/dashboard/hostel');
    };

    const handleAllocateToBuilding = (student: PendingAllocationStudent) => {
        setSelectedStudent(student);
        setIsAllocationDialogOpen(true);
    };

    const handleCloseAllocationDialog = () => {
        setIsAllocationDialogOpen(false);
        setSelectedStudent(null);
    };

    const handleAllocationSuccess = () => {
        // Refresh the pending students list
        fetchPendingStudents();
        toast.success('Room allocation successful! Student list refreshed.');
    };

    const getRoomTypeColor = (roomType: string) => {
        switch (roomType.toLowerCase()) {
            case 'ac':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'non-ac':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'deluxe':
                return 'bg-purple-100 text-purple-800 border-purple-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'failed':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getGenderIcon = (gender: string) => {
        return gender.toLowerCase() === 'male' ? '👨' : '👩';
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-64 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Pending Allocations</h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={fetchPendingStudents} variant="outline">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Button 
                        onClick={handleBack} 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Hostels
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Room Allocation Management</h1>
                        <p className="text-gray-600">Manage pending room allocations for students</p>
                    </div>
                </div>
                
                <Button 
                    onClick={fetchPendingStudents} 
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={loading}
                >
                    <Loader2 className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <Users className="h-8 w-8 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-blue-600">Total Pending</p>
                                <p className="text-2xl font-bold text-blue-900">{pendingStudents.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <Building2 className="h-8 w-8 text-green-600" />
                            <div>
                                <p className="text-sm font-medium text-green-600">AC Rooms</p>
                                <p className="text-2xl font-bold text-green-900">
                                    {pendingStudents.filter(s => s.roomType.toLowerCase() === 'ac').length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-purple-50 border-purple-200">
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <Building2 className="h-8 w-8 text-purple-600" />
                            <div>
                                <p className="text-sm font-medium text-purple-600">Non-AC Rooms</p>
                                <p className="text-2xl font-bold text-purple-900">
                                    {pendingStudents.filter(s => s.roomType.toLowerCase() === 'non-ac').length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-orange-50 border-orange-200">
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <CreditCard className="h-8 w-8 text-orange-600" />
                            <div>
                                <p className="text-sm font-medium text-orange-600">Paid Students</p>
                                <p className="text-2xl font-bold text-orange-900">
                                    {pendingStudents.filter(s => s.paymentStatus.toLowerCase() === 'paid').length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Pending Students Grid */}
            {pendingStudents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingStudents.map((student) => (
                        <Card key={student._id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{getGenderIcon(student.userId.gender)}</span>
                                        <div>
                                            <CardTitle className="text-lg text-gray-900">
                                                {student.userId.name}
                                            </CardTitle>
                                            <p className="text-gray-600 font-mono">
                                                Roll No: {student.userId.rollno}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={getRoomTypeColor(student.roomType)}
                                    >
                                        {student.roomType}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Student Details */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <GraduationCap className="h-4 w-4" />
                                        <span>{student.userId.courseId.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Building2 className="h-4 w-4" />
                                        <span>{student.userId.courseId.department}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MapPin className="h-4 w-4" />
                                        <span>{student.userId.courseId.school}</span>
                                    </div>
                                </div>

                                {/* Allocation Preferences */}
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Allocation Details</h4>
                                    <div className="space-y-2 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Academic Year:</span>
                                            <span className="font-medium">{student.academicYear}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Payment Status:</span>
                                            <Badge variant="outline" className={getPaymentStatusColor(student.paymentStatus)}>
                                                {student.paymentStatus}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Amount:</span>
                                            <span className="font-medium">₹{student.paymentAmount}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <Button 
                                    onClick={() => handleAllocateToBuilding(student)}
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                    disabled={student.paymentStatus.toLowerCase() !== 'paid'}
                                >
                                    {student.paymentStatus.toLowerCase() === 'paid' ? (
                                        <>
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Allocate Room
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle className="h-4 w-4 mr-2" />
                                            Payment Pending
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                /* Empty State */
                <Card className="text-center py-12">
                    <CardContent>
                        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Pending Allocations</h3>
                        <p className="text-gray-500 mb-4">
                            All students have been allocated rooms or there are no pending requests.
                        </p>
                        <Button onClick={handleBack} variant="outline">
                            Back to Hostels
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Room Allocation Dialog */}
            {selectedStudent && (
                <RoomAllocationDialog
                    isOpen={isAllocationDialogOpen}
                    onClose={handleCloseAllocationDialog}
                    selectedStudent={selectedStudent}
                    onAllocationSuccess={handleAllocationSuccess}
                />
            )}
        </div>
    );
} 