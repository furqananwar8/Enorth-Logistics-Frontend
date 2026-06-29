"use client"

import React, { useEffect, useRef, useState } from "react"
import { Bell, AlertCircle, OctagonAlert } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { dismissNotification, getNotifications } from "@/api/services/notification.api"
import { toast } from "sonner"
import { AxiosError } from "axios"
import { ApiError } from "next/dist/server/api-utils"
import { Loader } from "@/components/common/Loader"

interface Notification {
    userNotificationId: number;
    notificationId: number;
    id: number;
    type: string;
    severity: string;
    read?: boolean;
    payload: {
        title: string;
        message: string;
    };
    createdAt: string;
}

export default function NotificationsWidget() {
    const queryClient = useQueryClient();
    const eventSourceRef = useRef<EventSource | null>(null);
    const [activeTab, setActiveTab] = useState("all");

    const { data, isLoading } = useQuery({
        queryKey: ["notifications"],
        queryFn: () => getNotifications(),
        staleTime: 0,
    });

    const notifications: Notification[] = data?.notifications ?? [];
    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        if (Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        connectSSE();
        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        };
    }, []);

    const connectSSE = () => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        const companyId = 1;
        const es = new EventSource(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications/stream?companyId=${companyId}`,
            { withCredentials: true }
        );
        eventSourceRef.current = es;

        es.addEventListener('notification.new', (e) => {
            const incoming: Notification = JSON.parse(e.data);

            // Optimistic update for instant UI response
            queryClient.setQueryData(["notifications"], (old: any) => {
                if (!old) return old;
                const exists = old.notifications.some(
                    (n: Notification) => n.id === incoming.id
                );
                if (exists) return old;
                return {
                    ...old,
                    notifications: [{ ...incoming, read: false }, ...old.notifications],
                };
            });

            // Sync with server in background
            queryClient.invalidateQueries({ queryKey: ["notifications"] });

            if (Notification.permission === 'granted' && incoming?.payload) {
                new Notification(incoming.payload.title || "New Notification", {
                    body: incoming.payload.message || "",
                    icon: '/favicon.ico'
                });
            }
        });

        es.onerror = (err) => {
            console.error("SSE Error:", err);
            es.close();
            setTimeout(() => connectSSE(), 3000);
        };
    };

    const dismissMutation = useMutation({
        mutationFn: (id: number) => dismissNotification(id),
        onSuccess: () => {
            toast.success("Notification dismissed");
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
        onError: (error: AxiosError<ApiError>) => {
            toast.error(error.response?.data.message);
        }
    });

    const renderNotification = (notif: Notification) => {
        if (!notif || !notif.payload) return null;
        const isCritical = notif.type === 'critical';
        const isWarning = notif.type === 'warning';

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

    const unreadNotifications = notifications.filter(n => !n.read);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="relative rounded-full border border-primary/10">
                    <Bell />
                    {unreadCount > 0 && (
                        <span className="absolute flex items-center justify-center -top-2 -right-2 text-xs bg-primary text-white h-5 w-5 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-[400px]">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="all" className="cursor-pointer!">
                            All ({notifications.length})
                        </TabsTrigger>
                        {/* <TabsTrigger value="unread" className="cursor-pointer!">
                            Unread ({unreadCount})
                        </TabsTrigger> */}
                    </TabsList>

                    {isLoading ? <Loader /> : (
                        <div className="max-h-[60vh] overflow-y-auto p-3">
                            {activeTab === "all" && (
                                <Accordion type="single" collapsible>
                                    {notifications.length > 0
                                        ? notifications.map(renderNotification)
                                        : <p className="text-center">No notifications</p>}
                                </Accordion>
                            )}

                            {/* {activeTab === "unread" && (
                                <Accordion type="single" collapsible>
                                    {unreadNotifications.length > 0
                                        ? unreadNotifications.map(renderNotification)
                                        : <p className="text-center">No unread notifications</p>}
                                </Accordion>
                            )} */}
                        </div>
                    )}
                </Tabs>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}