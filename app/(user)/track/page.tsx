"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  CheckCircle,
  Edit,
  MoreVertical,
  Trash2,
  Heart,
  SaveIcon,
  Truck,
  X,
  EyeOff,
  Eye,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Clock,
  Info,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangePicker } from "@/components/common/date-picker/DateRangePicker";
import DynamicTrackingTable from "./components/DynamicTrackingTable";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth.context";

const PACKAGING_TYPES = [
  { label: "Courier Pak", value: "COURIER_PAK" },
  { label: "FTL", value: "FTL" },
  { label: "LTL-Partial Truckload", value: "LTL" },
  { label: "Package", value: "PACKAGE" },
  { label: "Pallet", value: "PALLET" },
  { label: "Time Critical", value: "TIME_CRITICAL" },
];
export type QuoteCategory = "all" | "saved" | "spot" | "favorite";
export const shipmentStatuses = [
  { name: "Draft", value: "DRAFT" },
  { name: "Archived", value: "ARCHIVED" },
  { name: "Saved", value: "SAVED" },
  { name: "Submitted", value: "SUBMITTED" },
  { name: "Converted to shipment", value: "CONVERTED_TO_SHIPMENT" },
];
export default function TrackingDashboardPage() {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>();
  const [selectedPackaging, setSelectedPackaging] = useState<string>("");
  const [selectedCarrier, setSelectedCarrier] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedUsername, setSelectedUsername] = useState<string>("");
  const [selectedOrderSource, setSelectedOrderSource] = useState<string>("");
  const [originPostal, setOriginPostal] = useState<string>("");
  const [destinationPostal, setDestinationPostal] = useState<string>("");
  const { user } = useAuth();

  const [showFilters, setShowFilters] = useState(true);
  const [count, setCount] = useState({
    all: 0,
    saved: 0,
    spot: 0,
  });
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  // tab param

  return (
    <div className="container mx-auto pb-8 pt-20 px-4 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">
          {user.user.role.name === "superAdmin"
            ? "Add Surcharges"
            : "Tracking Dashboard"}
        </h1>
      </div>

      {showFilters ? (
        <div className="bg-slate-50 dark:bg-primary/10 border border-border p-4 rounded-md mb-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-primary">
              Search Shipments
            </h2>
            <Button
              variant="destructive"
              onClick={() => {
                setDateRange(undefined);
                setSearch("");
                setSelectedPackaging("");
                setSelectedCarrier("");
                setSelectedService("");
                setSelectedStatus("");
                setSelectedUsername("");
                setSelectedOrderSource("");
                setOriginPostal("");
                setDestinationPostal("");
              }}
              // className="text-primary hover:text-[#005999] h-auto p-0 flex items-center"
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
                  placeholder="Tracking number or address"
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
              <label className="text-sm text-muted-foreground block">
                Filter by Shipment Status:
              </label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="bg-white w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {shipmentStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>{status.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            

            <div className="space-y-1">
              <label className="text-sm text-muted-foreground block">
                Origin Postal/ZIP:
              </label>
              <Input
                placeholder="A1A 1A1"
                className="bg-white"
                value={originPostal}
                onChange={(e) => setOriginPostal(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-muted-foreground block">
                Destination Postal/ZIP:
              </label>
              <Input
                placeholder="A1A 1A1"
                className="bg-white"
                value={destinationPostal}
                onChange={(e) => setDestinationPostal(e.target.value)}
              />
            </div>
          </div>

          
        </div>
      ) : (
        <div className="mb-6 flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(true)}
          >
            <Eye />
            Show Filters
          </Button>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue={tabParam || "all"}>
        <TabsList className="w-full gap-2 bg-white dark:bg-slate-800 border border-blue-200 p-1 group-data-[orientation=horizontal]/tabs:h-fit max-w-full overflow-x-scroll no-scrollbar">
          {[
            {
              icon: Heart,
              label: "All Active",
              value: "all",
              count: count.all,
            },
            {
              icon: SaveIcon,
              label: "Today's Shipment",
              value: "todays-shipment",
              count: count.saved,
            },
            {
              icon: Truck,
              label: "Ready for Shipping",
              value: "ready-for-shipping",
              count: count.spot,
            },
            {
              icon: Truck,
              label: "In Transit",
              value: "in-transit",
              count: count.spot,
            },
            {
              icon: AlertTriangle,
              label: "Exceptions",
              value: "exceptions",
              count: count.spot,
            },
            {
              icon: XCircle,
              label: "Cancelled",
              value: "cancelled",
              count: count.spot,
            },
            {
              icon: CheckCircle2,
              label: "Delivered",
              value: "delivered",
              count: count.spot,
            },
            {
              icon: Clock,
              label: "Labels Expires Soon",
              value: "labels-expires-soon",
              count: count.spot,
            },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              // onClick={() => setSelectedTab(tab.value as QuoteCategory)}
              className="flex flex-col h-max data-[state=active]:bg-primary/10 data-[state=active]:border-primary data-[state=active]:border data-[state=active]:text-primary py-2 cursor-pointer"
            >
              <tab.icon /> {tab.label} ({tab.count})
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="all">
          <DynamicTrackingTable
            filters={{
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
            }}
            setCount={setCount}
            quoteCategory="all"
          />
        </TabsContent>
        <TabsContent value="saved">
          <DynamicTrackingTable
            filters={{
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
            }}
            setCount={setCount}
            quoteCategory="all"
          />
        </TabsContent>
        <TabsContent value="spot">
          <DynamicTrackingTable
            filters={{
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
            }}
            setCount={setCount}
            quoteCategory="all"
          />
        </TabsContent>
        <TabsContent value="favorite">
          <DynamicTrackingTable
            filters={{
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
            }}
            setCount={setCount}
            quoteCategory="all"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
