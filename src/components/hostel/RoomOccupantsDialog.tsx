'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
    Users, 
    Calendar, 
    GraduationCap, 
    Building2,
    User,
    Clock
} from 'lucide-react';

import { RoomOccupant } from '@/utils/api/hostelApi';

interface RoomOccupantsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    roomName: string;
    roomNumber: string;
    occupants: RoomOccupant[];
    roomCapacity: number;
    currentOccupancy: number;
}

export default function RoomOccupantsDialog({
    isOpen,
    onClose,
    roomName,
    roomNumber,
    occupants,
    roomCapacity,
    currentOccupancy
}: RoomOccupantsDialogProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getOccupancyColor = () => {
        if (currentOccupancy === 0) return 'bg-green-100 text-green-800 border-green-300';
        if (currentOccupancy === roomCapacity) return 'bg-red-100 text-red-800 border-red-300';
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    };

    const getOccupancyText = () => {
        if (currentOccupancy === 0) return 'Empty';
        if (currentOccupancy === roomCapacity) return 'Full';
        return 'Partially Filled';
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900">
                        Room Occupants - {roomName}
                    </DialogTitle>
                    <p className="text-gray-600 font-mono">Room {roomNumber}</p>
                </DialogHeader>

                {/* Room Status Summary */}
                <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Users className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-blue-600">Capacity</p>
                                    <p className="text-lg font-bold text-blue-900">{roomCapacity}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <User className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-green-600">Current</p>
                                    <p className="text-lg font-bold text-green-900">{currentOccupancy}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Building2 className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-purple-600">Status</p>
                                    <Badge variant="outline" className={getOccupancyColor()}>
                                        {getOccupancyText()}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Occupants List */}
                {occupants.length > 0 ? (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-600" />
                            Current Occupants ({occupants.length})
                        </h3>
                        
                        {occupants.map((occupant, index) => (
                            <Card key={occupant._id} className="border-l-4 border-l-blue-500">
                                <CardContent>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 font-semibold text-sm">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-900">
                                                    {occupant.studentId.name}
                                                </h4>
                                                <p className="text-gray-600 font-mono">
                                                    Roll No: {occupant.studentId.rollno}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Course Information */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <GraduationCap className="h-4 w-4 text-blue-600" />
                                                <span className="text-gray-600">Course:</span>
                                                <span className="font-medium text-gray-900">
                                                    {occupant.studentId.courseId.name}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 text-sm">
                                                <Building2 className="h-4 w-4 text-green-600" />
                                                <span className="text-gray-600">Department:</span>
                                                <span className="font-medium text-gray-900">
                                                    {occupant.studentId.courseId.department}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 text-sm">
                                                <Building2 className="h-4 w-4 text-purple-600" />
                                                <span className="text-gray-600">School:</span>
                                                <span className="font-medium text-gray-900">
                                                    {occupant.studentId.courseId.school}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Allocation Information */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="h-4 w-4 text-orange-600" />
                                                <span className="text-gray-600">Allocated:</span>
                                                <span className="font-medium text-gray-900">
                                                    {formatDate(occupant.allocatedDate)}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="h-4 w-4 text-indigo-600" />
                                                <span className="text-gray-600">Academic Year:</span>
                                                <span className="font-medium text-gray-900">
                                                    {occupant.academicYear}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <Card className="text-center py-12 bg-gray-50">
                        <CardContent>
                            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Occupants</h3>
                            <p className="text-gray-500">
                                This room is currently empty and available for allocation.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </DialogContent>
        </Dialog>
    );
} 