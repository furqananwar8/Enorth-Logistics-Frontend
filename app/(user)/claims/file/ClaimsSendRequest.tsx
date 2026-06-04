"use client";

import { forwardRef, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CircleDollarSign,
  Truck,
  ClipboardList,
  Contact,
  Check,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
type Props = {
  shipmentDetails?: any;
  contactInformation?: {
    fullName?: string;
    phone?: string;
    email?: string;
    claimName?: string;
  };
  claimDetails?: {
    claimType?: string;
    claimedValue?: string;
    description?: string;
    invoiceName?: string;
    invoiceUrl?: string;
  };
  onPrevious?: () => void;
  onSubmit?: () => void;
  uploadedDocument?: any;
  setUploadedDocument?: (doc: any) => void;
};

const SendClaimRequest = forwardRef(
  (
    {
      shipmentDetails,
      contactInformation,
      claimDetails,
      onPrevious,
      onSubmit,
      uploadedDocument,
      setUploadedDocument,
    }: Props,
    ref,
  ) => {
    useEffect(() => {
      console.log("SendClaimRequest: ShipmentDetails", shipmentDetails);
    }, [shipmentDetails]);
    return (
      <>
      
        <div className="border rounded-md bg-white dark:bg-card overflow-hidden mb-5">
          <Accordion type="single" collapsible defaultValue="claim-review">
            <AccordionItem value="claim-review" className="border-none">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h2 className="flex items-center gap-2 font-semibold text-slate-700">
                  <CircleDollarSign className="w-5 h-5" />
                  Send Claim Request
                </h2>

                <AccordionTrigger className="p-0 hover:no-underline text-sm text-slate-500 cursor-pointer"></AccordionTrigger>
              </div>

              <AccordionContent className="p-4 space-y-8 h-max">
                {/* Top Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Shipment Details */}
                  <div>
                    <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm mb-4 border-b pb-2">
                      <Truck className="w-4 h-4" />
                      Shipment Details
                    </div>

                    {shipmentDetails ? <div className="grid grid-cols-2 gap-y-5 text-sm">
                      <div>
                        <p className="text-slate-500">Tracking/BOL #</p>
                        <p>{shipmentDetails?.shipment?.trackingNumber}</p>
                      </div>

                      <div />

                      <div>
                        <p className="text-slate-500">Total Price</p>
                        <p>
                          {shipmentDetails?.shipment?.totalNetCharge}{" "}
                          {shipmentDetails?.shipment?.currency}
                        </p>
                      </div>

                      <div />

                      <div>
                        <p className="text-slate-500">Shipment Date</p>
                        <p>
                          {" "}
                          {format(
                            new Date(shipmentDetails?.shipment?.shipDate),
                            "hh:mm a, MMM dd, yyyy",
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500">Service</p>
                        <p>{shipmentDetails?.shipment?.serviceName}</p>
                      </div>

                      <div>
                        <p className="text-slate-500">Insurance Amount</p>
                        <p>{shipmentDetails?.shipment?.insuranceAmount}</p>
                      </div>

                      <div>
                        <p className="text-slate-500">Insurance Type</p>
                        <p>{shipmentDetails?.shipment?.insuranceType}</p>
                      </div>
                    </div> : ""}
                  </div>

                  {/* Contact Information */}
                  <div>
                    <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm mb-4 border-b pb-2">
                      <Contact className="w-4 h-4" />
                      Contact Information
                    </div>

                    <div className="grid grid-cols-2 gap-y-5 text-sm">
                      <div>
                        <p className="text-slate-500">Full Name</p>
                        <p>{contactInformation?.fullName}</p>
                      </div>

                      <div>
                        <p className="text-slate-500">Phone</p>
                        <p>{contactInformation?.phone}</p>
                      </div>

                      <div>
                        <p className="text-slate-500">Email</p>
                        <p>{contactInformation?.email}</p>
                      </div>

                      <div>
                        <p className="text-slate-500">Name of Claim</p>
                        <p>{contactInformation?.claimName}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Claim Details */}
                <div>
                  <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm mb-4 border-b pb-2">
                    <ClipboardList className="w-4 h-4" />
                    Claim Details
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div>
                      <p className="text-slate-500">Claim Type</p>
                      <p className="capitalize">{claimDetails?.claimType}</p>
                    </div>

                    <div>
                      <p className="text-slate-500">Value of Claimed Goods</p>
                      <p className="font-semibold">
                        {claimDetails?.claimedValue}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">Cost Invoice</p>
                      <Link
                        href={
                          claimDetails?.invoiceUrl
                            ? `${process.env.NEXT_PUBLIC_BASE_URL}${claimDetails.invoiceUrl}`
                            : "#"
                        }
                        target="_blank"
                        className="flex items-center gap-1 text-blue-600 dark:text-accent cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        {claimDetails?.invoiceName || "N/A"}
                      </Link>
                    </div>
                  </div>

                  <div className="mt-5 text-sm">
                    <p className="text-slate-500">Description of Goods</p>
                    <p>{claimDetails?.description}</p>
                  </div>
                </div>

                {/* Footer */}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </>
    );
  },
);

// SendClaimRequest.displayName = "SendClaimRequest";

export default SendClaimRequest;
