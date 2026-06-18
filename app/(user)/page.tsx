"use client";
import DashboardHeader from "./home/components/DashboardHeader";
import NotificationsSummary from "./home/components/NotificationsSummary";
import TrackingUpdatesWidget from "./home/components/TrackingUpdatesWidget";
import InvoicingUpdatesWidget from "./home/components/InvoicingUpdatesWidget";
import TrackShipmentsWidget from "./home/components/TrackShipmentsWidget";
import PickupSummaryWidget from "./home/components/PickupSummaryWidget";
import PromoBannerWidget from "./home/components/PromoBannerWidget";
import { useAuth } from "@/context/auth.context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Loader } from "@/components/common/Loader";
import { useQuery } from "@tanstack/react-query";
import { getAllTrackings } from "@/api/services/tracking.api";

export default function Home() {
  const { user, isLoading, isPending } = useAuth();
  const router = useRouter();
  // const hasRedirected = useRef(false)
  // const pathname = usePathname()

  // useEffect(() => {
  //     if (!data) return

  //     const defaultPage = data?.user?.settings?.default_landing_page

  //     // ONLY redirect if user is on root page
  //     if (
  //         !hasRedirected.current &&
  //         pathname === "/" &&
  //         defaultPage
  //     ) {
  //         hasRedirected.current = true
  //         router.replace(defaultPage)
  //     }
  // }, [data, pathname, router])

  useEffect(() => {
    if (user.user.role.name === "superAdmin") {
      router.replace("/track");
    }
  }, []);
  if (isLoading || isPending) {
    return <Loader />;
  }
  const [count, setCount] = useState({
    ready: 0,
    inTransit: 0,
    missedPickups:0,
    todaysPickups:0
  });
  const { data: trackings } = useQuery({
    queryKey: ["trackings"],
    queryFn: () => getAllTrackings(),
    retry: 1,
    enabled: true,
  });

  useEffect(() => {
    if (trackings) {
      const now = new Date();
      setCount({
        ready: trackings?.data?.filter(
          (shipment: any) => shipment.status === "CONVERTED_TO_SHIPMENT",
        ).length,
        inTransit: trackings?.data?.filter(
          (shipment: any) => shipment.status === "IN_TRANSIT",
        ).length,
        todaysPickups:trackings.data.filter(
          (invoice: any) => (new Date(invoice.shipment.shipDate) === now || invoice.shipment.status === "CONVERTED_TO_SHIPMENT"),
        ).length,
        missedPickups:trackings.data.filter(
          (invoice: any) => (new Date(invoice.shipment.shipDate) < now || invoice.shipment.status === "CONVERTED_TO_SHIPMENT"),
        ).length,
      });
    }
  }, [trackings]);
  if (user) {
    return (
      <div className="min-h-screen bg-primary/5 dark:bg-background py-8">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Column (Left) */}
            <div className="flex-1 min-w-0">
              <DashboardHeader />
              <NotificationsSummary />
              <TrackingUpdatesWidget
                ready={count.ready}
                inTransit={count.inTransit}
              />
              <InvoicingUpdatesWidget />
            </div>
            {/* Sidebar (Right) */}
            <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6">
              <TrackShipmentsWidget />
              <PickupSummaryWidget
              todaysPickups={count.todaysPickups}
              missedPickups={count.missedPickups}
              />
              <PromoBannerWidget />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
