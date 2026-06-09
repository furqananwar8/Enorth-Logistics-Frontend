"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multi-select"
import { Search, EyeOff, Eye, X, Calendar, AlertCircle, Clock, CheckCircle2, FileText, ChevronDown } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DateRangePicker } from "@/components/common/date-picker/DateRangePicker"
import DynamicInvoicesTable from "./components/DynamicInvoicesTable"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSearchParams } from "next/navigation"

const CARRIER_TYPES = [
    { label: "Carrier Name 1", value: "CARRIER_1" },
    { label: "Carrier Name 2", value: "CARRIER_2" },
]

const SERVICE_TYPES = [
    { label: "Service 1", value: "SERVICE_1" },
    { label: "Service 2", value: "SERVICE_2" },
]

const INVOICE_STATUSES = [
    { label: "Upcoming", value: "UPCOMING" },
    { label: "Overdue", value: "OVERDUE" },
    { label: "Paid", value: "PAID" },
]

const PACKAGING_TYPES = [
    { label: "Courier Pak", value: "COURIER_PAK" },
    { label: "FTL", value: "FTL" },
    { label: "LTL", value: "LTL" },
    { label: "Package", value: "PACKAGE" },
    { label: "Pallet", value: "PALLET" },
]

export default function InvoicesDashboardPage() {
    const [search, setSearch] = useState("")
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>()
    const [selectedCarrier, setSelectedCarrier] = useState<string>("")
    const [selectedService, setSelectedService] = useState<string>("")
    const [selectedStatus, setSelectedStatus] = useState<string>("")
    const [shipmentDetail, setShipmentDetail] = useState("")
    const [selectedPackaging, setSelectedPackaging] = useState<string[]>([])
    const [selectedBookedBy, setSelectedBookedBy] = useState<string>("")
    const [showFilters, setShowFilters] = useState(true)
    const [currencyFilter, setCurrencyFilter] = useState("both")

    const [count, setCount] = useState({
        all: 0,
        upcoming: 0,
        overdue: 0,
        urgent: 0,
        unpaid: 0,
        paid: 0
    })

    const searchParams = useSearchParams()
    const tabParam = searchParams.get("tab")




    return (
        <div className="container mx-auto pb-8 pt-20 px-4 max-w-7xl">
            {showFilters ? (
                <div className="bg-muted/30 border border-border p-4 rounded-md mb-6 relative">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-lg font-semibold text-primary">Search Invoices:</h2>
                        <div className="flex gap-2">
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    setDateRange(undefined)
                                    setSearch("")
                                    setSelectedCarrier("")
                                    setSelectedService("")
                                    setSelectedStatus("")
                                    setShipmentDetail("")
                                    setSelectedPackaging([])
                                    setSelectedBookedBy("")
                                }}
                            >
                                <X className="w-4 h-4 mr-1" /> Clear Filters
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        <div className="space-y-1">
                            <label className="text-sm text-muted-foreground block">Invoice Created Date Range</label>
                            <DateRangePicker
                                value={dateRange}
                                onChange={setDateRange}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-muted-foreground block">Search for Invoice</label>
                            <div className="flex w-full">
                                <Input
                                    placeholder="Search by number, location, or name"
                                    className="rounded-r-none bg-white"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <Button
                                    type="button"
                                    className="rounded-l-none bg-primary hover:bg-[#005999] px-3"
                                >
                                    <Search size={16} />
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-muted-foreground block">Carrier</label>
                            <Select value={selectedCarrier} onValueChange={setSelectedCarrier}>
                                <SelectTrigger className="bg-white w-full">
                                    <SelectValue placeholder="Carrier Name" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CARRIER_TYPES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-muted-foreground block">Service</label>
                            <Select value={selectedService} onValueChange={setSelectedService}>
                                <SelectTrigger className="bg-white w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SERVICE_TYPES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-muted-foreground block">Invoice Status</label>
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="bg-white w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {INVOICE_STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-muted-foreground block">Shipment Detail</label>
                            <div className="flex w-full">
                                <Input
                                    placeholder="Search by BOL, Tracking or Reference"
                                    className="rounded-r-none bg-white"
                                    value={shipmentDetail}
                                    onChange={(e) => setShipmentDetail(e.target.value)}
                                />
                                <Button
                                    type="button"
                                    className="rounded-l-none bg-primary hover:bg-[#005999] px-3"
                                >
                                    <Search size={16} />
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-muted-foreground block">Packaging Type</label>
                            <MultiSelect className="bg-white w-full" options={PACKAGING_TYPES} value={selectedPackaging} onChange={setSelectedPackaging} />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-muted-foreground block">Shipment Booked By</label>
                            <Select value={selectedBookedBy} onValueChange={setSelectedBookedBy}>
                                <SelectTrigger className="bg-white w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="me">Me</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
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

            {/* Tabs */}
            <Tabs defaultValue={tabParam || "all"} className="w-full">
                <TabsList className="flex w-full justify-start h-max! gap-4 bg-transparent border-b p-0 rounded-none">
                    {[
                        { icon: FileText, label: "All Invoices", value: "all", count: count.all },
                        { icon: Calendar, label: "Upcoming", value: "upcoming", count: count.upcoming, color: "text-primary" },
                        { icon: Clock, label: "Overdue", value: "overdue", count: count.overdue, color: "text-amber-500" },
                        { icon: AlertCircle, label: "Urgent", value: "urgent", count: count.urgent, color: "text-red-500" },
                        { icon: CheckCircle2, label: "Unpaid", value: "unpaid", count: count.unpaid, color: "text-slate-500" },
                        { icon: CheckCircle2, label: "Paid (30 Days)", value: "paid", count: count.paid, color: "text-green-500" }
                    ].map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            // className="flex flex-col items-center h-auto py-2 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none bg-transparent"
                            className="flex flex-col h-max data-[state=active]:bg-primary/10 data-[state=active]:border-primary data-[state=active]:border data-[state=active]:text-primary py-2 cursor-pointer"

                        >
                            <div className={`flex items-center gap-1 ${tab.color || "text-slate-600"}`}>
                                <tab.icon className="w-4 h-4" />
                                <span className="font-bold text-lg">{tab.count}</span>
                            </div>
                            <span className="text-xs text-muted-foreground mt-1">{tab.label}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* <div className="flex justify-between items-center my-4 gap-4">
                    <div className="flex gap-2">
                        <Button className="bg-primary hover:bg-[#005999] flex items-center">
                            Pay Invoices <ChevronDown className="w-4 h-4 ml-2" />
                        </Button>
                    </div>

                    <RadioGroup value={currencyFilter} onValueChange={setCurrencyFilter} className="flex gap-6">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="both" id="r1" />
                            <Label htmlFor="r1">Both CAD and USD</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cad" id="r2" />
                            <Label htmlFor="r2">CAD Invoices</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="usd" id="r3" />
                            <Label htmlFor="r3">USD Invoices</Label>
                        </div>
                    </RadioGroup>
                </div> */}

                <TabsContent value="all">
                    <DynamicInvoicesTable setCount={setCount} filters={{ dateRange, search, selectedPackaging, selectedCarrier, selectedService, selectedStatus, shipmentDetail, selectedBookedBy }} invoiceCategory="all" currencyFilter={currencyFilter} />
                </TabsContent>
                <TabsContent value="upcoming">
                    <DynamicInvoicesTable setCount={setCount} filters={{ dateRange, search, selectedPackaging, selectedCarrier, selectedService, selectedStatus, shipmentDetail, selectedBookedBy }} invoiceCategory="upcoming" currencyFilter={currencyFilter} />
                </TabsContent>
                {/* Other Tabs */}
                <TabsContent value="overdue">
                    <DynamicInvoicesTable setCount={setCount} filters={{ dateRange, search, selectedPackaging, selectedCarrier, selectedService, selectedStatus, shipmentDetail, selectedBookedBy }} invoiceCategory="overdue" currencyFilter={currencyFilter} />
                </TabsContent>
                <TabsContent value="urgent">
                    <DynamicInvoicesTable setCount={setCount} filters={{ dateRange, search, selectedPackaging, selectedCarrier, selectedService, selectedStatus, shipmentDetail, selectedBookedBy }} invoiceCategory="urgent" currencyFilter={currencyFilter} />
                </TabsContent>
                <TabsContent value="unpaid">
                    <DynamicInvoicesTable setCount={setCount} filters={{ dateRange, search, selectedPackaging, selectedCarrier, selectedService, selectedStatus, shipmentDetail, selectedBookedBy }} invoiceCategory="unpaid" currencyFilter={currencyFilter} />
                </TabsContent>
                <TabsContent value="paid">
                    <DynamicInvoicesTable setCount={setCount} filters={{ dateRange, search, selectedPackaging, selectedCarrier, selectedService, selectedStatus, shipmentDetail, selectedBookedBy }} invoiceCategory="paid" currencyFilter={currencyFilter} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
