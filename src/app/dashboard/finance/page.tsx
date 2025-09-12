'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/lib/store';
import { 
  fetchFinanceSummary, 
  fetchPaymentAnalytics, 
  fetchPaymentReports,
  fetchHostelPayments,
  fetchHostelYearData,
  fetchCourseFeesData,
  fetchPaymentDetail,
  forceRefresh,
  setActiveTab,
  setSelectedYear,
  setSelectedPaymentDetail
} from '@/app/lib/financeSlice';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { PaymentStatusChart } from '@/components/finance/PaymentStatusChart';
import { PaymentReportsTable } from '@/components/finance/PaymentReportsTable';
import { FinanceTabs } from '@/components/finance/FinanceTabs';
import { HostelPaymentsTable } from '@/components/finance/HostelPaymentsTable';
import { PaymentDetailDialog } from '@/components/finance/PaymentDetailDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  RefreshCw, 
  DollarSign, 
  Users, 
  Building, 
  GraduationCap,
  AlertCircle
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function FinancePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    summary, 
    analytics, 
    paymentReports,
    hostelPayments,
    courseFeesData,
    selectedPaymentDetail,
    selectedYear,
    activeTab,
    loading, 
    error 
  } = useSelector((state: RootState) => state.finance);

  useEffect(() => {
    // Load overview data on component mount
    dispatch(fetchFinanceSummary());
    dispatch(fetchPaymentAnalytics());
    dispatch(fetchPaymentReports());
  }, [dispatch]);

  useEffect(() => {
    // Load tab-specific data when tab changes
    if (activeTab === 'hostel') {
      dispatch(fetchHostelPayments());
    } else if (activeTab === 'course') {
      dispatch(fetchCourseFeesData());
    }
  }, [dispatch, activeTab]);

  const handleRefresh = () => {
    dispatch(forceRefresh());
    dispatch(fetchFinanceSummary());
    dispatch(fetchPaymentAnalytics());
    dispatch(fetchPaymentReports());
    
    if (activeTab === 'hostel') {
      dispatch(fetchHostelPayments());
    } else if (activeTab === 'course') {
      dispatch(fetchCourseFeesData());
    }
  };

  const handleTabChange = (tab: 'overview' | 'hostel' | 'course') => {
    dispatch(setActiveTab(tab));
  };

  const handleYearChange = (year: string) => {
    dispatch(setSelectedYear(year));
  };

  const handleViewPaymentDetails = (paymentId: string) => {
    dispatch(fetchPaymentDetail(paymentId));
  };

  const handleViewStudentDetails = (studentId: string) => {
    dispatch(fetchPaymentDetail(studentId));
  };

  const handleClosePaymentDetail = () => {
    dispatch(setSelectedPaymentDetail(null));
  };

  const handleExportHostel = () => {
    // Export hostel data logic
    console.log('Exporting hostel data...');
  };

  const handleExportCourse = () => {
    // Export course data logic
    console.log('Exporting course data...');
  };

  const isLoading = loading.summary || loading.analytics || loading.reports || 
                   loading.hostelPayments || loading.courseFeesData;
  const hasError = error.summary || error.analytics || error.reports || 
                  error.hostelPayments || error.courseFeesData;
  // Debug panel for development
  const showDebugPanel = process.env.NODE_ENV === 'development';
  
  // Test API connection
  const testApiConnection = async () => {
    try {
      const response = await fetch('/api/test-connection');
      console.log('API Test Response:', response);
    } catch (error) {
      console.log('API Test Error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of payments, analytics, and financial reports
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Error Alert */}
      {hasError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.summary || error.analytics || error.reports || 
             error.hostelPayments || error.hostelYearData || error.courseFeesData}
          </AlertDescription>
        </Alert>
      )}

      {/* Finance Tabs */}
      <FinanceTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
        hostelStats={hostelPayments?.data ? {
          totalPayments: hostelPayments.data.length,
          paidPayments: hostelPayments.data.filter(p => p.paymentStatus === 'paid').length,
          pendingPayments: hostelPayments.data.filter(p => p.paymentStatus === 'pending').length,
          totalAmount: hostelPayments.data.reduce((sum, p) => sum + (p.paymentAmount || 0), 0)
        } : undefined}
        courseStats={courseFeesData?.data ? {
          totalPayments: courseFeesData.data.length,
          paidPayments: courseFeesData.data.filter(p => p.paymentStatus === 'paid').length,
          pendingPayments: courseFeesData.data.filter(p => p.paymentStatus === 'pending').length,
          totalAmount: courseFeesData.data.reduce((sum, p) => sum + (p.finalAmount || p.amount || 0), 0)
        } : undefined}
        onExportHostel={handleExportHostel}
        onExportCourse={handleExportCourse}
        loading={isLoading}
      />

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Summary Cards */}
          {summary && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Revenue"
                value={`₹${(summary.hostel.paid.amount + summary.courseFees.paid.amount).toLocaleString()}`}
                description="From all paid payments"
                icon={<DollarSign className="h-4 w-4" />}
                trend={{
                  value: 12.5,
                  isPositive: true
                }}
              />
              <StatsCard
                title="Hostel Payments"
                value={summary.hostel.paid.count}
                description={`₹${summary.hostel.paid.amount.toLocaleString()} collected`}
                icon={<Building className="h-4 w-4" />}
              />
              <StatsCard
                title="Course Fees"
                value={summary.courseFees.paid.count}
                description={`₹${summary.courseFees.paid.amount.toLocaleString()} collected`}
                icon={<GraduationCap className="h-4 w-4" />}
              />
              <StatsCard
                title="Total Students"
                value={summary.hostel.paid.count + summary.courseFees.paid.count}
                description="Students with payments"
                icon={<Users className="h-4 w-4" />}
              />
            </div>
          )}

          {/* Analytics Charts */}
          {analytics && (
            <div className="grid gap-6 md:grid-cols-2">
              <PaymentStatusChart
                data={analytics.hostelPaymentStatus}
                title="Hostel Payment Status"
                type="hostel"
              />
              <PaymentStatusChart
                data={analytics.courseFeesStatus}
                title="Course Fees Status"
                type="course"
              />
            </div>
          )}

          {/* Payment Reports Tables */}
          {paymentReports && (
            <div className="space-y-6">
              <PaymentReportsTable
                title="Hostel Payments"
                payments={paymentReports.hostelPayments}
                type="hostel"
                loading={loading.reports}
                onViewDetails={handleViewStudentDetails}
              />
              
              <PaymentReportsTable
                title="Course Fee Payments"
                payments={paymentReports.courseFeePayments}
                type="course"
                loading={loading.reports}
                onViewDetails={handleViewStudentDetails}
              />
            </div>
          )}
        </>
      )}

      {/* Hostel Tab Content */}
      {activeTab === 'hostel' && (
        <>
          {loading.hostelPayments && !hostelPayments ? (
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
          ) : error.hostelPayments ? (
            <Card>
              <CardHeader>
                <CardTitle>Hostel Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <div className="text-red-600 font-medium">Error loading hostel payments</div>
                    <div className="text-sm text-muted-foreground mt-1">{error.hostelPayments}</div>
                    <Button 
                      onClick={() => {
                        dispatch(fetchHostelPayments());
                      }}
                      className="mt-4"
                      variant="outline"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <HostelPaymentsTable
              payments={hostelPayments?.data || []}
              loading={loading.hostelPayments}
              onViewDetails={handleViewPaymentDetails}
              selectedYear={selectedYear}
              showStudentDetails={true}
            />
          )}
        </>
      )}

      {/* Course Tab Content */}
      {activeTab === 'course' && (
        <>
          {loading.courseFeesData && !courseFeesData ? (
            <Card>
              <CardHeader>
                <CardTitle>Course Fee Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64">
                  <div className="text-muted-foreground">Loading course fee payments...</div>
                </div>
              </CardContent>
            </Card>
          ) : error.courseFeesData ? (
            <Card>
              <CardHeader>
                <CardTitle>Course Fee Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <div className="text-red-600 font-medium">Error loading course fee payments</div>
                    <div className="text-sm text-muted-foreground mt-1">{error.courseFeesData}</div>
                    <Button 
                      onClick={() => {
                        dispatch(fetchCourseFeesData());
                      }}
                      className="mt-4"
                      variant="outline"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <PaymentReportsTable
              title="Course Fee Payments"
              payments={courseFeesData?.data || []}
              type="course"
              loading={loading.courseFeesData}
              onViewDetails={handleViewStudentDetails}
              showStudentDetails={true}
            />
          )}
        </>
      )}

      {/* Loading State */}
      {isLoading && !summary && !analytics && !paymentReports && (
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent className="animate-pulse">
                  <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="animate-pulse">
                  <div className="h-6 bg-muted rounded w-1/3"></div>
                </CardHeader>
                <CardContent className="animate-pulse">
                  <div className="space-y-4">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}


      {/* Payment Detail Dialog */}
      <PaymentDetailDialog
        payment={(selectedPaymentDetail as any)?.data || selectedPaymentDetail}
        isOpen={!!selectedPaymentDetail}
        onClose={handleClosePaymentDetail}
        loading={loading.paymentDetail}
      />
    </div>
  );
}