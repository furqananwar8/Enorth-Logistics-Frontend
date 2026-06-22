import {
  CheckCircle2,
  RotateCcw,
  FileText,
  Image as ImageIcon,
  MapPin,
  Truck,
  X,
  CircleDollarSign,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth.context";
import { AddSurchargesModal } from "../../(AdditionalSurcharges)/AddSurchargesModal";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelShipment } from "@/api/services/tracking.api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";

export function ShipmentHeader({ quote }: { quote?: any }) {
  if (!quote) return null;
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const getCarrierLink = () => {
    switch (quote?.shipment?.carrier.toLowerCase()) {
      case "fedex":
        return "https://www.fedex.com/en-us/tracking.html";
      case "tst":
        return "https://www.tst-cfexpress.com/home";
      case "tforce":
        return "https://www.tforcefreight.com/ltl/apps/Tracking";
      case "xpo":
        return "https://www.xpo.com/track";
      case "minimax":
        return "https://tracking.carrierlogistics.com/scripts/mnme.pol/web-login2.htm";
      default:
        return "/";
    }
  };
  const queryClient = useQueryClient();
  const cancelShipmentMutation = useMutation({
    mutationFn: () => cancelShipment(quote.shipment.id),
    onSuccess: () => {
      toast.success("Shipment Canceled");
      queryClient.invalidateQueries({ queryKey: ["trackings"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      // toast.error(error.response?.data.message);
      toast.error("Unable to cancel the shipment");
    },
  });
  const handleCancelShipment = () => {
    cancelShipmentMutation.mutate()
  };
  const carriersWithCancelShipmentSupport = ["tst","tforce", "fedex"]
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 className="text-3xl font-semibold mb-1">Shipment Overview</h1>
        <div className="flex items-center text-primary text-sm font-medium hover:underline cursor-pointer mb-4">
          <RotateCcw className="w-4 h-4 mr-1" />
          Click here for a quick tour
        </div>

        <div className="space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-foreground">
              Transaction #:
            </span>{" "}
            {quote.quoteId || "N/A"}
            <FileText className="w-3.5 h-3.5 ml-1 cursor-pointer hover:text-primary" />
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-foreground">BOL #:</span>{" "}
            {quote.shipment?.bolNumber || "N/A"}
            <FileText className="w-3.5 h-3.5 ml-1 cursor-pointer hover:text-primary" />
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-foreground">
              Tracking/PRO #:
            </span>{" "}
            {quote.shipment?.trackingNumber || "N/A"}
            <FileText className="w-3.5 h-3.5 ml-1 cursor-pointer hover:text-primary" />
          </div>
        </div>

        <div className="flex items-center gap-1 text-primary text-sm font-medium mt-3 cursor-pointer hover:underline">
          <FileText className="w-4 h-4" />
          Shipping Label
        </div>
      </div>

      <div className="flex flex-col items-end gap-4 self-stretch md:self-auto justify-between">
        <div className="flex items-center gap-2 text-xl font-semibold text-primary">
          {quote.status === "UNKNOWN" ? (
            "Shipment Created"
          ) : (
            <>
              {/* <CheckCircle2 className="w-6 h-6 fill-primary text-white" /> */}
              <span className="capitalize">{quote.shipment.currentStatus.toLowerCase().replaceAll("_", " ")}</span>
            </>
          )}
        </div>
        <div className="flex gap-2">
          {user?.user?.role.name === "superAdmin" && (
            <Button onClick={() => setOpen(true)}>
              <CircleDollarSign size={14} /> Add Surcharge
            </Button>
          )}
          {carriersWithCancelShipmentSupport.includes(quote.shipment.carrier.toLowerCase()) && <Button onClick={handleCancelShipment} disabled variant="destructive">
            <X className="w-4 h-4" />
            Cancel Shipment
          </Button>}

          {quote.shipment.carrier && (
            <Button asChild>
              <Link target="_blank" href={getCarrierLink()}>
                <ExternalLink />
                Track Shipment
              </Link>
            </Button>
          )}
        </div>
      </div>
      <AddSurchargesModal
        bookedShipment={quote}
        open={open}
        onOpenChange={(open) => setOpen(open)}
      />
    </div>
  );
}
