import { Info, Barcode, MapPin, PackagePlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

function normalizeStatus(status: string): string {
  return status?.toUpperCase().trim() ?? "";
}

export function StatusUpdatesWidget({ quote }: { quote?: any }) {
  if (!quote) return null;

  const events = quote.shipment?.trackingEvents || [];

  // Normalize + compress consecutive identical statuses
  const compressedEvents = events.reduce((acc: any[], event: any, index: number) => {
    const normalized = normalizeStatus(event.status);
    const prevNormalized = index > 0 ? normalizeStatus(events[index - 1].status) : null;

    if (index === 0 || normalized !== prevNormalized) {
      acc.push({ ...event, _normalizedStatus: normalized });
    }
    return acc;
  }, []);

  const iconMapper = (status: string) => {
    switch (status) {
      case "SHIPMENT_CREATED":
      case "CREATED":
        return <PackagePlus className="w-8 h-8 bg-green-100 text-green-500 rounded-full p-1.5" />;
      case "PICKUP":
        return <Barcode className="w-8 h-8 bg-gray-100 text-gray-500 rounded-full p-1.5" />;
      case "OUT_FOR_DELIVERY":
        return <MapPin className="w-8 h-8 bg-yellow-100 text-yellow-500 rounded-full p-1.5" />;
      case "DELIVERED":
        return <MapPin className="w-8 h-8 bg-green-100 text-green-500 rounded-full p-1.5" />;
      case "IN_TRANSIT":
        return <MapPin className="w-8 h-8 bg-blue-100 text-blue-500 rounded-full p-1.5" />;
      case "ARRIVED_AT_FACILITY":
        return <MapPin className="w-8 h-8 bg-yellow-100 text-yellow-500 rounded-full p-1.5" />;
      default:
        return <MapPin className="w-8 h-8 bg-gray-100 text-gray-500 rounded-full p-1.5" />;
    }
  };

  return (
    <Card className="rounded-sm shadow-sm pt-0 mb-4 border-slate-200">
      <CardHeader className="bg-slate-50 dark:bg-gray-900 p-4 flex flex-row items-center justify-between border-b">
        <CardTitle className="text-xl flex items-center gap-2">
          <Info className="w-6 h-6" />
          Status Updates
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="flex flex-col relative">
          {compressedEvents.map((update: any, index: number) => (
            <div key={update.id} className="relative flex items-center mb-8 gap-4 w-full">
              <div className="whitespace-nowrap">
                {update.occurredAt
                  ? format(new Date(update.occurredAt), "MMM dd, yyyy")
                  : "N/A"}
              </div>
              <div className="relative">
                {iconMapper(update._normalizedStatus)}
                {index !== compressedEvents.length - 1 && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0.5 h-full bg-gray-200" />
                )}
              </div>
              <p className="capitalize">
                {update._normalizedStatus.replaceAll("_", " ").toLowerCase()}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}