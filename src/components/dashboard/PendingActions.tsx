// components/dashboard/PendingActions.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Bus, User, AlertCircle } from "lucide-react";

interface PendingActionsProps {
    pendingActions: {
        hostelRequests: number;
        busPassRequests: number;
        profileUpdates: number;
        total: number;
    };
}

export function PendingActions({ pendingActions }: PendingActionsProps) {
    const actionItems = [
        {
            title: "Hostel Requests",
            count: pendingActions.hostelRequests,
            icon: Home,
            variant: "destructive" as const,
            href: "/admin/hostels/requests"
        },
        {
            title: "Bus Pass Requests",
            count: pendingActions.busPassRequests,
            icon: Bus,
            variant: "secondary" as const,
            href: "/admin/transport/requests"
        },
        {
            title: "Profile Updates",
            count: pendingActions.profileUpdates,
            icon: User,
            variant: "outline" as const,
            href: "/admin/profiles/pending"
        }
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    Pending Actions
                </CardTitle>
                <CardDescription>
                    Items requiring your attention
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {actionItems.map((item) => (
                        <div key={item.title} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-muted">
                                    <item.icon className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{item.title}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant={item.variant}>
                                    {item.count}
                                </Badge>
                                <Button size="sm" variant="ghost">
                                    View
                                </Button>
                            </div>
                        </div>
                    ))}
                    <div className="pt-4 border-t">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Total Pending</p>
                            <Badge variant="destructive" className="text-base px-3 py-1">
                                {pendingActions.total}
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
