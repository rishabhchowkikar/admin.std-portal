"use client";

import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Student } from '@/types/student';

interface ApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  onApprove: (studentId: string, comments?: string) => Promise<void>;
  onReject: (studentId: string, comments: string) => Promise<void>;
  isProcessing: boolean;
}

const ApprovalDialog: React.FC<ApprovalDialogProps> = ({
  open,
  onOpenChange,
  student,
  onApprove,
  onReject,
  isProcessing
}) => {
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [comments, setComments] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleApprove = () => {
    if (showComments) {
      onApprove(student!._id, comments);
      resetDialog();
    } else {
      setAction('approve');
      setShowComments(true);
    }
  };

  const handleReject = () => {
    setAction('reject');
    setShowComments(true);
  };

  const handleConfirm = () => {
    if (action === 'approve') {
      onApprove(student!._id, comments || 'Approved by admin');
    } else if (action === 'reject') {
      if (!comments.trim()) {
        return; // Comments required for rejection
      }
      onReject(student!._id, comments);
    }
    resetDialog();
  };

  const resetDialog = () => {
    setAction(null);
    setComments('');
    setShowComments(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetDialog();
    }
    onOpenChange(open);
  };

  if (!student) return null;

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-2xl mx-4 shadow-xl z-50 focus:outline-none">
          <div className="flex justify-between items-start mb-4">
            <Dialog.Title className="text-xl font-semibold">
              {showComments 
                ? `${action === 'approve' ? 'Approve' : 'Reject'} Update Request`
                : 'Student Update Permission Request'
              }
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-4">
            {/* Student Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-lg">
                    {student.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{student.name}</h3>
                  <p className="text-gray-600">Roll No: {student.rollno}</p>
                  <p className="text-gray-600">{student.email}</p>
                </div>
                <div className="ml-auto">
                  <Badge variant={
                    student.updatePermissionStatus === 'requested' ? 'secondary' :
                    student.updatePermissionStatus === 'approved' ? 'default' :
                    student.updatePermissionStatus === 'rejected' ? 'destructive' :
                    'outline'
                  }>
                    {student.updatePermissionStatus?.charAt(0).toUpperCase() + 
                     student.updatePermissionStatus?.slice(1) || 'None'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Permission Request Details */}
            {student.updatePermissionReason && (
              <div>
                <Label className="text-sm font-medium">Request Reason:</Label>
                <p className="text-gray-700 mt-1 p-3 bg-gray-50 rounded-md">
                  {student.updatePermissionReason}
                </p>
              </div>
            )}

            {/* Requested Changes Summary */}
            {student.changesSummary && (
              <div>
                <Label className="text-sm font-medium">Requested Changes:</Label>
                <p className="text-gray-700 mt-1 p-3 bg-gray-50 rounded-md">
                  {student.changesSummary}
                </p>
              </div>
            )}

            {/* Comments Section */}
            {showComments && (
              <div>
                <Label htmlFor="comments" className="text-sm font-medium">
                  {action === 'approve' ? 'Admin Comments (Optional)' : 'Rejection Reason (Required)'}
                </Label>
                <Textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder={
                    action === 'approve' 
                      ? 'Add any comments for the approval...'
                      : 'Please provide a reason for rejection...'
                  }
                  rows={3}
                  className="mt-2"
                />
                {action === 'reject' && !comments.trim() && (
                  <p className="text-red-500 text-sm mt-1">Comments are required for rejection</p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              {!showComments ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={isProcessing}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    disabled={isProcessing}
                    className="flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </Button>
                  <Button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShowComments(false)}
                    disabled={isProcessing}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={isProcessing || (action === 'reject' && !comments.trim())}
                    variant={action === 'approve' ? 'default' : 'destructive'}
                    className="flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : action === 'approve' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    {isProcessing ? 'Processing...' : `Confirm ${action === 'approve' ? 'Approval' : 'Rejection'}`}
                  </Button>
                </>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ApprovalDialog;
