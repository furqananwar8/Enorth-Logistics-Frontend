// components/notifications/NotificationTable.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { OctagonAlert, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Notification {
    userNotificationId: number;
    notificationId: number;
    id: number;
    type: string;
    severity: string;
    read?: boolean;
    payload: { title: string; message: string };
    createdAt: string;
}

interface Props {
    notifications: Notification[];
    onDismiss: (id: number) => void;
    isLoading?: boolean;
}

export function NotificationTable({ notifications, onDismiss, isLoading }: Props) {
    if (isLoading) {
        return (
            <div className="py-12 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
        );
    }

    if (notifications.length === 0) {
        return (
            <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                No notifications found
            </div>
        );
    }

    return (
        <div className="max-h-[60vh] overflow-y-auto">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[40px]"></TableHead>
                        <TableHead>Notification</TableHead>
                        <TableHead className="w-[120px]">Type</TableHead>
                        <TableHead className="w-[160px]">Date</TableHead>
                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {notifications.map((notif) => {
                        const isCritical = notif.type === 'critical';
                        const isWarning = notif.type === 'warning';
                        const isReminder = notif.type === 'REMINDER';

                        return (
                            <TableRow
                                key={notif.userNotificationId || notif.id}
                                className={cn(
                                    "group cursor-default",
                                    isCritical && "bg-red-50/50 hover:bg-red-50",
                                    isWarning && "bg-yellow-50/50 hover:bg-yellow-50",
                                    !isCritical && !isWarning && "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                )}
                            >
                                <TableCell className="py-3">
                                    {isCritical ? (
                                        <OctagonAlert className="h-5 w-5 text-red-600" />
                                    ) : (
                                        <AlertCircle className={cn("h-5 w-5", isWarning ? "text-yellow-600" : "text-slate-400")} />
                                    )}
                                </TableCell>
                                <TableCell className="py-3">
                                    <div className="space-y-0.5">
                                        <p className="font-medium text-sm text-slate-900 dark:text-slate-100">
                                            {notif.payload?.title || "Untitled"}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-md">
                                            {notif.payload?.message || ""}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    <span className={cn(
                                        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                                        isReminder && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                                        isCritical && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
                                        isWarning && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
                                        !isReminder && !isCritical && !isWarning && "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                    )}>
                                        {notif.type}
                                    </span>
                                </TableCell>
                                <TableCell className="py-3 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                    {new Date(notif.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </TableCell>
                                <TableCell className="py-3 text-right">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        onClick={() => onDismiss(notif.id)}
                                    >
                                        Dismiss
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}