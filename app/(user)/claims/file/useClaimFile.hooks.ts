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
  shipmentConfirmed,
  isAdmin,
  setShipmentConfirmedError,
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
  shipmentConfirmed: boolean;
  isAdmin: boolean;
  setShipmentConfirmedError: (value: boolean) => void;
}) {
  const searchParams = useSearchParams();
  const claimId = action === "edit" ? searchParams.get("claimId") : null;
  const quoteId = Number(searchParams.get("quoteId"))
  const shipmentId = Number(searchParams.get("shipmentId"))

  const { data: claimData } = useQuery({
    queryKey: ["claim", claimId],
    queryFn: () => getClaimById(claimId!),
    enabled: action === "edit" && !!claimId,
  });

  const {
    data: quoteData,
    isLoading: quoteDataLoading,
    isPending: quoteDataPending,
  } = useQuery({
    queryKey: ["quote", quoteId],
    queryFn: () => getSingleQuote(quoteId!),
    enabled: !!quoteId,
  });

  useEffect(() => {
    if (claimData) {
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
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data.message);
    },
  });

  const handleSubmit = async () => {
    try {
      setShipmentConfirmedError(false);
      const isContactValid = await contactInfoRef.current?.trigger();
      const isClaimDetailsValid = await claimDetailsRef.current?.trigger();

      if (
        isContactValid &&
        isClaimDetailsValid &&
        (isAdmin || shipmentConfirmed) &&
        quoteId &&
        uploadedDocument
      ) {
        const payload = {
          ...contactInfoRef.current?.getValues?.(),
          ...claimDetailsRef.current?.getValues?.(),
          shipmentId,
          documents: uploadedDocument ? uploadedDocument : [],
          status: "SUBMITTED",
          additionalInsurancePurchased,
        };

        if (action === "edit") {
          updateClaimMutation.mutate(payload);
        } else {
          createClaimMutation.mutate(payload);
        }
      } else {
        if (!isAdmin && !shipmentConfirmed) {
          setShipmentConfirmedError(true);
        }
        toast.error("Please fill in all required fields and confirm the shipment");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error("Validation error:", error);
      toast.error("Please fill in all required fields");
      window.scrollTo({ top: 0, behavior: 'smooth' });
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