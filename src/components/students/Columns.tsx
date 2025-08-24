"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Student } from "@/types/student";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal, Mail, Phone, Eye, CheckCircle, XCircle, Settings } from "lucide-react";

interface ColumnsProps {
  onApprovalAction?: (student: Student) => void;
}

export const createColumns = (onApprovalAction?: (student: Student) => void): ColumnDef<Student>[] => [
  {
    accessorKey: "photo",
    header: "Photo",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <Avatar className="h-10 w-10">
          <AvatarImage src={student.photo} alt={student.name} />
          <AvatarFallback>{student.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "rollno",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Roll No.
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("rollno")}</div>;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return (
        <div className="flex items-center">
          <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
            {email}
          </a>
        </div>
      );
    },
  },
  {
    accessorKey: "courseId",
    header: "Course",
    cell: ({ row }) => {
      const course = row.original.courseId;
      return (
        <div>
          <div className="font-medium">{course.name}</div>
          <div className="text-sm text-muted-foreground">{course.code}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      if (!category) return <span className="text-muted-foreground">-</span>;
      
      const getCategoryVariant = (cat: string) => {
        switch (cat) {
          case "General": return "default";
          case "OBC": return "secondary";
          case "SC": return "outline";
          case "ST": return "destructive";
          default: return "secondary";
        }
      };
      
      return <Badge variant={getCategoryVariant(category)}>{category}</Badge>;
    },
  },
  {
    accessorKey: "hostel_allocated",
    header: "Hostel Status",
    cell: ({ row }) => {
      const hostelAllocated = row.getValue("hostel_allocated") as boolean;
      const wantToApply = row.original.want_to_apply_for_hostel;
      
      return (
        <div className="flex flex-col gap-1">
          <Badge variant={hostelAllocated ? "default" : "secondary"}>
            {hostelAllocated ? "Allocated" : "Not Allocated"}
          </Badge>
          {wantToApply && !hostelAllocated && (
            <Badge variant="outline" className="text-xs">
              Applied
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "updatePermissionStatus",
    header: "Permission",
    cell: ({ row }) => {
      const status = row.getValue("updatePermissionStatus") as string;
      
      const getStatusVariant = (status: string) => {
        switch (status) {
          case "approved": return "default";
          case "requested": return "secondary";
          case "rejected": return "destructive";
          default: return "outline";
        }
      };
      
      return (
        <Badge variant={getStatusVariant(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const student = row.original;
      const hasPermissionRequest = student.updatePermissionStatus === 'requested';
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(student._id)}
            >
              Copy student ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Send email
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Phone className="mr-2 h-4 w-4" />
              Call student
            </DropdownMenuItem>
            {hasPermissionRequest && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onApprovalAction?.(student)}
                  className="text-blue-600"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Review Permission Request
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// For backward compatibility
export const columns = createColumns();
