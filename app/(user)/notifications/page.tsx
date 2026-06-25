"use client"

import React, { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getNotifications } from "@/api/services/notification.api"
import { DataTable } from "@/components/common/table/DataTable"
import { DataTablePagination } from "@/components/common/table/DataTablePagination"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Bell, RefreshCcw } from "lucide-react"
import Link from "next/link"
import { Loader } from "@/components/common/Loader"
import EmptyUI from "@/components/common/empty/Empty"
import { SortingState } from "@tanstack/react-table"
import { getColumns } from "./components/ColumnsNotifications"

interface Meta {
    total: number
    page: number
    limit: number
    totalPages: number
}

interface NotificationsResponse {
    notifications: any[]
    meta: Meta
}

export default function NotificationsPage() {
    const [sorting, setSorting] = useState<SortingState>([])
    const [page, setPage] = useState(1)
    const limit = 10

    const {
        data,
        isLoading,
        isPending,
        isError,
        isFetching,
        refetch,
    } = useQuery<NotificationsResponse>({
        queryKey: ["notifications", "paginated", page],
        queryFn: () => getNotifications({ page, limit }),
        placeholderData: (prev) => prev,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        retry: 1,
    })

    const meta = data?.meta
    const notifications = data?.notifications ?? []

    const columns = useMemo(() => getColumns(), [])

    if (isLoading || isPending) return <Loader className="py-20" />

    if (isError) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <EmptyUI
                    icon={<Bell size={80} />}
                    title="Error"
                    description="Failed to fetch notifications"
                    action={
                        <Button
                            variant="destructive"
                            onClick={() => refetch()}
                        >
                            <RefreshCcw size={16} className="mr-2" />
                            Retry
                        </Button>
                    }
                />
            </div>
        )
    }

    return (
        <>
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                <h1 className="text-2xl font-semibold text-foreground whitespace-nowrap">
                    All Notifications
                </h1>

                {notifications.length > 0 ? (
                    <>
                        <div className="relative shadow-lg mb-4 min-w-[900px]">
                            <DataTable
                                columns={columns}
                                data={notifications}
                                sorting={sorting}
                                setSorting={setSorting}
                            />

                            {isFetching && (
                                <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-md">
                                    <Loader />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center mb-10">
                            <div />
                            <DataTablePagination
                                page={page}
                                totalPages={meta?.totalPages ?? 1}
                                setPage={setPage}
                            />
                        </div>
                    </>
                ) : (
                    <EmptyUI
                        icon={<Bell size={80} />}
                        title="No Notifications Found"
                        description="You have no notifications yet."
                        action={
                            <Link href="/">
                                <Button variant="outline">
                                    <ArrowLeft className="w-4 h-4 mr-1" />
                                    Go Back
                                </Button>
                            </Link>
                        }
                    />
                )}
            </div>
        </>
    )
}