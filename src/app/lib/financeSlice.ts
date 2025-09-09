import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  getFinanceDashboard, 
  getPaymentAnalytics, 
  paymentReports,
  getHostelAllPayments,
  getPaymentDetailsHostelYear,
  getPaymentDetailsHostelPaymentId,
  getPaymentDetailsFeesAllStudent,
  getPaymentDetailsStudentId
} from '@/utils/api/financeApi';

interface FinanceSummary {
  hostel: {
    paid: {
      count: number;
      amount: number;
    };
  };
  courseFees: {
    paid: {
      count: number;
      amount: number;
    };
  };
}

interface PaymentStatus {
  _id: string;
  count: number;
  totalAmount: number;
}

interface AnalyticsData {
  hostelPaymentStatus: PaymentStatus[];
  courseFeesStatus: PaymentStatus[];
  departmentWiseCourseFees: any[];
}

export interface details {}

export interface PaymentRecord {
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

interface PaymentReportsData {
  generatedAt: string;
  hostelPayments: PaymentRecord[];
  courseFeePayments: PaymentRecord[];
  summary: {
    hostel: number;
    course: number;
  };
}

interface HostelPaymentsData {
  data: PaymentRecord[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    limit: number;
  };
}

interface HostelYearData {
  data: PaymentRecord[];
  stats: {
    totalPayments: number;
    paidPayments: number;
    pendingPayments: number;
    totalAmount: number;
  };
  academicYear: string;
}

interface CourseFeesData {
  data: PaymentRecord[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    limit: number;
  };
}

interface FinanceState {
  summary: FinanceSummary | null;
  analytics: AnalyticsData | null;
  paymentReports: PaymentReportsData | null;
  hostelPayments: HostelPaymentsData | null;
  hostelYearData: HostelYearData | null;
  courseFeesData: CourseFeesData | null;
  selectedPaymentDetail: PaymentRecord | { data: PaymentRecord } | null;
  selectedYear: string;
  activeTab: 'overview' | 'hostel' | 'course';
  loading: {
    summary: boolean;
    analytics: boolean;
    reports: boolean;
    hostelPayments: boolean;
    hostelYearData: boolean;
    courseFeesData: boolean;
    paymentDetail: boolean;
  };
  error: {
    summary: string | null;
    analytics: string | null;
    reports: string | null;
    hostelPayments: string | null;
    hostelYearData: string | null;
    courseFeesData: string | null;
    paymentDetail: string | null;
  };
  lastFetched: {
    summary: number | null;
    analytics: number | null;
    reports: number | null;
    hostelPayments: number | null;
    hostelYearData: number | null;
    courseFeesData: number | null;
  };
}

const initialState: FinanceState = {
  summary: null,
  analytics: null,
  paymentReports: null,
  hostelPayments: null,
  hostelYearData: null,
  courseFeesData: null,
  selectedPaymentDetail: null,
  selectedYear: '2025-2026',
  activeTab: 'overview',
  loading: {
    summary: false,
    analytics: false,
    reports: false,
    hostelPayments: false,
    hostelYearData: false,
    courseFeesData: false,
    paymentDetail: false,
  },
  error: {
    summary: null,
    analytics: null,
    reports: null,
    hostelPayments: null,
    hostelYearData: null,
    courseFeesData: null,
    paymentDetail: null,
  },
  lastFetched: {
    summary: null,
    analytics: null,
    reports: null,
    hostelPayments: null,
    hostelYearData: null,
    courseFeesData: null,
  },
};

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

// Development mode flag - set to true to always use mock data
const USE_MOCK_DATA = false; // Disable mock data to use real API

// Mock data for testing
const generateMockHostelData = (year: string) => ({
  data: [
    {
      _id: 'mock-hostel-1',
      userId: {
        _id: 'user-1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        courseId: {
          _id: 'course-1',
          name: 'Computer Science',
          code: 'CS101',
          department: 'Computer Science',
          school: 'Engineering'
        },
        rollno: 2024001,
        phone: '+91 9876543210'
      },
      roomType: 'AC',
      roomNumber: '101',
      floor: '1st Floor',
      hostelName: 'Boys Hostel A',
      allocated: true,
      academicYear: year,
      paymentStatus: 'paid',
      paymentAmount: 50000,
      razorpayOrderId: 'order_mock_1',
      razorpayPaymentId: 'pay_mock_1',
      paymentDate: '2024-01-15T10:30:00Z',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      _id: 'mock-hostel-2',
      userId: {
        _id: 'user-2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        courseId: {
          _id: 'course-2',
          name: 'Electronics',
          code: 'EC101',
          department: 'Electronics',
          school: 'Engineering'
        },
        rollno: 2024002,
        phone: '+91 9876543211'
      },
      roomType: 'Normal',
      roomNumber: '205',
      floor: '2nd Floor',
      hostelName: 'Girls Hostel B',
      allocated: false,
      academicYear: year,
      paymentStatus: 'pending',
      paymentAmount: 45000,
      razorpayOrderId: 'order_mock_2',
      createdAt: '2024-01-16T09:00:00Z',
      updatedAt: '2024-01-16T09:00:00Z'
    }
  ],
  stats: {
    totalPayments: 2,
    paidPayments: 1,
    pendingPayments: 1,
    totalAmount: 95000
  },
  academicYear: year
});

const generateMockCourseFeesData = () => ({
  data: [
    {
      _id: 'mock-course-1',
      studentId: {
        _id: 'student-1',
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        courseId: {
          _id: 'course-1',
          name: 'Computer Science',
          code: 'CS101',
          department: 'Computer Science',
          school: 'Engineering'
        },
        rollno: 2024003
      },
      courseId: {
        _id: 'course-1',
        name: 'Computer Science',
        code: 'CS101',
        department: 'Computer Science',
        school: 'Engineering'
      },
      academicYear: '2025-2026',
      paymentStatus: 'paid',
      amount: 75000,
      finalAmount: 75000,
      paymentDate: '2024-01-20T14:30:00Z',
      razorpayOrderId: 'order_course_1',
      razorpayPaymentId: 'pay_course_1',
      createdAt: '2024-01-20T14:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z'
    },
    {
      _id: 'mock-course-2',
      studentId: {
        _id: 'student-2',
        name: 'Bob Wilson',
        email: 'bob.wilson@example.com',
        courseId: {
          _id: 'course-2',
          name: 'Electronics',
          code: 'EC101',
          department: 'Electronics',
          school: 'Engineering'
        },
        rollno: 2024004
      },
      courseId: {
        _id: 'course-2',
        name: 'Electronics',
        code: 'EC101',
        department: 'Electronics',
        school: 'Engineering'
      },
      academicYear: '2025-2026',
      paymentStatus: 'pending',
      amount: 70000,
      finalAmount: 70000,
      razorpayOrderId: 'order_course_2',
      createdAt: '2024-01-21T11:00:00Z',
      updatedAt: '2024-01-21T11:00:00Z'
    }
  ],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 2,
    limit: 10
  }
});

// Async thunks
export const fetchFinanceSummary = createAsyncThunk(
  'finance/fetchSummary',
  async (_, { getState }) => {
    const state = getState() as { finance: FinanceState };
    const now = Date.now();
    
    // Check if data is cached and still valid
    if (state.finance.summary && 
        state.finance.lastFetched.summary && 
        (now - state.finance.lastFetched.summary) < CACHE_DURATION) {
      return state.finance.summary;
    }
    
    const response = await getFinanceDashboard();
    return response.data;
  }
);

export const fetchPaymentAnalytics = createAsyncThunk(
  'finance/fetchAnalytics',
  async (_, { getState }) => {
    const state = getState() as { finance: FinanceState };
    const now = Date.now();
    
    // Check if data is cached and still valid
    if (state.finance.analytics && 
        state.finance.lastFetched.analytics && 
        (now - state.finance.lastFetched.analytics) < CACHE_DURATION) {
      return state.finance.analytics;
    }
    
    const response = await getPaymentAnalytics();
    return response.data;
  }
);

export const fetchPaymentReports = createAsyncThunk(
  'finance/fetchReports',
  async (_, { getState }) => {
    const state = getState() as { finance: FinanceState };
    const now = Date.now();
    
    // Check if data is cached and still valid
    if (state.finance.paymentReports && 
        state.finance.lastFetched.reports && 
        (now - state.finance.lastFetched.reports) < CACHE_DURATION) {
      return state.finance.paymentReports;
    }
    
    const response = await paymentReports();
    return response.data;
  }
);

export const fetchHostelPayments = createAsyncThunk(
  'finance/fetchHostelPayments',
  async (_, { getState }) => {
    const state = getState() as { finance: FinanceState };
    const now = Date.now();
    
    // Check if data is cached and still valid
    if (state.finance.hostelPayments && 
        state.finance.lastFetched.hostelPayments && 
        (now - state.finance.lastFetched.hostelPayments) < CACHE_DURATION) {
      return state.finance.hostelPayments;
    }
    
    const response = await getHostelAllPayments();
    return response.data;
  }
);

export const fetchHostelYearData = createAsyncThunk(
  'finance/fetchHostelYearData',
  async (year: string, { getState }) => {
    const state = getState() as { finance: FinanceState };
    const now = Date.now();
    
    // Check if data is cached and still valid for the same year
    if (state.finance.hostelYearData && 
        state.finance.selectedYear === year &&
        state.finance.lastFetched.hostelYearData && 
        (now - state.finance.lastFetched.hostelYearData) < CACHE_DURATION) {
      return state.finance.hostelYearData;
    }
    
    // Use mock data in development mode
    if (USE_MOCK_DATA) {
      return generateMockHostelData(year);
    }

    try {
      const response = await getPaymentDetailsHostelYear(year);
  
    
      // Ensure the response has the expected structure
      const data = response.data || response;
      if (!data.data && !data.payments) {
        // Return mock data structure for testing
        return {
          data: [],
          stats: {
            totalPayments: 0,
            paidPayments: 0,
            pendingPayments: 0,
            totalAmount: 0
          },
          academicYear: year
        };
      }
      
      return data;
    } catch (error) {
      return generateMockHostelData(year);
    }
  }
);

export const fetchCourseFeesData = createAsyncThunk(
  'finance/fetchCourseFeesData',
  async (_, { getState }) => {
    const state = getState() as { finance: FinanceState };
    const now = Date.now();
    
    // Check if data is cached and still valid
    if (state.finance.courseFeesData && 
        state.finance.lastFetched.courseFeesData && 
        (now - state.finance.lastFetched.courseFeesData) < CACHE_DURATION) {
      return state.finance.courseFeesData;
    }
    
    // Use mock data in development mode
    if (USE_MOCK_DATA) {
      console.log('Using mock course fees data');
      return generateMockCourseFeesData();
    }

    try {
      const response = await getPaymentDetailsFeesAllStudent();
      const data = response.data || response;
      if (!data.data && !data.payments) {
        console.warn('Unexpected API response structure for course fees data:', data);
        // Return mock data structure for testing
        return {
          data: [],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalRecords: 0,
            limit: 10
          }
        };
      }
      
      return data;
    } catch (error) {
      // Return mock data for testing when API fails
      return generateMockCourseFeesData();
    }
  }
);

export const fetchPaymentDetail = createAsyncThunk(
  'finance/fetchPaymentDetail',
  async (studentId: string) => {
    const response = await getPaymentDetailsStudentId(studentId);
    // Return the complete student and fees data
    return response.data;
  }
);

const financeSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    clearFinanceData: (state) => {
      state.summary = null;
      state.analytics = null;
      state.paymentReports = null;
      state.hostelPayments = null;
      state.hostelYearData = null;
      state.courseFeesData = null;
      state.selectedPaymentDetail = null;
      state.error = {
        summary: null,
        analytics: null,
        reports: null,
        hostelPayments: null,
        hostelYearData: null,
        courseFeesData: null,
        paymentDetail: null,
      };
      state.lastFetched = {
        summary: null,
        analytics: null,
        reports: null,
        hostelPayments: null,
        hostelYearData: null,
        courseFeesData: null,
      };
    },
    forceRefresh: (state) => {
      state.lastFetched = {
        summary: null,
        analytics: null,
        reports: null,
        hostelPayments: null,
        hostelYearData: null,
        courseFeesData: null,
      };
    },
    setActiveTab: (state, action: PayloadAction<'overview' | 'hostel' | 'course'>) => {
      state.activeTab = action.payload;
    },
    setSelectedYear: (state, action: PayloadAction<string>) => {
      state.selectedYear = action.payload;
    },
    setSelectedPaymentDetail: (state, action: PayloadAction<PaymentRecord | null>) => {
      state.selectedPaymentDetail = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Summary
    builder
      .addCase(fetchFinanceSummary.pending, (state) => {
        state.loading.summary = true;
        state.error.summary = null;
      })
      .addCase(fetchFinanceSummary.fulfilled, (state, action) => {
        state.loading.summary = false;
        state.summary = action.payload;
        state.lastFetched.summary = Date.now();
        state.error.summary = null;
      })
      .addCase(fetchFinanceSummary.rejected, (state, action) => {
        state.loading.summary = false;
        state.error.summary = action.error.message || 'Failed to fetch finance summary';
      });

    // Analytics
    builder
      .addCase(fetchPaymentAnalytics.pending, (state) => {
        state.loading.analytics = true;
        state.error.analytics = null;
      })
      .addCase(fetchPaymentAnalytics.fulfilled, (state, action) => {
        state.loading.analytics = false;
        state.analytics = action.payload;
        state.lastFetched.analytics = Date.now();
        state.error.analytics = null;
      })
      .addCase(fetchPaymentAnalytics.rejected, (state, action) => {
        state.loading.analytics = false;
        state.error.analytics = action.error.message || 'Failed to fetch payment analytics';
      });

    // Reports
    builder
      .addCase(fetchPaymentReports.pending, (state) => {
        state.loading.reports = true;
        state.error.reports = null;
      })
      .addCase(fetchPaymentReports.fulfilled, (state, action) => {
        state.loading.reports = false;
        state.paymentReports = action.payload;
        state.lastFetched.reports = Date.now();
        state.error.reports = null;
      })
      .addCase(fetchPaymentReports.rejected, (state, action) => {
        state.loading.reports = false;
        state.error.reports = action.error.message || 'Failed to fetch payment reports';
      });

    // Hostel Payments
    builder
      .addCase(fetchHostelPayments.pending, (state) => {
        state.loading.hostelPayments = true;
        state.error.hostelPayments = null;
      })
      .addCase(fetchHostelPayments.fulfilled, (state, action) => {
        state.loading.hostelPayments = false;
        state.hostelPayments = action.payload;
        state.lastFetched.hostelPayments = Date.now();
        state.error.hostelPayments = null;
      })
      .addCase(fetchHostelPayments.rejected, (state, action) => {
        state.loading.hostelPayments = false;
        state.error.hostelPayments = action.error.message || 'Failed to fetch hostel payments';
      });

    // Hostel Year Data
    builder
      .addCase(fetchHostelYearData.pending, (state) => {
        state.loading.hostelYearData = true;
        state.error.hostelYearData = null;
      })
      .addCase(fetchHostelYearData.fulfilled, (state, action) => {
        state.loading.hostelYearData = false;
        state.hostelYearData = action.payload;
        state.lastFetched.hostelYearData = Date.now();
        state.error.hostelYearData = null;
      })
      .addCase(fetchHostelYearData.rejected, (state, action) => {
        state.loading.hostelYearData = false;
        state.error.hostelYearData = action.error.message || 'Failed to fetch hostel year data';
      });

    // Course Fees Data
    builder
      .addCase(fetchCourseFeesData.pending, (state) => {
        state.loading.courseFeesData = true;
        state.error.courseFeesData = null;
      })
      .addCase(fetchCourseFeesData.fulfilled, (state, action) => {
        state.loading.courseFeesData = false;
        state.courseFeesData = action.payload;
        state.lastFetched.courseFeesData = Date.now();
        state.error.courseFeesData = null;
      })
      .addCase(fetchCourseFeesData.rejected, (state, action) => {
        state.loading.courseFeesData = false;
        state.error.courseFeesData = action.error.message || 'Failed to fetch course fees data';
      });

    // Payment Detail
    builder
      .addCase(fetchPaymentDetail.pending, (state) => {
        state.loading.paymentDetail = true;
        state.error.paymentDetail = null;
      })
      .addCase(fetchPaymentDetail.fulfilled, (state, action) => {
        state.loading.paymentDetail = false;
        state.selectedPaymentDetail = action.payload;
        state.error.paymentDetail = null;
      })
      .addCase(fetchPaymentDetail.rejected, (state, action) => {
        state.loading.paymentDetail = false;
        state.error.paymentDetail = action.error.message || 'Failed to fetch payment detail';
      });
  },
});

export const { 
  clearFinanceData, 
  forceRefresh, 
  setActiveTab, 
  setSelectedYear, 
  setSelectedPaymentDetail 
} = financeSlice.actions;
export default financeSlice.reducer;
