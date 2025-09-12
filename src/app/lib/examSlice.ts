import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ExamForm, ExamSummary } from '@/types/exam';
import { 
  fetchAllExamForms, 
  getExamFormsSummary, 
  verifyExamForm, 
  generateHallTicket, 
  bulkVerifyExamForms,
  enableStudentHallTicket,
  bulkEnableHallTickets,
  holdStudentHallTicket,
  releaseStudentHallTicket
} from '@/utils/api/examApi';

interface ExamState {
  examForms: ExamForm[];
  summary: ExamSummary | null;
  loading: boolean;
  error: string | null;
  filters: {
    status: 'all' | 'verified' | 'pending';
    semester: 'all' | number;
    course: string;
    search: string;
  };
}

const initialState: ExamState = {
  examForms: [],
  summary: null,
  loading: false,
  error: null,
  filters: {
    status: 'all',
    semester: 'all',
    course: '',
    search: ''
  }
};

// Async thunks
export const fetchExamForms = createAsyncThunk(
  'exam/fetchExamForms',
  async (_, { rejectWithValue }) => {
    try {
      const result = await getExamFormsSummary();
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch exam forms');
    }
  }
);

export const verifyExamFormAction = createAsyncThunk(
  'exam/verifyExamForm',
  async (examFormId: string, { rejectWithValue }) => {
    try {
      const result = await verifyExamForm(examFormId);
      return { examFormId, result };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to verify exam form');
    }
  }
);

export const generateHallTicketAction = createAsyncThunk(
  'exam/generateHallTicket',
  async (examForm: { examFormId: string; studentId: string; courseId: string; semester: number }, { rejectWithValue }) => {
    try {
      const result = await generateHallTicket({
        studentId: examForm.studentId,
        courseId: examForm.courseId,
        semester: examForm.semester
      });
      return { examFormId: examForm.examFormId, result };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to generate hall ticket');
    }
  }
);

export const bulkVerifyExamFormsAction = createAsyncThunk(
  'exam/bulkVerifyExamForms',
  async ({ courseId, semester, currentSession }: { courseId: string; semester: number; currentSession: string }, { rejectWithValue }) => {
    try {
      const result = await bulkVerifyExamForms(courseId, semester, currentSession);
      return { courseId, semester, currentSession, result };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to bulk verify exam forms');
    }
  }
);

export const enableStudentHallTicketAction = createAsyncThunk(
  'exam/enableStudentHallTicket',
  async ({ studentId, courseId, semester }: { studentId: string; courseId: string; semester: number }, { rejectWithValue }) => {
    try {
      const result = await enableStudentHallTicket(studentId, courseId, semester);
      return { studentId, result };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to enable student hall ticket');
    }
  }
);

export const bulkEnableHallTicketsAction = createAsyncThunk(
  'exam/bulkEnableHallTickets',
  async ({ courseId, semester }: { courseId: string; semester: number }, { rejectWithValue }) => {
    try {
      const result = await bulkEnableHallTickets(courseId, semester);
      return { courseId, semester, result };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to bulk enable hall tickets');
    }
  }
);

export const holdStudentHallTicketAction = createAsyncThunk(
  'exam/holdStudentHallTicket',
  async (studentId: string, { rejectWithValue }) => {
    try {
      const result = await holdStudentHallTicket(studentId);
      return { studentId, result };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to hold student hall ticket');
    }
  }
);

export const releaseStudentHallTicketAction = createAsyncThunk(
  'exam/releaseStudentHallTicket',
  async ({ studentId, courseId, semester }: { studentId: string; courseId: string; semester: number }, { rejectWithValue }) => {
    try {
      const result = await releaseStudentHallTicket(studentId, courseId, semester);
      return { studentId, result };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to release student hall ticket');
    }
  }
);

const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ExamState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch exam forms
      .addCase(fetchExamForms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExamForms.fulfilled, (state, action) => {
        state.loading = false;
        state.examForms = action.payload.data;
        state.summary = action.payload.summary;
      })
      .addCase(fetchExamForms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Verify exam form
      .addCase(verifyExamFormAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyExamFormAction.fulfilled, (state, action) => {
        state.loading = false;
        const examForm = state.examForms.find(form => form._id === action.payload.examFormId);
        if (examForm) {
          examForm.examRegistration.isVerified = true;
        }
        if (state.summary) {
          state.summary.verified += 1;
          state.summary.pending -= 1;
        }
      })
      .addCase(verifyExamFormAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Generate hall ticket
      .addCase(generateHallTicketAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateHallTicketAction.fulfilled, (state, action) => {
        state.loading = false;
        const examForm = state.examForms.find(form => form._id === action.payload.examFormId);
        if (examForm) {
          examForm.examRegistration.hallTicketAvailable = true;
        }
        if (state.summary) {
          state.summary.hallTicketAvailable += 1;
        }
      })
      .addCase(generateHallTicketAction.rejected, (state, action) => {
        state.loading = false;
        // Don't set error state for generate hall ticket to avoid showing error page
      })
      // Bulk verify exam forms
      .addCase(bulkVerifyExamFormsAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkVerifyExamFormsAction.fulfilled, (state, action) => {
        state.loading = false;
        const { courseId, semester, currentSession } = action.payload;
        
        // Update all matching exam forms
        state.examForms.forEach(form => {
          if (form.studentId.courseId._id === courseId && 
              form.semester === semester && 
              form.currentSession === currentSession) {
            form.examRegistration.isVerified = true;
          }
        });
        
        // Update summary
        if (state.summary) {
          const verifiedCount = state.examForms.filter(form => 
            form.studentId.courseId._id === courseId && 
            form.semester === semester && 
            form.currentSession === currentSession
          ).length;
          state.summary.verified += verifiedCount;
          state.summary.pending -= verifiedCount;
        }
      })
      .addCase(bulkVerifyExamFormsAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Enable student hall ticket
      .addCase(enableStudentHallTicketAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enableStudentHallTicketAction.fulfilled, (state, action) => {
        state.loading = false;
        const examForm = state.examForms.find(form => form.studentId._id === action.payload.studentId);
        if (examForm) {
          examForm.examRegistration.hallTicketEnabled = true;
          examForm.examRegistration.hallTicketHeld = false;
          examForm.examRegistration.hallTicketAvailable = true;
        }
      })
      .addCase(enableStudentHallTicketAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Bulk enable hall tickets
      .addCase(bulkEnableHallTicketsAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkEnableHallTicketsAction.fulfilled, (state, action) => {
        state.loading = false;
        const { courseId, semester } = action.payload;
        state.examForms.forEach(form => {
          if (form.studentId.courseId._id === courseId && form.semester === semester) {
            form.examRegistration.hallTicketEnabled = true;
            form.examRegistration.hallTicketHeld = false;
            form.examRegistration.hallTicketAvailable = true;
          }
        });
      })
      .addCase(bulkEnableHallTicketsAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Hold student hall ticket
      .addCase(holdStudentHallTicketAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(holdStudentHallTicketAction.fulfilled, (state, action) => {
        state.loading = false;
        const examForm = state.examForms.find(form => form.studentId._id === action.payload.studentId);
        if (examForm) {
          examForm.examRegistration.hallTicketEnabled = false;
          examForm.examRegistration.hallTicketHeld = true;
          examForm.examRegistration.hallTicketAvailable = false;
        }
      })
      .addCase(holdStudentHallTicketAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Release student hall ticket
      .addCase(releaseStudentHallTicketAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(releaseStudentHallTicketAction.fulfilled, (state, action) => {
        state.loading = false;
        const examForm = state.examForms.find(form => form.studentId._id === action.payload.studentId);
        if (examForm) {
          examForm.examRegistration.hallTicketEnabled = true;
          examForm.examRegistration.hallTicketHeld = false;
          examForm.examRegistration.hallTicketAvailable = true;
        }
      })
      .addCase(releaseStudentHallTicketAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setFilters, clearError, resetFilters } = examSlice.actions;

// Selectors
export const selectFilteredExamForms = (state: { exam: ExamState }) => {
  const { examForms, filters } = state.exam;
  
  return examForms.filter(form => {
    // Status filter
    if (filters.status !== 'all') {
      const isVerified = form.examRegistration.isVerified;
      if (filters.status === 'verified' && !isVerified) return false;
      if (filters.status === 'pending' && isVerified) return false;
    }
    
    // Semester filter
    if (filters.semester !== 'all' && form.semester !== filters.semester) {
      return false;
    }
    
    // Course filter
    if (filters.course && !form.studentId.courseId.code.toLowerCase().includes(filters.course.toLowerCase())) {
      return false;
    }
    
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesName = form.studentId.name.toLowerCase().includes(searchTerm);
      const matchesEmail = form.studentId.email.toLowerCase().includes(searchTerm);
      const matchesRollNo = form.studentId.rollno.toString().includes(searchTerm);
      const matchesCourse = form.studentId.courseId.name.toLowerCase().includes(searchTerm);
      
      if (!matchesName && !matchesEmail && !matchesRollNo && !matchesCourse) {
        return false;
      }
    }
    
    return true;
  });
};

export default examSlice.reducer;
