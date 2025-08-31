'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
    Building2, 
    Users, 
    Phone, 
    MapPin, 
    Home,
    RefreshCw,
    Plus
} from 'lucide-react';
import { getHostelBuildings, HostelBuilding } from '@/utils/api/hostelApi';
import { toast } from 'sonner';

export default function HostelPage() {
    const router = useRouter();
    const [buildings, setBuildings] = useState<HostelBuilding[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBuildings = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getHostelBuildings();
            setBuildings(response.data);
        } catch (err: any) {
            setError(err.message);
            toast.error('Failed to fetch hostel buildings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBuildings();
    }, []);

    const getBuildingTypeColor = (type: string) => {
        return type === 'boys' 
            ? 'bg-blue-100 text-blue-800 border-blue-300' 
            : 'bg-pink-100 text-pink-800 border-pink-300';
    };

    const getBuildingTypeIcon = (type: string) => {
        return type === 'boys' ? '👨‍🎓' : '👩‍🎓';
    };

    const calculateTotalRooms = (building: HostelBuilding) => {
        const groundFloor = building.floorConfig.groundFloor.totalRooms;
        const upperFloors = (building.totalFloors - 1) * 
            (building.floorConfig.upperFloors.leftCorridor + building.floorConfig.upperFloors.rightCorridor);
        return groundFloor + upperFloors;
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-32" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
  return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Hostel Buildings</h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={fetchBuildings} variant="outline">
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
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Home className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Hostel Buildings</h1>
                        <p className="text-gray-600">Manage and view hostel building information</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button 
                        onClick={fetchBuildings} 
                        variant="outline"
                        className="flex items-center gap-2"
                        disabled={loading}
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button className="bg-purple-300 hover:bg-purple-400 cursor-pointer">
                        <Plus className="h-4 w-4 text-purple-600" />
                    </Button>
                    <Button 
                        onClick={() => router.push('/dashboard/hostel/allocate')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        <Users className="h-4 w-4 mr-2" />
                        Allocate Rooms
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <Building2 className="h-8 w-8 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-blue-600">Total Buildings</p>
                                <p className="text-2xl font-bold text-blue-900">{buildings.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <Users className="h-8 w-8 text-green-600" />
                            <div>
                                <p className="text-sm font-medium text-green-600">Boys Hostels</p>
                                <p className="text-2xl font-bold text-green-900">
                                    {buildings.filter(b => b.type === 'boys').length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-pink-50 border-pink-200">
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <Users className="h-8 w-8 text-pink-600" />
                            <div>
                                <p className="text-sm font-medium text-pink-600">Girls Hostels</p>
                                <p className="text-2xl font-bold text-pink-900">
                                    {buildings.filter(b => b.type === 'girls').length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-purple-50 border-purple-200">
                    <CardContent>
                        <div className="flex items-center gap-3">
                            <MapPin className="h-8 w-8 text-purple-600" />
                            <div>
                                <p className="text-sm font-medium text-purple-600">Total Rooms</p>
                                <p className="text-2xl font-bold text-purple-900">
                                    {buildings.reduce((acc, building) => acc + calculateTotalRooms(building), 0)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Buildings Grid */}
            {buildings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {buildings.map((building) => (
                        <Card key={building._id} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{getBuildingTypeIcon(building.type)}</span>
                                        <div>
                                            <CardTitle className="text-lg text-gray-900">
                                                {building.name}
                                            </CardTitle>
                                            <Badge 
                                                variant="outline" 
                                                className={`mt-1 ${getBuildingTypeColor(building.type)}`}
                                            >
                                                {building.type.charAt(0).toUpperCase() + building.type.slice(1)}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Badge 
                                        variant={building.isActive ? "default" : "secondary"}
                                        className={building.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                                    >
                                        {building.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Building Info */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Building2 className="h-4 w-4" />
                                        <span>{building.totalFloors} Floors</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin className="h-4 w-4" />
                                        <span>{calculateTotalRooms(building)} Total Rooms</span>
                                    </div>
                                </div>

                                {/* Floor Configuration */}
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Floor Configuration</h4>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="text-gray-600">Ground Floor:</span>
                                            <span className="font-medium ml-1">{building.floorConfig.groundFloor.totalRooms} rooms</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Upper Floors:</span>
                                            <span className="font-medium ml-1">
                                                {building.floorConfig.upperFloors.leftCorridor + building.floorConfig.upperFloors.rightCorridor} rooms
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users className="h-4 w-4 text-blue-600" />
                                        <span className="text-gray-600">Warden:</span>
                                        <span className="font-medium text-gray-900">{building.wardenName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="h-4 w-4 text-green-600" />
                                        <span className="text-gray-600">Caretaker:</span>
                                        <span className="font-medium text-gray-900">{building.caretakerName}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="flex-1"
                                        onClick={() => router.push(`/dashboard/hostel/${building._id}`)}
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                /* Empty State */
                <Card className="text-center py-12">
                    <CardContent>
                        <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Hostel Buildings Found</h3>
                        <p className="text-gray-500 mb-4">
                            No hostel buildings have been added yet.
                        </p>
                        <Button className="bg-purple-600 hover:bg-purple-300">
                            <Plus className="h-4 w-4 text-purple-60" />
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}