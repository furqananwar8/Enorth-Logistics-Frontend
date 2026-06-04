"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/common/table/DataTable"
import { DataTablePagination } from "@/components/common/table/DataTablePagination"
import { columns } from "./ColumnsTableClaimTrackings"
import { SortingState } from "@tanstack/react-table"
import { CircleSlash, Truck, RefreshCcw } from "lucide-react"
import { useEffect, useState } from "react"
import { useDebounce } from "@/hooks/useDebounce.hook"
import { useQuery } from "@tanstack/react-query"
import { Loader } from "@/components/common/Loader"
import EmptyUI from "@/components/common/empty/Empty"
import { getAllTrackings } from "@/api/services/tracking.api"
import { useAuth } from "@/context/auth.context"

interface Props {
  filters: {
    dateRange: any
    search: string
    selectedPackaging: string[]
    selectedCarrier?: string
    selectedService?: string
    selectedStatus?: string
    selectedUsername?: string
    selectedOrderSource?: string
    originPostal?: string
    destinationPostal?: string
  }
  setCount: (count: { all: number; saved: number; spot: number }) => void
  quoteCategory: any
}

export default function DynamicClaimTrackingsTable({ filters, setCount, quoteCategory }: Props) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebounce(filters.search, 500)
  const { user } = useAuth()

  const {
    data: trackings,
    isLoading,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["claim-trackings", quoteCategory, debouncedSearch, filters],
    queryFn: () => {
      const dateFrom = filters.dateRange?.from
        ? new Date(filters.dateRange.from).toISOString().split("T")[0]
        : ""
      const dateTo = filters.dateRange?.to
        ? new Date(filters.dateRange.to).toISOString().split("T")[0]
        : ""

      return getAllTrackings(
        debouncedSearch,
        [dateFrom, dateTo],
        filters.selectedPackaging?.join(",") || "",
        filters.selectedCarrier || "",
        filters.selectedService || "",
        filters.selectedStatus || "",
        filters.selectedUsername || "",
        filters.selectedOrderSource || "",
        filters.originPostal || "",
        filters.destinationPostal || "",
      )
    },
    retry: 1,
    enabled: true,
  })

  useEffect(() => {
    if (trackings) {
      setCount({
        all: trackings?.data?.length || 0,
        saved: 0,
        spot: 0,
      })
    }
  }, [trackings, setCount])

  if (isLoading || isPending) return <Loader className="py-20" />
  if (isError)
    return (
      <EmptyUI
        icon={<CircleSlash size={80} />}
        title="Error"
        description="Failed to fetch shipments"
        action={
          <Button variant="outline" className="text-muted-foreground border-border">
            <RefreshCcw size={16} /> Retry
          </Button>
        }
      />
    )

  return trackings?.data?.length > 0 ? (
    <>
      <div className="shadow-lg mb-4">
        <DataTable
          columns={columns}
          data={trackings.data ?? []}
          sorting={sorting}
          setSorting={setSorting}
        />
      </div>
      <div className="flex justify-between items-center mb-10">
        <Button variant="outline" className="text-muted-foreground border-border">
          Refresh
        </Button>
        <DataTablePagination
          page={page}
          totalPages={1}
          setPage={setPage}
        />
      </div>
    </>
  ) : (
    <EmptyUI
      icon={<Truck size={80} />}
      title="No Shipments Found"
      description="You have no shipments matching these filters."
      action={
        user.user.role.name !== "superAdmin" ? (
          <Button variant="outline" className="text-muted-foreground border-border">
            Create Shipment
          </Button>
        ) : (
          ""
        )
      }
    />
  )
}
