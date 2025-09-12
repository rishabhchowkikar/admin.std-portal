import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';

interface ExamFiltersProps {
  filters: {
    status: 'all' | 'verified' | 'pending';
    semester: 'all' | number;
    course: string;
    search: string;
  };
  onFilterChange: (filters: Partial<ExamFiltersProps['filters']>) => void;
  onResetFilters: () => void;
}

const ExamFilters: React.FC<ExamFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters
}) => {
  const handleStatusChange = (value: string) => {
    onFilterChange({ status: value as 'all' | 'verified' | 'pending' });
  };

  const handleSemesterChange = (value: string) => {
    onFilterChange({ semester: value === 'all' ? 'all' : parseInt(value) });
  };

  const handleCourseChange = (value: string) => {
    onFilterChange({ course: value });
  };

  const handleSearchChange = (value: string) => {
    onFilterChange({ search: value });
  };

  const hasActiveFilters = 
    filters.status !== 'all' || 
    filters.semester !== 'all' || 
    filters.course !== '' || 
    filters.search !== '';

  return (
    <Card className='gap-0 py-0 px-0 shadow-none border-none bg-transparent'>
      <CardContent className="space-y-4 px-0">
        <div className="grid gap-4 md:grid-cols-2 ">
          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, roll no..."
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          

          {/* Course Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Course</label>
            <Input
              placeholder="Course code or name"
              value={filters.course}
              onChange={(e) => handleCourseChange(e.target.value)}
            />
          </div>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExamFilters;
