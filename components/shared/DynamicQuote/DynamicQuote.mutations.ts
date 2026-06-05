import { createQuote, updateQuote } from "@/api/services/quotes.api";
import { bookShipment, createShipment, updateShipment } from "@/api/services/shipment.api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useDynamicQuoteMutations({shipmentId, quoteId}: {shipmentId?: string, quoteId?: string}) {
    const router = useRouter();
    const createQuoteMutation = useMutation({
    mutationFn: (data: unknown) => createQuote(data),
    onSuccess: () => {
      toast.success("Quote created successfully");
      router.push("/quotes")
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data.message);
    },
  });

  const createQuoteAndConvertToShipmentMutation = useMutation({
    mutationFn: (data: unknown) => createQuote(data),
    onSuccess: (res) => {
      router.push(`/shipment/?id=${res.quote.id}&mode=conversion`);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data.message);
    },
  });

  const updateQuoteMutation = useMutation({
    mutationFn: (data: unknown) => updateQuote(quoteId!, data),
    onSuccess: () => {
      toast.success("Quote updated successfully");
      router.push("/quotes");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data.message);
    },
  });

  //  create shipment mutation
  const createShipmentMutation = useMutation({
    mutationFn: (data: unknown) => createShipment(data),
    onSuccess: (res) => {
      // toast.success("Shipment created successfully");
      return res.data;
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data.message);
    },
  });
  const updateShipmentMutation = useMutation({
    mutationFn: (data: unknown) => updateShipment(shipmentId!, data),
    onSuccess: () => {
      toast.success("Shipment updated successfully");
      router.push("/quotes");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data.message);
    },
  });

  const bookShipmentMutation = useMutation({
    mutationFn: (data: unknown) => bookShipment(data),
    onSuccess: (res) => {
      toast.success("Shipment booked successfully");
      // console.log("CREATE SHIPMENT RESPONSE:", res);
      router.push("/track");
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data.message);
    },
  });
    return{
        createQuoteMutation,
        createQuoteAndConvertToShipmentMutation,
        updateQuoteMutation,
        createShipmentMutation,
        updateShipmentMutation,
        bookShipmentMutation
    }
}