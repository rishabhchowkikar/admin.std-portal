'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { User, Search, Users, CheckCircle, Trash2, UserPlus } from 'lucide-react';
import { Teacher } from '@/types/teacher';
import { fetchAllTeachers } from '@/utils/api/teacherApi';
import { assignTeachersToCourse } from '@/utils/api/courseApi';
import { toast } from 'sonner';

interface AssignTeachersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseName: string;
  assignedTeachers: Teacher[];
  onSuccess: () => void;
}

export function AssignTeachersDialog({
  isOpen,
  onClose,
  courseId,
  courseName,
  assignedTeachers,
  onSuccess
}: AssignTeachersDialogProps) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);

  // Load teachers when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadTeachers();
    }
  }, [isOpen]);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const teachersData = await fetchAllTeachers();
      setTeachers(teachersData);
    } catch (error: any) {
      toast.error('Failed to load teachers');
      console.error('Error loading teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get assigned teacher IDs
  const assignedTeacherIds = assignedTeachers.map(teacher => teacher._id);

  // Filter teachers into assigned and unassigned
  const getFilteredTeachers = () => {
    const filtered = teachers.filter(teacher =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {
      assigned: filtered.filter(teacher => assignedTeacherIds.includes(teacher._id)),
      unassigned: filtered.filter(teacher => !assignedTeacherIds.includes(teacher._id))
    };
  };

  const handleTeacherToggle = (teacherId: string) => {
    setSelectedTeachers(prev => 
      prev.includes(teacherId) 
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const handleSelectAllUnassigned = () => {
    const { unassigned } = getFilteredTeachers();
    const allSelected = unassigned.every(teacher => 
      selectedTeachers.includes(teacher._id)
    );
    
    if (allSelected) {
      // Deselect all unassigned teachers
      setSelectedTeachers(prev => 
        prev.filter(id => !unassigned.some(teacher => teacher._id === id))
      );
    } else {
      // Select all unassigned teachers
      const newSelections = unassigned
        .filter(teacher => !selectedTeachers.includes(teacher._id))
        .map(teacher => teacher._id);
      setSelectedTeachers(prev => [...prev, ...newSelections]);
    }
  };

  const handleAssign = async () => {
    try {
      setAssigning(true);
      
      // Combine currently assigned teachers with newly selected ones
      const allTeacherIds = [...assignedTeacherIds, ...selectedTeachers];
      
      await assignTeachersToCourse({
        courseId,
        teacherIds: allTeacherIds
      });
      
      toast.success(`Successfully assigned ${selectedTeachers.length} teachers to ${courseName}`);
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to assign teachers');
    } finally {
      setAssigning(false);
    }
  };

  const handleRemoveTeacher = async (teacherId: string) => {
    try {
      setAssigning(true);
      
      // Remove the teacher from assigned list
      const updatedTeacherIds = assignedTeacherIds.filter(id => id !== teacherId);
      
      await assignTeachersToCourse({
        courseId,
        teacherIds: updatedTeacherIds
      });
      
      toast.success('Teacher removed successfully');
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove teacher');
    } finally {
      setAssigning(false);
    }
  };

  const { assigned, unassigned } = getFilteredTeachers();
  const allUnassignedSelected = unassigned.length > 0 && 
    unassigned.every(teacher => selectedTeachers.includes(teacher._id));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Users className="h-6 w-6 text-purple-600" />
            Assign Teachers to {courseName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col px-6 py-4 space-y-6 overflow-hidden">
          {/* Search */}
          <div className="relative flex-shrink-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search teachers by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-base"
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 flex-1 min-h-0 overflow-hidden">
            {/* Unassigned Teachers Section */}
            <div className="flex flex-col space-y-4 min-h-0">
              <div className="flex items-center justify-between flex-shrink-0">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <UserPlus className="h-6 w-6 text-blue-600" />
                  Available Teachers
                </h3>
                <Badge variant="secondary" className="bg-blue-50 text-blue-600 text-base px-3 py-1">
                  {unassigned.length} available
                </Badge>
              </div>

              {/* Select All for Unassigned */}
              {unassigned.length > 0 && (
                <div className="flex items-center space-x-3 flex-shrink-0">
                  <Checkbox
                    id="select-all-unassigned"
                    checked={allUnassignedSelected}
                    onCheckedChange={handleSelectAllUnassigned}
                    className="h-5 w-5"
                  />
                  <Label htmlFor="select-all-unassigned" className="text-base font-medium">
                    Select All ({unassigned.length} teachers)
                  </Label>
                </div>
              )}

              <div className="flex-1 min-h-0 border rounded-lg overflow-hidden">
                <ScrollArea className="h-full">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-lg text-gray-500">Loading teachers...</div>
                    </div>
                  ) : unassigned.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                      <User className="h-16 w-16 mb-4" />
                      <p className="text-lg">No available teachers</p>
                    </div>
                  ) : (
                    <div className="p-4 space-y-3">
                      {unassigned.map((teacher) => (
                        <div
                          key={teacher._id}
                          className="flex items-start space-x-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                        >
                          <Checkbox
                            id={teacher._id}
                            checked={selectedTeachers.includes(teacher._id)}
                            onCheckedChange={() => handleTeacherToggle(teacher._id)}
                            className="mt-1 h-5 w-5"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="text-base font-medium text-gray-900">
                                {teacher.name}
                              </p>
                              {selectedTeachers.includes(teacher._id) && (
                                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mb-3">{teacher.email}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-sm px-2 py-1">
                                {teacher.department}
                              </Badge>
                              <Badge variant="secondary" className="text-sm px-2 py-1">
                                {teacher.role}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>

            {/* Assigned Teachers Section */}
            <div className="flex flex-col space-y-4 min-h-0">
              <div className="flex items-center justify-between flex-shrink-0">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  Assigned Teachers
                </h3>
                <Badge variant="secondary" className="bg-green-50 text-green-600 text-base px-3 py-1">
                  {assigned.length} assigned
                </Badge>
              </div>

              <div className="flex-1 min-h-0 border rounded-lg overflow-hidden">
                <ScrollArea className="h-full">
                  {assigned.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                      <Users className="h-16 w-16 mb-4" />
                      <p className="text-lg">No teachers assigned yet</p>
                    </div>
                  ) : (
                    <div className="p-4 space-y-3">
                      {assigned.map((teacher) => (
                        <div
                          key={teacher._id}
                          className="flex items-start space-x-4 p-4 rounded-lg border bg-green-50 border-green-200 hover:bg-green-100 transition-colors"
                        >
                          <div className="mt-1">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="text-base font-medium text-gray-900">
                                {teacher.name}
                              </p>
                              <Badge variant="secondary" className="text-sm px-2 py-1 bg-green-100 text-green-700">
                                Assigned
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 mb-3">{teacher.email}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-sm px-2 py-1">
                                {teacher.department}
                              </Badge>
                              <Badge variant="secondary" className="text-sm px-2 py-1">
                                {teacher.role}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTeacher(teacher._id)}
                            disabled={assigning}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-gray-50 flex-shrink-0">
          <Button variant="outline" onClick={onClose} disabled={assigning} className="h-12 px-6">
            Cancel
          </Button>
          <Button 
            onClick={handleAssign} 
            disabled={assigning || selectedTeachers.length === 0}
            className="bg-purple-600 hover:bg-purple-700 h-12 px-6"
          >
            {assigning ? 'Processing...' : `Assign ${selectedTeachers.length} Teachers`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}