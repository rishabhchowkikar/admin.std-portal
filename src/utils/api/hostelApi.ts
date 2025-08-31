import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface FloorConfig {
    groundFloor: {
        totalRooms: number;
        roomPrefix: string;
    };
    upperFloors: {
        leftCorridor: number;
        rightCorridor: number;
        roomPrefixLeft: string;
        roomPrefixRight: string;
    };
}

export interface HostelBuilding {
    _id: string;
    name: string;
    type: 'boys' | 'girls';
    totalFloors: number;
    wardenName: string;
    wardenPhone: string;
    caretakerName: string;
    caretakerPhone: string;
    isActive: boolean;
    floorConfig: FloorConfig;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface HostelBuildingsResponse {
    data: HostelBuilding[];
    status: boolean;
    message: string;
}

export interface BuildingInfo {
    _id: string;
    name: string;
    type: string;
    wardenName: string;
    wardenPhone: string;
}

export interface StudentCourse {
    _id: string;
    name: string;
    department: string;
    school: string;
}

export interface Student {
    _id: string;
    name: string;
    courseId: StudentCourse;
    rollno: number;
}

export interface RoomOccupant {
    _id: string;
    studentId: Student;
    allocatedDate: string;
    academicYear: string;
}

export interface Room {
    _id: string;
    buildingId: BuildingInfo;
    roomNumber: string;
    displayName: string;
    floor: number;
    corridor: string;
    roomType: string;
    capacity: number;
    currentOccupancy: number;
    occupants: RoomOccupant[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface BuildingRooms {
    buildingInfo: BuildingInfo;
    rooms: Room[];
}

export interface AvailableRoomsResponse {
    data: Record<string, BuildingRooms>;
    totalAvailableRooms: number;
    status: boolean;
    message: string;
}

export interface PendingAllocationStudent {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        courseId: {
            _id: string;
            name: string;
            code: string;
            department: string;
            school: string;
        };
        rollno: number;
        gender: string;
    };
    roomType: string;
    roomNumber: string;
    floor: string;
    hostelName: string;
    allocated: boolean;
    academicYear: string;
    paymentStatus: string;
    paymentAmount: number;
    razorpayOrderId: string;
    adminNotified: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    paymentDate: string;
    razorpayPaymentId: string;
}

export interface PendingAllocationResponse {
    data: PendingAllocationStudent[];
    status: boolean;
    message: string;
}

export interface RoomAllocationPayload {
    userId: string;
    buildingId: string;
    roomId: string;
}

export interface RoomAllocationResponse {
    status: boolean;
    message: string;
}

export interface FullRoomOccupant {
    studentId: string;
    name: string;
    rollno: number;
    email: string;
    gender: string;
    course: string;
    department: string;
    school: string;
    allocatedDate: string;
    academicYear: string;
}

export interface FullRoomDetail {
    roomId: string;
    roomNumber: string;
    displayName: string;
    floor: number;
    corridor: string;
    roomType: string;
    capacity: number;
    currentOccupancy: number;
    occupants: FullRoomOccupant[];
}

export interface BuildingFullRoomsResponse {
    data: {
        buildingId: string;
        buildingName: string;
        buildingType: string;
        fullRooms: number;
        totalRooms: number;
        availableRooms: number;
        occupancyPercentage: number;
        fullRoomsDetails: FullRoomDetail[];
    };
    status: boolean;
    message: string;
}

export const getHostelBuildings = async (): Promise<HostelBuildingsResponse> => {
    try {
        const response = await axios.get<HostelBuildingsResponse>(
            `${API_BASE_URL}/hostel-building/buildings`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch hostel buildings');
    }
};

export const getAvailableRooms = async (buildingType: string): Promise<AvailableRoomsResponse> => {
    try {
        const response = await axios.get<AvailableRoomsResponse>(
            `${API_BASE_URL}/hostel-building/available-rooms?buildingType=${buildingType}`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch available rooms');
    }
};

export const getPendingAllocations = async (): Promise<PendingAllocationResponse> => {
    try {
        const response = await axios.get<PendingAllocationResponse>(
            `${API_BASE_URL}/hostel-building/pending-allocation`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch pending allocations');
    }
};

export const allocateRoom = async (payload: RoomAllocationPayload): Promise<RoomAllocationResponse> => {
    try {
        const response = await axios.put<RoomAllocationResponse>(
            `${API_BASE_URL}/hostel-building/allocate-room`,
            payload,
            { withCredentials: true }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to allocate room');
    }
};

export const getBuildingFullRooms = async (buildingId: string): Promise<BuildingFullRoomsResponse> => {
    try {
        const response = await axios.get<BuildingFullRoomsResponse>(
            `${API_BASE_URL}/hostel-building/building/${buildingId}/full-rooms-count`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch building full rooms data');
    }
}; 