"use client";
import { ShipmentHeader } from "./components/ShipmentHeader";
import { ShipmentDetailsCard } from "./components/ShipmentDetailsCard";
import { ShipmentBreakdownCard } from "./components/ShipmentBreakdownCard";
import { PackagingDetailsCard } from "./components/PackagingDetailsCard";
import { StatusUpdatesWidget } from "./components/StatusUpdatesWidget";
import { ShipmentDocumentsWidget } from "./components/ShipmentDocumentsWidget";
import { getSingleQuote } from "@/api/services/quotes.api";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Loader } from "@/components/common/Loader";
import { Link, Plus, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyUI from "@/components/common/empty/Empty";

export default function SingleShipmentTrackingPage() {
  // Using static mock data directly inside the components for now to match the provided UI layout
  // get single quote
  // get params from link
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const {
    data: quote,
    isLoading,
    isPending,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["quote", id],
    queryFn: () => getSingleQuote(id!),
    retry: 1,
    // dependency
    enabled: true,
  });
  // console.log("quote", quote)
  if (isLoading || isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }
  return (
    <>
      {quote?.quote?.shipment ? (
        <div className="container mx-auto p-4 md:p-6 lg:p-8 min-h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Content Column */}
            <div className="lg:col-span-8 flex flex-col">
              <ShipmentHeader quote={quote?.quote} />
              <ShipmentDetailsCard quote={quote?.quote} />
              <ShipmentBreakdownCard quote={quote?.quote} />
              <PackagingDetailsCard quote={quote?.quote} />
            </div>

            {/* Right Sidebar Column */}
            <div className="lg:col-span-4 flex flex-col">
              <StatusUpdatesWidget quote={quote?.quote} />
              <ShipmentDocumentsWidget quote={quote?.quote} />
            </div>
          </div>
        </div>
      ) : (
        <EmptyUI
          icon={<Truck size={80} />}
          title="No shipment details available for this quote."
          description="Please Convert it to a shipment to view tracking details."
        />
      )}
    </>
  );
}
