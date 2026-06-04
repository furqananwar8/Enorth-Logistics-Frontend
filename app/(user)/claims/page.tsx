"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multi-select"
import { Search, EyeOff, Eye, X, Calendar, AlertCircle, Clock, CheckCircle2, FileText, ChevronDown } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DateRangePicker } from "@/components/common/date-picker/DateRangePicker"
import DynamicClaimsTable from "./components/DynamicClaimsTable"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const CARRIER_TYPES = [
    { label: "Carrier Name 1", value: "CARRIER_1" },
    { label: "Carrier Name 2", value: "CARRIER_2" },
]

const SERVICE_TYPES = [
    { label: "Service 1", value: "SERVICE_1" },
    { label: "Service 2", value: "SERVICE_2" },
]

const CLAIMS_STATUSES = [
    { label: "Pending", value: "PENDING" },
    { label: "Approved", value: "APPROVED" },
    { label: "Denied", value: "DENIED" },
    { label: "Paid", value: "PAID" },
]

const PACKAGING_TYPES = [
    { label: "Courier Pak", value: "COURIER_PAK" },
    { label: "FTL", value: "FTL" },
    { label: "LTL", value: "LTL" },
    { label: "Package", value: "PACKAGE" },
    { label: "Pallet", value: "PALLET" },
]

export default function ClaimsDashboardPage() {
    const [search, setSearch] = useState("")
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>()
    const [selectedCarrier, setSelectedCarrier] = useState<string>("")
    const [selectedService, setSelectedService] = useState<string>("")
    const [selectedStatus, setSelectedStatus] = useState<string>("")
    const [shipmentDetail, setShipmentDetail] = useState("")
    const [selectedPackaging, setSelectedPackaging] = useState<string[]>([])
    const [selectedBookedBy, setSelectedBookedBy] = useState<string>("")
    const [selectedUsername, setSelectedUsername] = useState<string>("")
    const [selectedOrderSource, setSelectedOrderSource] = useState<string>("")
    const [originPostal, setOriginPostal] = useState<string>("")
    const [destinationPostal, setDestinationPostal] = useState<string>("")

    const [showFilters, setShowFilters] = useState(true)

    const [count, setCount] = useState({
        all: 0,
        pending: 0,
        approved: 0,
        denied: 0,
        paid: 0
    })

    return (
        <div className="container mx-auto pb-8 pt-20 px-4 max-w-7xl">
            {showFilters ? (
                <div className="bg-muted/30 border border-border p-4 rounded-md mb-6 relative">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-lg font-semibold text-primary">Search Claims:</h2>
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
                            <label className="text-sm text-muted-foreground block">Claim Date Range</label>
                            <DateRangePicker
                                value={dateRange}
                                onChange={setDateRange}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-muted-foreground block">Search for Claim</label>
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
                            <label className="text-sm text-muted-foreground block">Claim Status</label>
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="bg-white w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CLAIMS_STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm text-muted-foreground block">Shipment Detail</label>
                            <div className="flex w-full">
                                <Input
                                    placeholder="Search by BOL, Tracking or Reference"
                                    className="rounded-r-none bg-white w-full"
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
                            <MultiSelect options={PACKAGING_TYPES} value={selectedPackaging} onChange={setSelectedPackaging} className="w-full" />
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
            <Tabs defaultValue="all" className="w-full">
                <TabsList className="flex w-full justify-start h-max! gap-4 bg-transparent border-b p-0 rounded-none mb-4">
                    {[
                        { icon: FileText, label: "All Claims", value: "all", count: count.all },
                        { icon: Clock, label: "Pending", value: "pending", count: count.pending, color: "text-orange-500" },
                        { icon: CheckCircle2, label: "Approved", value: "approved", count: count.approved, color: "text-green-600" },
                        { icon: AlertCircle, label: "Denied", value: "denied", count: count.denied, color: "text-red-600" },
                        { icon: CheckCircle2, label: "Paid", value: "paid", count: count.paid, color: "text-green-500" }
                    ].map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
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

                <TabsContent value="all">
                    <DynamicClaimsTable setCount={setCount} filters={{ dateRange, search, selectedPackaging, selectedCarrier, selectedService, selectedStatus, shipmentDetail, selectedBookedBy, selectedUsername, selectedOrderSource, originPostal, destinationPostal }} claimCategory="all" />
                </TabsContent>
                <TabsContent value="pending">
                    <DynamicClaimsTable setCount={setCount} filters={{ dateRange, search, selectedPackaging, selectedCarrier, selectedService, selectedStatus, selectedUsername, selectedOrderSource, originPostal, destinationPostal, selectedBookedBy }} claimCategory="pending" />
                </TabsContent>
                <TabsContent value="approved">
                    <DynamicClaimsTable setCount={setCount} filters={{ dateRange, search, selectedPackaging, selectedCarrier, selectedService, selectedStatus, selectedUsername, selectedOrderSource, originPostal, destinationPostal, selectedBookedBy }} claimCategory="approved" />
                </TabsContent>
                <TabsContent value="denied">
                    <DynamicClaimsTable setCount={setCount} filters={{ dateRange, search, selectedPackaging, selectedCarrier, selectedService, selectedStatus, selectedUsername, selectedOrderSource, originPostal, destinationPostal, selectedBookedBy }} claimCategory="denied" />
                </TabsContent>
                <TabsContent value="paid">
                    <DynamicClaimsTable setCount={setCount} filters={{ dateRange, search, selectedPackaging, selectedCarrier, selectedService, selectedStatus, selectedUsername, selectedOrderSource, originPostal, destinationPostal, selectedBookedBy }} claimCategory="paid" />
                </TabsContent>
            </Tabs>
        </div>
    )
}
