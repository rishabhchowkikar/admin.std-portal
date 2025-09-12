'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/lib/store';
import { 
  fetchExamForms, 
  verifyExamFormAction, 
  generateHallTicketAction,
  setFilters,
  resetFilters,
  selectFilteredExamForms
} from '@/app/lib/examSlice';
import ExamSummaryCards from '@/components/exam/ExamSummaryCards';
import ExamFilters from '@/components/exam/ExamFilters';
import ExamFormsTable from '@/components/exam/ExamFormsTable';
import ExamFormDetailsDialog from '@/components/exam/ExamFormDetailsDialog';
import { ExamForm } from '@/types/exam';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

const ExamPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { examForms, summary, loading, error, filters } = useSelector((state: RootState) => state.exam);
  const filteredExamForms = useSelector(selectFilteredExamForms);
  
  const [selectedExamForm, setSelectedExamForm] = useState<ExamForm | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchExamForms());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchExamForms());
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    dispatch(setFilters(newFilters));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  const handleVerify = async (examFormId: string) => {
    try {
      await dispatch(verifyExamFormAction(examFormId)).unwrap();
      toast.success('Exam form verified successfully');
    } catch (error: any) {
      toast.error(error || 'Failed to verify exam form');
    }
  };

  const handleGenerateHallTicket = async (examForm: { examFormId: string; studentId: string; courseId: string; semester: number }) => {
    try {
      await dispatch(generateHallTicketAction(examForm)).unwrap();
      toast.success('Hall ticket generated successfully');
    } catch (error: any) {
      toast.error(error || 'Failed to generate hall ticket');
    }
  };

  const handleViewDetails = (examForm: ExamForm) => {
    setSelectedExamForm(examForm);
    setIsDetailsDialogOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsDialogOpen(false);
    setSelectedExamForm(null);
  };

  const handleExport = () => {
    toast.info('Export functionality coming soon');
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Exam Management</h1>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <h3 className="text-lg font-semibold">Error loading exam data</h3>
            <p className="text-sm">{error}</p>
          </div>
          <Button onClick={handleRefresh}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exam Management</h1>
          <p className="text-gray-600 mt-1">
            Manage exam forms, verify registrations, and generate hall tickets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/exam/bulk-verify">
            <Button variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
              <CheckCircle2 className="h-4 w-4" />
              Bulk Verify
            </Button>
          </Link>
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleRefresh} variant="outline" disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <ExamSummaryCards summary={summary} loading={loading} />

      {/* Filters */}
      <ExamFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Exam Forms Table */}
      <ExamFormsTable
        examForms={filteredExamForms}
        loading={loading}
        onVerify={handleVerify}
        onGenerateHallTicket={handleGenerateHallTicket}
        onViewDetails={handleViewDetails}
      />

      {/* Details Dialog */}
      <ExamFormDetailsDialog
        examForm={selectedExamForm}
        isOpen={isDetailsDialogOpen}
        onClose={handleCloseDetails}
        onVerify={handleVerify}
        onGenerateHallTicket={handleGenerateHallTicket}
      />
    </div>
  );
};

export default ExamPage;