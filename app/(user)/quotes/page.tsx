"use client"

import { useMemo, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CustomDateRangePicker } from "@/components/ui/custom-date-picker"
import { MultiSelect } from "@/components/ui/multi-select"
import { Search, CheckCircle, Edit, MoreVertical, Trash2, Heart, SaveIcon, Truck, X, EyeOff, Eye } from "lucide-react"

import { DataTable } from "@/components/common/table/DataTable"
import { DataTablePagination } from "@/components/common/table/DataTablePagination"
import { columns } from "./components/ColumnsTableQuotes"
import { SortingState } from "@tanstack/react-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FavouriteQuotesTable from "./DynamicQuotesTable"
import AllQuotesTable from "./DynamicQuotesTable"
import DynamicQuotesTable from "./DynamicQuotesTable"
import FormDate from "@/components/common/form/fields/FormDate"
import { DatePicker } from "@/components/common/date-picker/DatePicker"
import { DateRangePicker } from "@/components/common/date-picker/DateRangePicker"
import { useAuth } from "@/context/auth.context"

const PACKAGING_TYPES = [
  { label: "Courier Pak", value: "COURIER_PAK" },
  { label: "FTL", value: "FTL" },
  { label: "LTL-Partial Truckload", value: "LTL" },
  { label: "Package", value: "PACKAGE" },
  { label: "Pallet", value: "PALLET" },
  { label: "Time Critical", value: "TIME_CRITICAL" },

]
export type QuoteCategory = "all" | "saved" | "spot" | "favorite"
export default function QuotesDashboardPage() {
  // const [selectedTab, setSelectedTab] = useState<QuoteCategory>("all")
  const [search, setSearch] = useState("")
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>()
  const [selectedPackaging, setSelectedPackaging] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(true)
  const [count, setCount] = useState({
    all: 0,
    saved: 0,
    spot: 0
  })

  return (
    <div className="container mx-auto pb-8 pt-20 px-4 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Quotes Dashboard</h1>
        {/* <p className="text-sm">
          <span className="text-primary font-semibold flex items-center gap-1 cursor-pointer hover:underline">
            <span className="bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">?</span>
            Click here
          </span>{" "}
          <span className="text-muted-foreground">for a quick tour</span>
        </p> */}
      </div>

      {showFilters ? (
        <div className="bg-slate-50 dark:bg-primary/10 border border-border p-4 rounded-md mb-6 relative">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
            <h2 className="text-lg font-semibold text-primary">Search Quotes</h2>
            <div className="flex gap-2">
              <Button variant="destructive" onClick={() => {
                setDateRange(undefined)
                setSearch("")
                setSelectedPackaging([])
              }}><X /> Clear Filters</Button>
              <Button variant="outline" onClick={() => setShowFilters(false)}><EyeOff /> Hide</Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 items-end mt-4">
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground block">Search by Date Range:</label>
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground block">Search:</label>
              <div className="flex w-[240px]">
                <Input
                  placeholder="Search"
                  className="rounded-r-none bg-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button
                  type="button"
                  className="rounded-l-none bg-primary hover:bg-[#005999] px-3"
                  onClick={() => { }}
                >
                  <Search size={16} />
                </Button>
              </div>
            </div>

            <div className="space-y-1 ">
              <label className="text-sm text-muted-foreground block">Packaging Type:</label>
              <MultiSelect options={PACKAGING_TYPES} value={selectedPackaging} onChange={setSelectedPackaging} className="bg-white"/>
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

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList className="gap-2 w-full overflow-scroll no-scrollbar bg-white dark:bg-slate-800 border border-blue-200 p-1" >
          {[
            { icon: Heart, label: "All Quotes", value: "all", count: count.all },
            // { icon: SaveIcon, label: "Saved", value: "saved", count: count.saved },
            { icon: Truck, label: "Spot Quotes", value: "spot", count: count.spot },
            { icon: Truck, label: "Favorite Quotes", value: "favorite", count: count.spot }
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              // onClick={() => setSelectedTab(tab.value as QuoteCategory)}
              className="data-[state=active]:bg-primary data-[state=active]:text-white py-2 cursor-pointer"
            >
              <tab.icon /> {tab.label} ({tab.count})
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="all">
          <DynamicQuotesTable filters={{ dateRange, search, selectedPackaging }} setCount={setCount} quoteCategory="all" />
        </TabsContent>
        {/* <TabsContent value="saved">
          <DynamicQuotesTable filters={{ dateRange, search, selectedPackaging }} setCount={setCount} quoteCategory="saved" />
        </TabsContent> */}
        <TabsContent value="spot">
          <DynamicQuotesTable filters={{ dateRange, search, selectedPackaging }} setCount={setCount} quoteCategory="spot" />
        </TabsContent>
        <TabsContent value="favorite">
          <DynamicQuotesTable filters={{ dateRange, search, selectedPackaging }} setCount={setCount} quoteCategory="favorite" />
        </TabsContent>
      </Tabs>
    </div >
  )
}