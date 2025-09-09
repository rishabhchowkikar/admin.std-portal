import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  GraduationCap, 
  BarChart3, 
  Users,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FinanceTabsProps {
  activeTab: 'overview' | 'hostel' | 'course';
  onTabChange: (tab: 'overview' | 'hostel' | 'course') => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  hostelStats?: {
    totalPayments: number;
    paidPayments: number;
    pendingPayments: number;
    totalAmount: number;
  };
  courseStats?: {
    totalPayments: number;
    paidPayments: number;
    pendingPayments: number;
    totalAmount: number;
  };
  onExportHostel: () => void;
  onExportCourse: () => void;
  loading?: boolean;
}

const academicYears = [
  '2024-2025',
  '2025-2026',
  '2026-2027',
  '2027-2028'
];

export function FinanceTabs({
  activeTab,
  onTabChange,
  selectedYear,
  onYearChange,
  hostelStats,
  courseStats,
  onExportHostel,
  onExportCourse,
  loading = false
}: FinanceTabsProps) {
  const tabs = [
    {
      id: 'overview' as const,
      label: 'Overview',
      icon: <BarChart3 className="h-4 w-4" />,
      description: 'Dashboard summary and analytics'
    },
    {
      id: 'hostel' as const,
      label: 'Hostel Payments',
      icon: <Building className="h-4 w-4" />,
      description: 'Hostel payment management',
      stats: hostelStats
    },
    {
      id: 'course' as const,
      label: 'Course Fees',
      icon: <GraduationCap className="h-4 w-4" />,
      description: 'Course fee management',
      stats: courseStats
    }
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              disabled={loading}
              className={`
                group inline-flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-gray-700 hover:border-gray-300'
                }
                ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {tab.icon}
              {tab.label}
              {tab.stats && (
                <Badge variant="secondary" className="ml-1">
                  {tab.stats.totalPayments}
                </Badge>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {tabs.find(tab => tab.id === activeTab)?.label}
          </h2>
          <p className="text-muted-foreground">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>

        {/* Year Filter and Export Buttons */}
        {activeTab !== 'overview' && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedYear} onValueChange={onYearChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={activeTab === 'hostel' ? onExportHostel : onExportCourse}
              size="sm"
              className="gap-2"
              disabled={loading}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        )}
      </div>

      {/* Stats Cards for Hostel and Course Tabs */}
      {activeTab === 'hostel' && hostelStats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hostelStats.totalPayments}</div>
              <p className="text-xs text-muted-foreground">
                All hostel payments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid</CardTitle>
              <Badge className="bg-green-100 text-green-800">Paid</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{hostelStats.paidPayments}</div>
              <p className="text-xs text-muted-foreground">
                Successfully paid
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{hostelStats.pendingPayments}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting payment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{hostelStats.totalAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Total collected
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'course' && courseStats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courseStats.totalPayments}</div>
              <p className="text-xs text-muted-foreground">
                All course fee payments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid</CardTitle>
              <Badge className="bg-green-100 text-green-800">Paid</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{courseStats.paidPayments}</div>
              <p className="text-xs text-muted-foreground">
                Successfully paid
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{courseStats.pendingPayments}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting payment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{courseStats.totalAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Total collected
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
