"use client";

import { useRef, useState, useEffect } from "react";
import ClaimFileContactInformation from "./ClaimFileContactInformation";
import ClaimDetailsAndDocuments from "./ClaimDocuments/ClaimsDetailAndDocuments";
import SendClaimRequest from "./ClaimsSendRequest";
import { Button } from "@/components/ui/button";
import { ShipmentDetails } from "./ShipmentDetails";
import { useSearchParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createClaim,
  getClaimById,
  updateClaim,
} from "@/api/services/claims.api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { LoaderCircle } from "lucide-react";
import { useClaimFile } from "./useClaimFile.hooks";
import Comments from "./Comment";
import { useAuth } from "@/context/auth.context";

export default function FileNewClaim() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const [contactData, setContactData] = useState<any>({});
  const [claimDetailsData, setClaimDetailsData] = useState<any>({});
  const [uploadedDocument, setUploadedDocument] = useState<any>(null);
  // const [shipmentId, setShipmentId] = useState<number | null>(null);
  const [additionalInsurancePurchased, setAdditionalInsurancePurchased] =
    useState<boolean>(false);
  const [shipmentDetails, setShipmentDetails] = useState<any>(null);
  const contactInfoRef = useRef<any>(null);
  const claimDetailsRef = useRef<any>(null);
  const shipmentDetailsRef = useRef<any>(null);

  // Fetch claim if in edit mode
  const {
    handleSubmit,
    initialContactValues,
    initialDetailsValues,
    isPendingMutation,
    claimId,
    quoteDataLoading,
    quoteDataPending,
  } = useClaimFile({
    action,
    setUploadedDocument,
    setAdditionalInsurancePurchased,
    setContactData,
    setClaimDetailsData,
    uploadedDocument,
    additionalInsurancePurchased,
    claimDetailsRef,
    contactInfoRef,
    setShipmentDetails,
  });
  const { isAdmin } = useAuth();

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-6xl rounded border bg-white dark:bg-card shadow-sm">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">
            {action === "edit" ? "Edit Claim" : "File New Claim"}
          </h1>
        </div>

        {/* Contact Details */}
        <div className="border-b bg-white dark:bg-card px-6 py-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 dark:text-white">
              Contact Details
            </h2>
          </div>
        </div>

        {/* Shipment Details Section */}
        <div className="px-6 py-5">
          {/* @ts-ignore */}
          <ShipmentDetails
            shipmentDetails={shipmentDetails}
            quoteDataPending={quoteDataPending}
            quoteDataLoading={quoteDataLoading}
            setAdditionalInsurancePurchased={setAdditionalInsurancePurchased}
            // claimShipmentId={claim?.shipmentId}
          />

          {/* Contact Information */}
          <ClaimFileContactInformation
            ref={contactInfoRef}
            onChange={setContactData}
            initialValues={initialContactValues}
          />
          <ClaimDetailsAndDocuments
            ref={claimDetailsRef}
            onChange={setClaimDetailsData}
            uploadedDocument={uploadedDocument}
            setUploadedDocument={setUploadedDocument}
            initialValues={initialDetailsValues}
          />
          <SendClaimRequest
            contactInformation={{
              fullName: contactData.contactFullName || "",
              phone: contactData.contactPhoneNumber || "",
              email: contactData.contactEmailAddress || "",
              claimName: contactData.claimName || "",
            }}
            claimDetails={{
              claimType: claimDetailsData.claimType || "",
              claimedValue: claimDetailsData.totalValueOfGoods
                ? `$${claimDetailsData.totalValueOfGoods} ${claimDetailsData.currency || ""}`
                : "",
              description: claimDetailsData.goodsDescription || "",
              invoiceName: uploadedDocument?.[0]?.fileName || "",
              invoiceUrl: uploadedDocument?.[0]?.fileUrl || "",
            }}
            uploadedDocument={uploadedDocument}
            setUploadedDocument={setUploadedDocument}
            shipmentDetails={shipmentDetails}
          />
          {claimId ? <Comments claimId={claimId} /> : ""}
          {!isAdmin ? <div className="flex justify-between pt-2">
            <Button
              variant="outline"
              disabled={isAdmin}
              // onClick={onPrevious}
              // className="px-6 py-2 border border-slate-300 rounded-md text-sm hover:bg-slate-50"
            >
              Previous Step
            </Button>

            <Button
              variant="default"
              onClick={handleSubmit}
              disabled={isPendingMutation }
              // className="px-6 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
            >
              {isPendingMutation && (
                <LoaderCircle className="animate-spin mr-2" size={16} />
              )}
              {action === "edit" ? "Edit Claim" : "Submit Claim"}
            </Button>
          </div> : ""}
        </div>
      </div>
    </div>
  );
}
