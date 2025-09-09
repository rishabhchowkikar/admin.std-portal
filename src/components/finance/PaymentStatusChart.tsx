import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PaymentStatus {
  _id: string;
  count: number;
  totalAmount: number;
}

interface PaymentStatusChartProps {
  data: PaymentStatus[];
  title: string;
  type: 'hostel' | 'course';
}

export function PaymentStatusChart({ data, title, type }: PaymentStatusChartProps) {
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);
  const totalAmount = data.reduce((sum, item) => sum + item.totalAmount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'overdue':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'overdue':
        return 'Overdue';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{totalCount}</div>
              <div className="text-sm text-muted-foreground">Total Payments</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">
                ₹{totalAmount.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Amount</div>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="space-y-3">
            {data.map((item) => {
              const percentage = totalCount > 0 ? (item.count / totalCount) * 100 : 0;
              return (
                <div key={item._id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {getStatusLabel(item._id)}
                    </span>
                    <div className="text-sm text-muted-foreground">
                      {item.count} ({percentage.toFixed(1)}%)
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getStatusColor(item._id)}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Amount: ₹{item.totalAmount.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
