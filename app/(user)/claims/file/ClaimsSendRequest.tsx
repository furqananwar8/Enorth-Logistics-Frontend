"use client";

import { forwardRef } from "react";
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

type Props = {
  shipmentDetails?: {
    trackingBol?: string;
    totalPrice?: string;
    shipmentDate?: string;
    service?: string;
    insuranceAmount?: string;
    insuranceType?: string;
  };
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
  };
  onPrevious?: () => void;
  onSubmit?: () => void;
};

const SendClaimRequest = forwardRef(
  (
    {
      shipmentDetails,
      contactInformation,
      claimDetails,
      onPrevious,
      onSubmit,
    }: Props,
    ref,
  ) => {
    return (
      <div className="border rounded-md bg-white dark:bg-card overflow-hidden">
        <Accordion type="single" collapsible defaultValue="claim-review">
          <AccordionItem value="claim-review" className="border-none">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="flex items-center gap-2 font-semibold text-slate-700">
                <CircleDollarSign className="w-5 h-5" />
                Send Claim Request
              </h2>

              <AccordionTrigger className="p-0 hover:no-underline text-sm text-slate-500">
                Hide
              </AccordionTrigger>
            </div>

            <AccordionContent className="p-4 space-y-8">
              {/* Top Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Shipment Details */}
                <div>
                  <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm mb-4 border-b pb-2">
                    <Truck className="w-4 h-4" />
                    Shipment Details
                  </div>

                  <div className="grid grid-cols-2 gap-y-5 text-sm">
                    <div>
                      <p className="text-slate-500">Tracking/BOL #</p>
                      <p>{shipmentDetails?.trackingBol}</p>
                    </div>

                    <div />

                    <div>
                      <p className="text-slate-500">Total Price</p>
                      <p>{shipmentDetails?.totalPrice}</p>
                    </div>

                    <div />

                    <div>
                      <p className="text-slate-500">Shipment Date</p>
                      <p>{shipmentDetails?.shipmentDate}</p>
                    </div>

                    <div>
                      <p className="text-slate-500">Service</p>
                      <p>{shipmentDetails?.service}</p>
                    </div>

                    <div>
                      <p className="text-slate-500">Insurance Amount</p>
                      <p>{shipmentDetails?.insuranceAmount}</p>
                    </div>

                    <div>
                      <p className="text-slate-500">Insurance Type</p>
                      <p>{shipmentDetails?.insuranceType}</p>
                    </div>
                  </div>
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
                    <p>{claimDetails?.claimType}</p>
                  </div>

                  <div>
                    <p className="text-slate-500">
                      Value of Claimed Goods
                    </p>
                    <p className="font-semibold">
                      {claimDetails?.claimedValue}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">Cost Invoice</p>

                    <div className="flex items-center gap-1 text-blue-600 dark:text-accent">
                      <Check className="w-4 h-4" />
                      {claimDetails?.invoiceName}
                    </div>
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
    );
  },
);

// SendClaimRequest.displayName = "SendClaimRequest";

export default SendClaimRequest;