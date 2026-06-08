import { ShipmentSurchargesResponse } from "@/types/api/payment.types";
import apiClient from "../client";

export const createIntent = async (customerId: string) => {
    const response = await apiClient.post("/payments/setup-intent", { customerId });
    return response.data;
};

export const getCards = async () => {
    const response = await apiClient.get("/payments/saved-cards");
    return response.data;
};

export const topupWallet = async (payload: any) => {
    const response = await apiClient.post("/payments/charge", payload);
    return response.data;
};
// create surcharges
export const createSurcharges = async (payload: ShipmentSurchargesResponse) => {
    const response = await apiClient.post(`/surcharges`, payload);
    return response.data;
};