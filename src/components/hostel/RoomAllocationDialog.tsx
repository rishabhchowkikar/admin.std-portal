'use client';

import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    GraduationCap, 
    Building2,
    User,
    CheckCircle,
    Loader2
} from 'lucide-react';
import { 
    getHostelBuildings,
    getAvailableRooms,
    allocateRoom, 
    PendingAllocationStudent,
    RoomAllocationPayload,
    HostelBuilding
} from '@/utils/api/hostelApi';
import { toast } from 'sonner';

interface RoomAllocationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    selectedStudent?: PendingAllocationStudent;
    onAllocationSuccess: () => void;
}

export default function RoomAllocationDialog({
    isOpen,
    onClose,
    selectedStudent: preSelectedStudent,
    onAllocationSuccess
}: RoomAllocationDialogProps) {
    const [buildings, setBuildings] = useState<HostelBuilding[]>([]);
    const [selectedBuilding, setSelectedBuilding] = useState<string>('');
    const [selectedRoom, setSelectedRoom] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [fetchingBuildings, setFetchingBuildings] = useState(false);
    const [availableRooms, setAvailableRooms] = useState<any[]>([]);
    const [fetchingRooms, setFetchingRooms] = useState(false);

    const fetchBuildings = async () => {
        try {
            setFetchingBuildings(true);
            const response = await getHostelBuildings();
            setBuildings(response.data);
        } catch (error: any) {
            toast.error('Failed to fetch hostel buildings');
            console.error('Error fetching buildings:', error);
        } finally {
            setFetchingBuildings(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchBuildings();
        }
    }, [isOpen]);

    useEffect(() => {
        if (selectedBuilding) {
            fetchAvailableRooms(selectedBuilding);
            setSelectedRoom(''); // Reset room selection when building changes
        }
    }, [selectedBuilding]);

    const handleAllocateRoom = async () => {
        if (!preSelectedStudent || !selectedBuilding || !selectedRoom) {
            toast.error('Please select both building and room');
            return;
        }

        try {
            setLoading(true);
            const payload: RoomAllocationPayload = {
                userId: preSelectedStudent.userId._id,
                buildingId: selectedBuilding,
                roomId: selectedRoom
            };

            await allocateRoom(payload);
            toast.success('Room allocated successfully!');
            onAllocationSuccess();
            handleClose();
        } catch (error: any) {
            toast.error(error.message || 'Failed to allocate room');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedBuilding('');
        setSelectedRoom('');
        setBuildings([]);
        onClose();
    };

    const getBuildingById = (buildingId: string) => {
        return buildings.find(building => building._id === buildingId);
    };

    const fetchAvailableRooms = async (buildingId: string) => {
        try {
            setFetchingRooms(true);
            const building = getBuildingById(buildingId);
            if (!building) return;
            
            const response = await getAvailableRooms(building.type);
            const buildingData = Object.values(response.data).find(
                b => b.buildingInfo._id === buildingId
            );
            
            if (buildingData) {
                setAvailableRooms(buildingData.rooms);
            }
        } catch (error: any) {
            toast.error('Failed to fetch available rooms');
            console.error('Error fetching rooms:', error);
        } finally {
            setFetchingRooms(false);
        }
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

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900">
                        Allocate Room - {preSelectedStudent?.userId.name}
                    </DialogTitle>
                    <p className="text-gray-600">Select a building and room for allocation</p>
                </DialogHeader>

                {/* Student Info */}
                <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <User className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-blue-600">Student Name</p>
                                    <p className="text-lg font-bold text-blue-900">{preSelectedStudent?.userId.name}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <GraduationCap className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-green-600">Course</p>
                                    <p className="text-lg font-bold text-green-900">{preSelectedStudent?.userId.courseId.name}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Building2 className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-purple-600">Room Type</p>
                                    <p className="text-lg font-bold text-purple-900">{preSelectedStudent?.roomType}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Selection Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Building
                        </label>
                        <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a building" />
                            </SelectTrigger>
                            <SelectContent>
                                {buildings.map((building) => (
                                    <SelectItem key={building._id} value={building._id}>
                                        <div className="flex items-center gap-2">
                                            <span>{building.name}</span>
                                            <Badge variant="outline" className={getRoomTypeColor(building.type)}>
                                                {building.type}
                                            </Badge>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Room {!selectedBuilding && <span className="text-gray-400">(Select building first)</span>}
                        </label>
                        <Select value={selectedRoom} onValueChange={setSelectedRoom} disabled={!selectedBuilding || fetchingRooms}>
                            <SelectTrigger>
                                <SelectValue placeholder={!selectedBuilding ? "Select a building first" : "Choose a room"} />
                            </SelectTrigger>
                            <SelectContent>
                                {fetchingRooms ? (
                                    <SelectItem value="loading" disabled>
                                        Loading rooms...
                                    </SelectItem>
                                ) : availableRooms.length > 0 ? (
                                    availableRooms.map((room) => (
                                        <SelectItem key={room._id} value={room._id}>
                                            <div className="flex items-center gap-2">
                                                <span>{room.displayName}</span>
                                                <Badge variant="outline" className={
                                                    room.currentOccupancy === 0 ? 'bg-green-100 text-green-800' :
                                                    room.currentOccupancy === room.capacity ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }>
                                                    {room.currentOccupancy === 0 ? 'Empty' :
                                                     room.currentOccupancy === room.capacity ? 'Full' :
                                                     'Partially Filled'}
                                                </Badge>
                                            </div>
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="no-rooms" disabled>
                                        No rooms available
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        {selectedBuilding && !fetchingRooms && availableRooms.length === 0 && (
                            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-xs text-yellow-700">
                                    ⚠️ No rooms available in {getBuildingById(selectedBuilding)?.name}. 
                                    Please select a different building.
                                </p>
                            </div>
                        )}
                    </div>
                </div>



                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleAllocateRoom} 
                        disabled={!selectedBuilding || !selectedRoom || loading}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Allocating...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Allocate Room
                            </>
                        )}
                    </Button>
                </div>

                {/* Loading State for Buildings */}
                {fetchingBuildings && (
                    <div className="text-center py-8">
                        <Loader2 className="h-8 w-8 text-blue-600 mx-auto mb-4 animate-spin" />
                        <p className="text-gray-600">Fetching hostel buildings...</p>
                    </div>
                )}

                {/* Loading State for Rooms */}
                {selectedBuilding && fetchingRooms && (
                    <div className="text-center py-4 bg-blue-50 rounded-lg border border-blue-200">
                        <Loader2 className="h-6 w-6 text-blue-600 mx-auto mb-2 animate-spin" />
                        <p className="text-gray-600 text-sm">Fetching available rooms for {getBuildingById(selectedBuilding)?.name}...</p>
                    </div>
                )}

                {/* Empty State */}
                {!fetchingBuildings && buildings.length === 0 && (
                    <Card className="text-center py-12 bg-gray-50">
                        <CardContent>
                            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Buildings Available</h3>
                            <p className="text-gray-500">
                                No hostel buildings are available for allocation.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </DialogContent>
        </Dialog>
    );
} 