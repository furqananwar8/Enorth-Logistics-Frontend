// app/notifications/components/ColumnsNotifications.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { OctagonAlert, AlertCircle } from "lucide-react"

export interface Notification {
    userNotificationId: number
    notificationId: number
    id: number
    type: string
    severity: string
    read?: boolean
    payload: { title: string; message: string }
    createdAt: string
}

export const getColumns = (): ColumnDef<Notification>[] => [
    {
        accessorFn: (row) => row.payload?.title,
        id: "title",
        header: () => <div className="text-left w-[250px]">Title</div>,
        cell: ({ row }) => {
            const type = row.original.type
            const isCritical = type === "critical"
            const isWarning = type === "warning"

            return (
                <div className="flex items-center gap-2 py-3">
                    {isCritical ? (
                        <OctagonAlert className="h-4 w-4 text-red-600 shrink-0" />
                    ) : isWarning ? (
                        <AlertCircle className="h-4 w-4 text-yellow-600 shrink-0" />
                    ) : (
                        <AlertCircle className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                    <div className="font-medium text-sm text-foreground whitespace-nowrap">
                        {row.original.payload?.title || "Untitled"}
                    </div>
                </div>
            )
        },
    },
    {
        accessorFn: (row) => row.payload?.message,
        id: "description",
        header: () => <div className="text-left w-[400px]">Description</div>,
        cell: ({ row }) => (
            <div className="text-left text-sm text-muted-foreground py-3 leading-relaxed">
                {row.original.payload?.message || "-"}
            </div>
        ),
    },
    {
        accessorKey: "createdAt",
        header: () => <div className="text-left w-[200px]">Date</div>,
        cell: ({ row }) => {
            const createdAt = row.getValue("createdAt") as string
            const dateObj = new Date(createdAt)

            const time = dateObj.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            })

            const formattedDate = dateObj.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            })

            return (
                <div className="leading-tight whitespace-nowrap py-3">
                    {time}
                    <br />
                    <span className="text-muted-foreground">{formattedDate}</span>
                </div>
            )
        },
    },
]