'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
    ArrowLeft, 
    Building2, 
    Users, 
    MapPin, 
    RefreshCw,
    User,
    UserCheck,
    UserX
} from 'lucide-react';
import { getAvailableRooms, getBuildingFullRooms, BuildingRooms, Room, BuildingFullRoomsResponse } from '@/utils/api/hostelApi';
import { toast } from 'sonner';
import RoomOccupantsDialog from '@/components/hostel/RoomOccupantsDialog';

export default function HostelDetailPage() {
    const params = useParams();
    const router = useRouter();
    const buildingId = params.id as string;
    
    const [buildingData, setBuildingData] = useState<BuildingRooms | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [fullRoomsData, setFullRoomsData] = useState<BuildingFullRoomsResponse | null>(null);
    const [activeTab, setActiveTab] = useState<'rooms' | 'filled'>('rooms');

    const fetchBuildingData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch both available rooms and full rooms data
            const [availableRoomsResponse, fullRoomsResponse] = await Promise.all([
                getAvailableRooms('boys'),
                getBuildingFullRooms(buildingId)
            ]);
            
            // Find the specific building by ID
            const building = Object.values(availableRoomsResponse.data).find(
                building => building.buildingInfo._id === buildingId
            );
            
            if (building) {
                setBuildingData(building);
                setFullRoomsData(fullRoomsResponse);
            } else {
                setError('Building not found');
            }
        } catch (err: any) {
            setError(err.message);
            toast.error('Failed to fetch building details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (buildingId) {
            fetchBuildingData();
        }
    }, [buildingId]);

    const handleBack = () => {
        router.push('/dashboard/hostel');
    };

    const handleRoomClick = (room: Room) => {
        setSelectedRoom(room);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedRoom(null);
    };

    const getRoomStatusColor = (room: Room) => {
        if (room.currentOccupancy === 0) {
            return 'bg-green-100 text-green-800 border-green-300'; // Empty
        } else if (room.currentOccupancy === room.capacity) {
            return 'bg-red-100 text-red-800 border-red-300'; // Full
        } else {
            return 'bg-yellow-100 text-yellow-800 border-yellow-300'; // Partially filled
        }
    };

    const getRoomStatusText = (room: Room) => {
        if (room.currentOccupancy === 0) {
            return 'Empty';
        } else if (room.currentOccupancy === room.capacity) {
            return 'Full';
        } else {
            return 'Partially Filled';
        }
    };

    const getRoomStatusIcon = (room: Room) => {
        if (room.currentOccupancy === 0) {
            return <UserX className="h-4 w-4" />;
        } else if (room.currentOccupancy === room.capacity) {
            return <UserCheck className="h-4 w-4" />;
        } else {
            return <User className="h-4 w-4" />;
        }
    };

    const getFloorRooms = (floor: number | 'all') => {
        if (!buildingData) return [];
        
        let filteredRooms;
        if (floor === 'all') {
            filteredRooms = buildingData.rooms;
        } else {
            filteredRooms = buildingData.rooms.filter(room => room.floor === floor);
        }
        
        // Sort rooms by room number for consistent display
        return filteredRooms.sort((a, b) => {
            // Extract numeric part from room number (e.g., "0001" -> 1)
            const numA = parseInt(a.roomNumber.replace(/\D/g, '')) || 0;
            const numB = parseInt(b.roomNumber.replace(/\D/g, '')) || 0;
            return numA - numB;
        });
    };

    const getAvailableFloors = () => {
        if (!buildingData) return [];
        
        const floors = [...new Set(buildingData.rooms.map(room => room.floor))];
        return floors.sort((a, b) => a - b);
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
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    if (error || !buildingData) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Building Details</h1>
                    <p className="text-gray-600 mb-4">{error || 'Building not found'}</p>
                    <Button onClick={handleBack} variant="outline">
                        Back to Hostels
                    </Button>
                </div>
            </div>
        );
    }

    const currentRooms = getFloorRooms(selectedFloor);
    const availableFloors = getAvailableFloors();
    


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
                        <h1 className="text-3xl font-bold text-gray-900">{buildingData.buildingInfo.name}</h1>
                        <p className="text-gray-600">Complete building and room information</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <Button 
                        onClick={fetchBuildingData} 
                        variant="outline"
                        className="flex items-center gap-2"
                        disabled={loading}
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <span className="text-sm text-gray-500">
                        Last updated: {new Date().toLocaleTimeString()}
                    </span>
                </div>
            </div>

            {/* Building Info Card */}
            <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Building2 className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-blue-900">Building Details</h2>
                                <p className="text-blue-700 font-mono">{buildingData.buildingInfo.type}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <Users className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-green-900">Warden</h2>
                                <p className="text-green-700">{buildingData.buildingInfo.wardenName}</p>
                                <p className="text-green-600 text-sm">{buildingData.buildingInfo.wardenPhone}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <MapPin className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-purple-900">Total Rooms</h2>
                                <p className="text-purple-700 text-2xl font-bold">{buildingData.rooms.length}</p>
                                <p className="text-purple-600 text-sm">Floor: {selectedFloor === 'all' ? 'All' : selectedFloor === 0 ? 'Ground' : selectedFloor}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Floor Filter */}
            <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={selectedFloor === 'all' ? "default" : "outline"}
                        onClick={() => setSelectedFloor('all')}
                        className="flex items-center gap-2"
                    >
                        <Building2 className="h-4 w-4" />
                        All Floors
                    </Button>
                    {availableFloors.map((floor) => (
                        <Button
                            key={floor}
                            variant={selectedFloor === floor ? "default" : "outline"}
                            onClick={() => setSelectedFloor(floor)}
                            className="flex items-center gap-2"
                        >
                            <MapPin className="h-4 w-4" />
                            Floor {floor === 0 ? 'Ground' : floor}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="mb-6">
                <div className="flex gap-2 border-b border-gray-200">
                    <Button
                        variant={activeTab === 'rooms' ? "default" : "outline"}
                        onClick={() => setActiveTab('rooms')}
                        className="rounded-b-none border-b-0"
                    >
                        <Building2 className="h-4 w-4 mr-2" />
                        All Rooms ({buildingData.rooms.length})
                    </Button>
                    <Button
                        variant={activeTab === 'filled' ? "default" : "outline"}
                        onClick={() => setActiveTab('filled')}
                        className="rounded-b-none border-b-0"
                    >
                        <Users className="h-4 w-4 mr-2" />
                        Filled Rooms ({fullRoomsData?.data.fullRooms || 0})
                    </Button>
                </div>
            </div>

            {/* Room Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-green-50 border-green-200">
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <UserX className="h-8 w-8 text-green-600" />
                            <div>
                                <p className="text-sm font-medium text-green-600">Empty Rooms</p>
                                <p className="text-2xl font-bold text-green-900">
                                    {fullRoomsData?.data.availableRooms || 0}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <User className="h-8 w-8 text-yellow-600" />
                            <div>
                                <p className="text-sm font-medium text-yellow-600">Partially Filled</p>
                                <p className="text-2xl font-bold text-yellow-900">
                                    {fullRoomsData?.data ? 
                                        fullRoomsData.data.totalRooms - fullRoomsData.data.availableRooms - fullRoomsData.data.fullRooms : 0
                                    }
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-red-50 border-red-200">
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <UserCheck className="h-8 w-8 text-red-600" />
                            <div>
                                <p className="text-sm font-medium text-red-600">Full Rooms</p>
                                <p className="text-2xl font-bold text-red-900">
                                    {fullRoomsData?.data.fullRooms || 0}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <Building2 className="h-8 w-8 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-blue-600">Occupancy %</p>
                                <p className="text-2xl font-bold text-blue-900">
                                    {fullRoomsData?.data.occupancyPercentage || 0}%
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filled Rooms Section */}
            {activeTab === 'filled' && fullRoomsData?.data.fullRoomsDetails && fullRoomsData.data.fullRoomsDetails.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Filled Rooms Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {fullRoomsData.data.fullRoomsDetails.map((room) => (
                            <Card key={room.roomId} className="bg-red-50 border-red-200">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-lg text-red-900">
                                                {room.displayName}
                                            </CardTitle>
                                            <p className="text-sm text-red-700 font-mono">
                                                Room {room.roomNumber}
                                            </p>
                                        </div>
                                        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                                            <UserCheck className="h-4 w-4 mr-1" />
                                            Full
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-red-600">
                                            <MapPin className="h-4 w-4" />
                                            <span>Floor {room.floor === 0 ? 'Ground' : room.floor}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-red-600">
                                            <Building2 className="h-4 w-4" />
                                            <span>{room.corridor} corridor</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-red-600">
                                            <Users className="h-4 w-4" />
                                            <span>{room.currentOccupancy}/{room.capacity} occupied</span>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-red-100 p-3 rounded-lg">
                                        <h4 className="text-sm font-semibold text-red-700 mb-2">Current Occupants:</h4>
                                        <div className="space-y-2">
                                            {room.occupants.map((occupant, index) => (
                                                <div key={occupant.studentId} className="text-xs text-red-700 bg-white p-2 rounded">
                                                    <div className="font-medium">{index + 1}. {occupant.name}</div>
                                                    <div className="text-red-600">Roll No: {occupant.rollno}</div>
                                                    <div className="text-red-600">{occupant.course}</div>
                                                    <div className="text-red-600">{occupant.department}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Rooms Grid */}
            {activeTab === 'rooms' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {currentRooms.map((room) => (
                    <Card 
                        key={room._id} 
                        className="hover:shadow-lg transition-shadow cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => handleRoomClick(room)}
                    >
                        <CardHeader>
                            <div className="flex flex-col items-start justify-between">
                                <div>
                                    <CardTitle className="text-lg text-gray-900">
                                        {room.displayName}
                                    </CardTitle>
                                   
                                </div>
                               <div className='flex items-center gap-2'>
                               <p className="text-sm text-gray-600 font-mono">
                                        Room {room.roomNumber}
                                    </p>
                               <Badge 
                                    variant="outline" 
                                    className={`${getRoomStatusColor(room)}`}
                                >
                                    {getRoomStatusIcon(room)}
                                    <span className="ml-1">{getRoomStatusText(room)}</span>
                                </Badge>
                               </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {/* Room Details */}
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="h-4 w-4" />
                                    <span>Floor {room.floor === 0 ? 'Ground' : room.floor}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Building2 className="h-4 w-4" />
                                    <span>{room.corridor} corridor</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Users className="h-4 w-4" />
                                    <span>{room.currentOccupancy}/{room.capacity} occupied</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                                        ID: {room._id.slice(-6)}
                                    </span>
                                </div>
                            </div>

                            {/* Occupancy Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className={`h-2 rounded-full transition-all ${
                                        room.currentOccupancy === 0 ? 'bg-green-500' :
                                        room.currentOccupancy === room.capacity ? 'bg-red-500' :
                                        'bg-yellow-500'
                                    }`}
                                    style={{ 
                                        width: `${(room.currentOccupancy / room.capacity) * 100}%` 
                                    }}
                                ></div>
                            </div>

                            {/* Occupants List */}
                            {/* {room.occupants.length > 0 && (
                                <div className="bg-gray-50 p-2 rounded-lg">
                                    <p className="text-xs font-medium text-gray-700 mb-1">Current Occupants:</p>
                                    <div className="space-y-1">
                                        {room.occupants.map((occupant, index) => (
                                            <div key={occupant._id} className="text-xs text-gray-600">
                                                {index + 1}. {occupant.studentId.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )} */}

                            {/* Click to view occupants */}
                            <div className="pt-2">
                                <p className="text-xs text-center text-blue-600 font-medium">
                                    Click to view occupants
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                </div>
            )}

            {/* Empty State for Floor */}
            {activeTab === 'rooms' && currentRooms.length === 0 && (
                <Card className="text-center py-12">
                    <CardContent>
                        <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-red-600 mb-2">No Rooms Found</h3>
                        <p className="text-gray-500 mb-4">
                            {selectedFloor === 'all' 
                                ? 'No rooms available in this building.'
                                : `No rooms found on Floor ${selectedFloor === 0 ? 'Ground' : selectedFloor}.`
                            }
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Room Occupants Dialog */}
            {selectedRoom && (
                <RoomOccupantsDialog
                    isOpen={isDialogOpen}
                    onClose={handleCloseDialog}
                    roomName={selectedRoom.displayName}
                    roomNumber={selectedRoom.roomNumber}
                    occupants={selectedRoom.occupants}
                    roomCapacity={selectedRoom.capacity}
                    currentOccupancy={selectedRoom.currentOccupancy}
                />
            )}

        </div>
    );
} 