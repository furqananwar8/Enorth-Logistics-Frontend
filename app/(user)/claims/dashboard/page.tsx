"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, CheckCircle2, Heart, Truck, AlertTriangle, XCircle, Clock, Info, X, Eye } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DateRangePicker } from "@/components/common/date-picker/DateRangePicker"
import DynamicClaimTrackingsTable from "./components/DynamicClaimTrackingsTable"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/context/auth.context"
import { useSearchParams } from "next/navigation"

const PACKAGING_TYPES = [
  { label: "Courier Pak", value: "COURIER_PAK" },
  { label: "FTL", value: "FTL" },
  { label: "LTL-Partial Truckload", value: "LTL" },
  { label: "Package", value: "PACKAGE" },
  { label: "Pallet", value: "PALLET" },
  { label: "Time Critical", value: "TIME_CRITICAL" },
]

export default function ClaimTrackingsDashboardPage() {
  const [search, setSearch] = useState("")
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>()
  const [selectedPackaging, setSelectedPackaging] = useState<string>("")
  const [selectedCarrier, setSelectedCarrier] = useState<string>("")
  const [selectedService, setSelectedService] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [selectedUsername, setSelectedUsername] = useState<string>("")
  const [selectedOrderSource, setSelectedOrderSource] = useState<string>("")
  const [originPostal, setOriginPostal] = useState<string>("")
  const [destinationPostal, setDestinationPostal] = useState<string>("")
  const { user } = useAuth()
  const [showFilters, setShowFilters] = useState(true)
  const [count, setCount] = useState({
    all: 0,
    saved: 0,
    spot: 0,
  })
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")

  const filters = useMemo(
    () => ({
      dateRange,
      search,
      selectedPackaging: selectedPackaging ? [selectedPackaging] : [],
      selectedCarrier,
      selectedService,
      selectedStatus,
      selectedUsername,
      selectedOrderSource,
      originPostal,
      destinationPostal,
    }),
    [
      dateRange,
      search,
      selectedPackaging,
      selectedCarrier,
      selectedService,
      selectedStatus,
      selectedUsername,
      selectedOrderSource,
      originPostal,
      destinationPostal,
    ],
  )

  return (
    <div className="container mx-auto pb-8 pt-20 px-4 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">File New Claim</h1>
      </div>

      {showFilters ? (
        <div className="bg-slate-50 dark:bg-primary/10 border border-border p-4 rounded-md mb-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-primary">Search Shipments</h2>
            <Button
              variant="destructive"
              onClick={() => {
                setDateRange(undefined)
                setSearch("")
                setSelectedPackaging("")
                setSelectedCarrier("")
                setSelectedService("")
                setSelectedStatus("")
                setSelectedUsername("")
                setSelectedOrderSource("")
                setOriginPostal("")
                setDestinationPostal("")
              }}
            >
              <X className="w-4 h-4 mr-1" /> Clear Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end mb-4">
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground flex items-center">
                Ship Date Range: <Info className="w-3 h-3 ml-1" />
              </label>
              <DateRangePicker value={dateRange} onChange={setDateRange} />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground flex items-center">
                Search Shipments: <Info className="w-3 h-3 ml-1" />
              </label>
              <div className="flex w-full">
                <Input
                  placeholder="Search"
                  className="rounded-r-none bg-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button type="button" className="rounded-l-none bg-primary hover:bg-[#005999] px-3">
                  <Search size={16} />
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-muted-foreground block">Filter by Carrier:</label>
              <Select value={selectedCarrier} onValueChange={setSelectedCarrier}>
                <SelectTrigger className="bg-white w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="carrier1">Carrier 1</SelectItem>
                  <SelectItem value="carrier2">Carrier 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-muted-foreground block">Filter by Service:</label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger className="bg-white w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="service1">Service 1</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-muted-foreground block">Filter by Shipment Status:</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="bg-white w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="status1">Status 1</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

         
        </div>
      ) : (
        <div className="mb-6 flex justify-end">
          <Button type="button" variant="outline" onClick={() => setShowFilters(true)}>
            <Eye />
            Show Filters
          </Button>
        </div>
      )}

      <Tabs defaultValue={tabParam || "all"}>
        <TabsList className="w-full gap-2 bg-white dark:bg-slate-800 border border-blue-200 p-1 group-data-[orientation=horizontal]/tabs:h-fit max-w-full overflow-x-scroll no-scrollbar">
          {[
            { icon: Heart, label: "All Active", value: "all", count: count.all },
            { icon: Truck, label: "In Transit", value: "in-transit", count: count.spot },
            { icon: AlertTriangle, label: "Exceptions", value: "exceptions", count: count.spot },
            { icon: CheckCircle2, label: "Delivered", value: "delivered", count: count.spot },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex flex-col h-max data-[state=active]:bg-primary/10 data-[state=active]:border-primary data-[state=active]:border data-[state=active]:text-primary py-2 cursor-pointer"
            >
              <tab.icon /> {tab.label} ({tab.count})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <DynamicClaimTrackingsTable filters={filters} setCount={setCount} quoteCategory="all" />
        </TabsContent>
        <TabsContent value="in-transit">
          <DynamicClaimTrackingsTable filters={filters} setCount={setCount} quoteCategory="in-transit" />
        </TabsContent>
        <TabsContent value="exceptions">
          <DynamicClaimTrackingsTable filters={filters} setCount={setCount} quoteCategory="exceptions" />
        </TabsContent>
        <TabsContent value="delivered">
          <DynamicClaimTrackingsTable filters={filters} setCount={setCount} quoteCategory="delivered" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
