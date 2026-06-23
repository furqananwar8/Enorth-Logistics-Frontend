import { Info, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getShipmentTrackingEvents } from "@/api/services/tracking.api";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { Loader } from "@/components/common/Loader";
import { useEffect, useState } from "react";

export function ShipmentBreakdownCard({ quote }: { quote?: any }) {
  if (!quote) return null;
  const [events, setEvents] = useState([]);
  const trackingEventsMutation = useMutation({
    mutationFn: (data: any) => getShipmentTrackingEvents(data),
    onSuccess: async (data) => {
      // toast("Login Successful", { description: "Welcome back! You are now logged in." })
      console.log("FETCHED", data);
      setEvents(data.events);
    },
    onError: (error: AxiosError<ApiError>) => {
      console.log(error);
    },
  });
  useEffect(() => {
    if (quote) {
      console.log("quote", quote);
      const payload = {
        shipmentId: quote?.shipment?.id,
        carrier: quote.shipment?.carrier,
      };
      trackingEventsMutation.mutate(payload);
    }
  }, []);

  if (trackingEventsMutation.isPending) {
    return (
      <div className="flex items-center justify-center pb-5">
        <Loader />
      </div>
    );
  }
  const getEventTrackingList = (event: any) => {
    switch (quote.shipment?.carrier.toLowerCase()) {
      case "fedex":
        return (
          <TableRow key={event.occurredAt}>
            <TableCell className="capitalize">{event.status}</TableCell>
            <TableCell>
              {event.occurredAt
                ? format(new Date(event.occurredAt), "MMM dd, yyyy")
                : "N/A"}
              <span>({new Date(event.occurredAt).toISOString().split("T")[1].split(".")[0]})</span>
            </TableCell>
          </TableRow>
        );
      default:
        return(
          <></>
        )
    }
  };
  const carriersWithDefinedEventTracking = ["fedex"]
  return (
    <Card className="mb-6 pt-0 rounded-sm shadow-sm">
      <CardHeader className="bg-slate-50 dark:bg-gray-900 border-b py-3 px-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <Info className="w-6 h-6" />
          Shipment Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 text-sm">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-1 text-muted-foreground">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Carrier:</span>{" "}
              <span className="font-medium text-foreground">
                {quote.shipment?.carrier || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service Name:</span>{" "}
              <span className="font-medium text-foreground">
                {quote.shipment?.serviceName || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Est. Transit Time:</span>{" "}
              <span className="font-medium text-foreground">N/A</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base Charge:</span>{" "}
              <span className="font-medium">
                ${quote.shipment?.totalBaseCharge || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Surcharges:</span>{" "}
              <span className="font-medium">
                ${quote.shipment?.totalSurcharges || 0}
              </span>
            </div>
            <div className="flex justify-between mt-1 pt-1">
              <span className="text-muted-foreground">Total Price:</span>{" "}
              <span className="font-bold text-base">
                $
                {(quote.shipment?.totalBaseCharge || 0) +
                  (quote.shipment?.totalSurcharges || 0)}{" "}
                {quote.shipment?.currency || "USD"}
              </span>
            </div>
          </div>
        </div>

        {carriersWithDefinedEventTracking.includes(quote.shipment.carrier.toLowerCase()) && <Accordion
          type="single"
          collapsible
          defaultValue="tracking"
          className="w-full border-none"
        >
          <AccordionItem value="tracking" className="border-none">
            <AccordionTrigger className="text-primary font-semibold py-2 hover:no-underline text-sm border-b">
              Detailed Tracking History
            </AccordionTrigger>
            <AccordionContent className="pt-2 h-full">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold text-foreground h-8">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-foreground h-8">
                      Date
                    </TableHead>
                    <TableHead className="font-semibold text-foreground h-8 text-right">
                      Comment
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.length > 0 ? (
                    events
                      .slice()
                      .reverse()
                      .map((event: any) => getEventTrackingList(event))
                  ) : (
                    <TableRow>
                      <TableCell className="capitalize">
                        Shipment Created
                      </TableCell>
                      <TableCell>
                        {format(
                          new Date(quote.createdAt),
                          "hh:mm a, MMM dd, yyyy",
                        )}
                      </TableCell>
                      <TableCell className="text-right">-</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        </Accordion>}
      </CardContent>
    </Card>
  );
}
