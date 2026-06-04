"use-client";
import EmptyUI from "@/components/common/empty/Empty";
import { Loader } from "@/components/common/Loader";
import { CircleCheck, Info, RotateCcw, Truck } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { useAuth } from "@/context/auth.context";

export function ShipmentDetails({
  shipmentDetails,
  setAdditionalInsurancePurchased,
  quoteDataPending,
  quoteDataLoading,
}: {
  shipmentDetails: any;
  setAdditionalInsurancePurchased: (value: boolean) => void;
  quoteDataPending: boolean;
  quoteDataLoading: boolean;
}) {
  const { isAdmin } = useAuth();

  useEffect(() => {}, [shipmentDetails, quoteDataLoading, quoteDataLoading]);
  if (quoteDataLoading || quoteDataPending) {
    return <Loader />;
  }

  return (
    <>
      {shipmentDetails?.shipment ? (
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-900 dark:text-accent" />
              <h3 className="text-2xl font-semibold text-blue-900 dark:text-accent">
                Shipment Details
              </h3>
            </div>

            <Link
              href="/claims"
              className="flex items-center gap-2 text-sm text-red-600 hover:underline"
            >
              <RotateCcw className="h-4 w-4" />
              Select Another Shipment
            </Link>
          </div>

          <div className="mb-5">
            <h2 className="text-4xl font-bold text-blue-900 dark:text-accent">
              Tracking: #{shipmentDetails?.shipment?.trackingNumber}
            </h2>

            <div className="mt-4 flex items-center gap-2 text-green-600">
              <CircleCheck className="h-5 w-5 fill-green-600 text-white" />
              <span className="font-semibold">
                {shipmentDetails?.shipment?.currentStatus?.replaceAll("_", " ")}
              </span>
            </div>

            <div className="mt-5 grid gap-6 md:grid-cols-2 text-sm text-gray-800 dark:text-white">
              <div className="space-y-1">
                <p>Transaction: #{shipmentDetails?.shipment?.transactionId}</p>
                <p>BOL: #{shipmentDetails?.shipment?.bolNumber}</p>
                <p>
                  Shipment Date:{" "}
                  {format(
                    new Date(shipmentDetails?.shipment?.shipDate),
                    "hh:mm a, MMM dd, yyyy",
                  )}
                </p>
                <p>
                  Insurance Amount: {shipmentDetails?.shipment?.insuranceAmount}
                </p>
                <p>
                  Insurance Type: {shipmentDetails?.shipment?.insuranceType}
                </p>
              </div>

              <div className="space-y-1">
                <p>Carrier: {shipmentDetails?.shipment?.carrier}</p>
                <p>Service: {shipmentDetails?.shipment?.serviceName}</p>

                <div className="flex items-center gap-1">
                  <span>
                    Total Price: {shipmentDetails?.shipment?.totalNetCharge}{" "}
                    {shipmentDetails?.shipment?.currency}
                  </span>
                </div>

                <p>
                  Booked By: {shipmentDetails?.shipment?.bookedBy.firstName}{" "}
                  {shipmentDetails?.shipment?.bookedBy.lastName}
                </p>
              </div>
            </div>

            {/* Checkbox */}
            <div className="mt-6 flex items-center gap-3">
              <Checkbox
                id="confirm-shipment"
                className="h-5 w-5 cursor-pointer"
                disabled={isAdmin}
              />
              <Label
                htmlFor="confirm-shipment"
                className="text-sm text-gray-700"
              >
                I am confirming that this is the shipment I'd like to file a
                claim for
              </Label>
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
