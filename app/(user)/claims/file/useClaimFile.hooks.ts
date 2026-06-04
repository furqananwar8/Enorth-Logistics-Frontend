import { useEffect, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import {
  createClaim,
  getClaimById,
  updateClaim,
} from "@/api/services/claims.api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { getSingleQuote } from "@/api/services/quotes.api";
import { useAuth } from "@/context/auth.context";

export function useClaimFile({
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
}: {
  action: string | null;
  setUploadedDocument: (doc: any) => void;
  setAdditionalInsurancePurchased: (value: boolean) => void;
  setContactData: (data: any) => void;
  setClaimDetailsData: (data: any) => void;
  uploadedDocument: any;
  additionalInsurancePurchased: boolean;
  claimDetailsRef: any;
  contactInfoRef: any;
  setShipmentDetails: (details: any) => void;
}) {
  const searchParams = useSearchParams();
  const claimId = action === "edit" ? searchParams.get("claimId") : null;
  const shipmentId = searchParams.get("shipmentId");

  const { data: claimData } = useQuery({
    queryKey: ["claim", claimId],
    queryFn: () => getClaimById(claimId!),
    enabled: action === "edit" && !!claimId,
  });

  // get single quote
  const {
    data: quoteData,
    isLoading: quoteDataLoading,
    isPending: quoteDataPending,
  } = useQuery({
    queryKey: ["quote", shipmentId],
    queryFn: () => getSingleQuote(shipmentId!),
    enabled: !!shipmentId,
  });

  useEffect(() => {
    if (claimData) {
      console.log("Fetched Claim Data:", claimData);
      // if (claim.shipmentId) {
      //   setShipmentId(claim.shipmentId);
      // }
      if (claimData.claim.documents) {
        setUploadedDocument(claimData.claim.documents);
      }
      if (claimData.claim.additionalInsurancePurchased !== undefined) {
        setAdditionalInsurancePurchased(
          claimData.claim.additionalInsurancePurchased,
        );
      }
      setContactData({
        contactFullName: claimData.claim.contactFullName || "",
        contactPhoneNumber: claimData.claim.contactPhoneNumber || "",
        contactEmailAddress: claimData.claim.contactEmailAddress || "",
        claimName: claimData.claim.claimName || "",
      });
      setClaimDetailsData({
        claimType: claimData.claim.claimType,
        goodsDescription: claimData.claim.goodsDescription || "",
        totalValueOfGoods: Number(claimData.claim.totalValueOfGoods) || 0,
        currency: claimData.claim.currency || "CAD",
      });
    }
  }, [claimData]);

  useEffect(() => {
    if (action === "create") {
      if (quoteData) {
        setShipmentDetails(quoteData.quote);
        console.log("quoteData:", quoteData);
      }
    } else {
      if (claimData) {
        setShipmentDetails(claimData.claim);
      }
    }
  }, [quoteData, claimData]);

  const createClaimMutation = useMutation({
    mutationFn: (data: any) => createClaim(data),
    onSuccess: () => {
      toast.success("Claim created successfully");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data.message);
    },
  });

  const updateClaimMutation = useMutation({
    mutationFn: (data: any) => updateClaim(claimId!, data),
    onSuccess: () => {
      toast.success("Claim updated successfully");
      // router.push("/claims");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data.message);
    },
  });
  const handleSubmit = async () => {
    console.log(shipmentId);
    try {
      const isContactValid = await contactInfoRef.current?.trigger();
      const isClaimDetailsValid = await claimDetailsRef.current?.trigger();
      console.log(
        "Contact Form Values:",
        contactInfoRef.current?.getValues?.(),
      );

      console.log(
        "Claim Details Values:",
        claimDetailsRef.current?.getValues?.(),
      );

      if (
        isContactValid &&
        isClaimDetailsValid &&
        shipmentId &&
        uploadedDocument
      ) {
        console.log("All forms are valid");

        const payload = {
          ...contactInfoRef.current?.getValues?.(),
          ...claimDetailsRef.current?.getValues?.(),
          shipmentId,
          documents: uploadedDocument ? uploadedDocument : [],
          status: "SUBMITTED",
          additionalInsurancePurchased,
        };

        console.log("Final Payload:", payload);
        if (action === "edit") {
          updateClaimMutation.mutate(payload);
        } else {
          createClaimMutation.mutate(payload);
        }
      } else {
        console.log("Please fill in all required fields");
      }
    } catch (error) {
      console.error("Validation error:", error);
      toast.error("Please fill in all required fields");
    }
  };

  const initialContactValues = useMemo(
    () =>
      claimData
        ? {
            contactFullName: claimData.claim.contactFullName || "",
            contactPhoneNumber: claimData.claim.contactPhoneNumber || "",
            contactEmailAddress: claimData.claim.contactEmailAddress || "",
            claimName: claimData.claim.claimName || "",
          }
        : undefined,
    [claimData],
  );

  const initialDetailsValues = useMemo(
    () =>
      claimData
        ? {
            claimType: claimData.claim.claimType || "MISSING",
            goodsDescription: claimData.claim.goodsDescription || "",
            totalValueOfGoods: Number(claimData.claim.totalValueOfGoods) || 0,
            currency: claimData.claim.currency || "CAD",
          }
        : undefined,
    [claimData],
  );

  const isPendingMutation =
    createClaimMutation.isPending || updateClaimMutation.isPending;
  return {
    handleSubmit,
    initialContactValues,
    initialDetailsValues,
    isPendingMutation,
    claimId,
    quoteDataLoading,
    quoteDataPending,
  };
}
