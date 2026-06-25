import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, dismissNotification } from "@/api/services/notification.api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2, Clock, ArrowRight, OctagonAlert, AlertCircle } from "lucide-react";
import { CreateReminderDialog } from "./CreateReminderDialog";
import { Loader } from "@/components/common/Loader";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";

interface Notification {
    userNotificationId: number;
    notificationId: number;
    id: number;
    type: string;
    severity: string;
    read?: boolean;
    payload: { title: string; message: string };
    createdAt: string;
}

interface Meta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface NotificationsResponse {
    notifications: Notification[];
    meta: Meta;
}

export default function NotificationsSummary() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("all");

    const { data, isLoading } = useQuery<NotificationsResponse>({
        queryKey: ["notifications", "summary"],
        queryFn: () => getNotifications({ page: 1, limit: 10 }),
    });

    const dismissMutation = useMutation({
        mutationFn: (id: number) => dismissNotification(id),
        onSuccess: () => {
            toast.success("Notification dismissed");
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
        onError: (error: AxiosError<ApiError>) => {
            toast.error(error.response?.data.message);
        },
    });

    const notifications = data?.notifications ?? [];
    const totalCount = data?.meta?.total ?? 0;

    const isToday = (dateString: string) => {
        const notifDate = new Date(dateString);
        const today = new Date();
        return notifDate.toDateString() === today.toDateString();
    };

    const todayNotifications = notifications.filter((n) => isToday(n.createdAt));
    const reminderNotifications = notifications.filter((n) => n.type === "REMINDER");

    const renderNotification = (notif: Notification) => {
        if (!notif || !notif.payload) return null;

        const isCritical = notif.type === "critical";
        const isWarning = notif.type === "warning";

        return (
            <AccordionItem
                key={notif.userNotificationId || notif.id}
                value={(notif.userNotificationId || notif.id)?.toString() || ""}
                className={cn(
                    "mb-3 rounded-md border-2",
                    isCritical && "border-red-300 bg-red-50",
                    isWarning && "border-yellow-300 bg-yellow-50",
                    !isCritical && !isWarning && "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
                )}
            >
                <div className="flex items-center px-4 py-3">
                    <div className="mr-3">
                        {isCritical ? <OctagonAlert /> : <AlertCircle />}
                    </div>

                    <div className="flex-1">
                        <p className="font-semibold">{notif.payload?.title || ""}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <AccordionTrigger className="[&>svg]:hidden [&_svg]:hidden">
                            View
                        </AccordionTrigger>

                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => dismissMutation.mutate(notif.id)}
                        >
                            Dismiss
                        </Button>
                    </div>
                </div>

                <AccordionContent className="px-4 pb-3">
                    {notif.payload?.message || ""}
                </AccordionContent>
            </AccordionItem>
        );
    };

    const renderList = (items: Notification[]) => {
        if (isLoading) return <Loader />;

        if (items.length === 0) {
            return <p className="text-center py-8 text-slate-500">No notifications</p>;
        }

        return (
            <div className="max-h-[60vh] overflow-y-auto p-3">
                <Accordion type="single" collapsible>
                    {items.map(renderNotification)}
                </Accordion>
            </div>
        );
    };

    const isRemindersTab = activeTab === "reminders";
    const viewAllHref = isRemindersTab ? "/reminders" : "/notifications";
    const viewAllLabel = isRemindersTab ? "View All Reminders" : "View All Notifications";

    return (
        <div className="bg-white dark:bg-card border border-slate-200 dark:border-border rounded overflow-hidden mb-6">
            <div className="flex items-center justify-between px-4 py-3 border-slate-200 dark:border-border">
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                    {totalCount} Items For {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </h3>
                <div className="flex items-center gap-3">
                    <CreateReminderDialog>
                        <Button variant="outline" size="sm" className="dark:bg-slate-800 dark:text-white dark:border-slate-700">
                            <Plus className="h-4 w-4 mr-1" />
                            Create Reminder
                        </Button>
                    </CreateReminderDialog>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="px-4 border-slate-200 dark:border-border py-2">
                    <TabsList className="bg-transparent h-auto flex flex-wrap gap-6 text-sm w-max justify-start border-none">
                        <TabsTrigger
                            value="all"
                            className="bg-transparent font-semibold text-slate-500 dark:text-slate-400 data-[state=active]:text-slate-800 dark:data-[state=active]:text-slate-200 rounded-sm pb-2 -mb-[2px] shadow-none data-[state=active]:shadow-none! cursor-pointer! border-x-none! border-t-none! px-4 data-[state=active]:border-b-orange-400"
                        >
                            All ({totalCount})
                        </TabsTrigger>

                        <TabsTrigger
                            value="today"
                            className="bg-transparent flex items-center gap-1.5 text-slate-500 dark:text-slate-400 data-[state=active]:text-slate-800 dark:data-[state=active]:text-slate-200 data-[state=active]:border-b-2 data-[state=active]:border-b-orange-400 rounded-sm pb-2 -mb-[2px] shadow-none data-[state=active]:shadow-none! cursor-pointer! px-0"
                        >
                            <CheckCircle2 className="size-4 text-slate-700" />
                            Today ({todayNotifications.length})
                        </TabsTrigger>

                        <TabsTrigger
                            value="reminders"
                            className="bg-transparent flex items-center gap-1.5 text-slate-500 dark:text-slate-400 data-[state=active]:text-slate-800 dark:data-[state=active]:text-slate-200 data-[state=active]:border-b-2 data-[state=active]:border-b-orange-400 rounded-sm pb-2 -mb-[2px] shadow-none data-[state=active]:shadow-none! cursor-pointer! px-0"
                        >
                            <Clock className="size-4 text-primary" />
                            Reminders ({reminderNotifications.length})
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="all" className="m-0">
                    {renderList(notifications)}
                </TabsContent>

                <TabsContent value="today" className="m-0">
                    {renderList(todayNotifications)}
                </TabsContent>

                <TabsContent value="reminders" className="m-0">
                    {renderList(reminderNotifications)}
                </TabsContent>
            </Tabs>

            <div className="px-4 py-3 border-t border-slate-200 dark:border-border">
                <Link href={viewAllHref}>
                    <Button variant="link" size="sm" className="text-primary hover:text-primary/80 px-0">
                        {viewAllLabel}
                        <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}