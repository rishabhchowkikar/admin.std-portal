import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

interface Student {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
    rollno: number;
}

interface Payment {
    _id: string;
    studentId: {
        _id: string;
        name: string;
        rollno: number;
    };
    paymentMethod: string;
    finalAmount: number;
    paidDate: string;
}

interface RecentActivitiesProps {
    newStudents: Student[];
    recentPayments: Payment[];
}

export function RecentActivities({ newStudents, recentPayments }: RecentActivitiesProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* New Students */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Students</CardTitle>
                    <CardDescription>
                        Recently registered students
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-80">
                        <div className="space-y-4">
                            {newStudents.map((student) => (
                                <div
                                    key={student._id}
                                    className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {student.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Roll No: {student.rollno}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {student.email}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="secondary">
                                            {formatDistanceToNow(new Date(student.createdAt), { addSuffix: true })}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Recent Payments */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Payments</CardTitle>
                    <CardDescription>
                        Latest fee payments received
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-80">
                        <div className="space-y-4">
                            {recentPayments.map((payment) => (
                                <div
                                    key={payment._id}
                                    className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {payment.studentId.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Roll No: {payment.studentId.rollno}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Method: {payment.paymentMethod}
                                        </p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-sm font-semibold text-green-600">
                                            {formatCurrency(payment.finalAmount)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(payment.paidDate), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}