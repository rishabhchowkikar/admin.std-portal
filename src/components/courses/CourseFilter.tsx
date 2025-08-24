// components/courses/CourseFilters.tsx (or CourseFilter.tsx)
import { useState } from 'react';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Search, Filter, X } from "lucide-react";

interface CourseFiltersProps {
    onSearch: (query: string) => void;
    onFilterByDepartment: (department: string | null) => void;
    onFilterByStatus: (status: string | null) => void;
    departments: string[];
    activeFilters: {
        search: string;
        department: string | null;
        status: string | null;
    };
    onClearFilters: () => void;
}

export function CourseFilters({
    onSearch,
    onFilterByDepartment,
    onFilterByStatus,
    departments,
    activeFilters,
    onClearFilters
}: CourseFiltersProps) {
    const [searchValue, setSearchValue] = useState(activeFilters.search);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchValue);
    };

    const hasActiveFilters = activeFilters.search || activeFilters.department || activeFilters.status;

    return (
        <div className="space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search courses by name, code, or description..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button type="submit" variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Search
                </Button>
            </form>

            <div className="flex flex-wrap gap-3 items-center">
                <Select
                    value={activeFilters.department || "all-departments"}
                    onValueChange={(value) => onFilterByDepartment(value === "all-departments" ? null : value)}
                >
                    <SelectTrigger className="w-64">
                        <SelectValue placeholder="Filter by Department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all-departments">All Departments</SelectItem>
                        {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                                {dept}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={activeFilters.status || "all-status"}
                    onValueChange={(value) => onFilterByStatus(value === "all-status" ? null : value)}
                >
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all-status">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>

                {hasActiveFilters && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={onClearFilters}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4 mr-1" />
                        Clear Filters
                    </Button>
                )}
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                    {activeFilters.search && (
                        <Badge variant="secondary" className="gap-1">
                            Search: "{activeFilters.search}"
                            <X 
                                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                                onClick={() => {
                                    setSearchValue('');
                                    onSearch('');
                                }}
                            />
                        </Badge>
                    )}
                    {activeFilters.department && (
                        <Badge variant="secondary" className="gap-1">
                            Dept: {activeFilters.department}
                            <X 
                                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                                onClick={() => onFilterByDepartment(null)}
                            />
                        </Badge>
                    )}
                    {activeFilters.status && (
                        <Badge variant="secondary" className="gap-1">
                            Status: {activeFilters.status}
                            <X 
                                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                                onClick={() => onFilterByStatus(null)}
                            />
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
}
