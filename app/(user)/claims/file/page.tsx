"use client";

import {
  Phone,
  Truck,
  CircleCheck,
  RotateCcw,
  BookUser,
  Info,
} from "lucide-react";
import { useRef, useState } from "react";
import ClaimFileContactInformation from "./ClaimFileContactInformation";
import ClaimDetailsAndDocuments from "./ClaimsDetailAndDocuments";
import SendClaimRequest from "./ClaimsSendRequest";
import { Button } from "@/components/ui/button";

export default function FileNewClaim() {
  const contactInfoRef = useRef<any>(null);
  const claimDetailsRef = useRef<any>(null);

  const [contactData, setContactData] = useState<any>({});
  const [claimDetailsData, setClaimDetailsData] = useState<any>({});

  const handleSubmit = async () => {
    try {
      // Validate contact information form
      const isContactValid = await contactInfoRef.current?.trigger();
      // Validate claim details and documents form
      const isClaimDetailsValid = await claimDetailsRef.current?.trigger();

      if (isContactValid && isClaimDetailsValid) {
        console.log("All forms are valid");
        // You can add your submission logic here
      } else {
        console.log("Please fill in all required fields");
      }
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-6xl rounded border bg-white dark:bg-card shadow-sm">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">
            File New Claim
          </h1>
        </div>

        {/* Contact Details */}
        <div className="border-b bg-white dark:bg-card px-6 py-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 dark:text-white">Contact Details</h2>
            <button className="text-sm text-gray-500 hover:text-gray-700">
              Hide
            </button>
          </div>
        </div>

        {/* Shipment Details */}
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-900 dark:text-accent" />
              <h3 className="text-2xl font-semibold text-blue-900 dark:text-accent">
                Shipment Details
              </h3>
            </div>

            <button className="flex items-center gap-2 text-sm text-red-600 hover:underline">
              <RotateCcw className="h-4 w-4" />
              Select Another Shipment
            </button>
          </div>

          <div className="mb-5">
            <h2 className="text-4xl font-bold text-blue-900 dark:text-accent">
              Tracking: #2009773252
            </h2>

            <div className="mt-4 flex items-center gap-2 text-green-600">
              <CircleCheck className="h-5 w-5 fill-green-600 text-white" />
              <span className="font-semibold">Delivered</span>
            </div>

            <div className="mt-5 grid gap-6 md:grid-cols-2 text-sm text-gray-800 dark:text-white">
              <div className="space-y-1">
                <p>Transaction: #43205932</p>
                <p>BOL: #CFF18617</p>
                <p>Shipment Date: Apr 30 2026</p>
                <p>Insurance Amount: $0.00</p>
                <p>Insurance Type: None</p>
              </div>

              <div className="space-y-1">
                <p>Carrier: Fastfrate</p>
                <p>Service: Express</p>

                <div className="flex items-center gap-1">
                  <span>Total Price: $183.79 CAD</span>
                  <Info className="h-4 w-4 text-blue-700" />
                </div>

                <p>Booked By: Moazzam Muhammad</p>
              </div>
            </div>

            {/* Checkbox */}
            <div className="mt-6 flex items-center gap-3">
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300"
              />
              <label className="text-sm text-gray-700">
                I am confirming that this is the shipment I'd like to file a
                claim for
              </label>
            </div>
          </div>

          {/* Contact Information */}
          <ClaimFileContactInformation 
            ref={contactInfoRef}
            onChange={setContactData}
          />
          <ClaimDetailsAndDocuments 
            ref={claimDetailsRef}
            onChange={setClaimDetailsData}
          />
          <SendClaimRequest
            shipmentDetails={{
              trackingBol: "2009773252",
              totalPrice: "$183.79 CAD",
              shipmentDate: "Apr 30, 2026",
              service: "Fastfrate Express",
              insuranceAmount: "$0.00",
              insuranceType: "None",
            }}
            contactInformation={{
              fullName: contactData.contactFullName || "",
              phone: contactData.contactPhoneNumber || "",
              email: contactData.contactEmailAddress || "",
              claimName: contactData.claimName || "",
            }}
            claimDetails={{
              claimType: claimDetailsData.shipmentStatus || "",
              claimedValue: claimDetailsData.totalMissingGoodsValue ? `$${claimDetailsData.totalMissingGoodsValue} ${claimDetailsData.currency || ""}` : "",
              description: claimDetailsData.freightDescription || "",
              invoiceName: "tforce.png",
            }}
          />
          <div className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  // onClick={onPrevious}
                  // className="px-6 py-2 border border-slate-300 rounded-md text-sm hover:bg-slate-50"
                >
                  Previous Step
                </Button>

                <Button
                  variant="default"
                  onClick={handleSubmit}
                  // className="px-6 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
                >
                  Submit Claim
                </Button>
              </div>
        </div>
      </div>
    </div>
  );
}
