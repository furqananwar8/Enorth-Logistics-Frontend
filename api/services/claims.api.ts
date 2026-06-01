import apiClient from "../client";

export const getAllClaims = async (filters: any = {}) => {
    // Mock for now. Uses the trackings endpoint as a placeholder until a /claims endpoint exists.
    const query = new URLSearchParams();
    if (filters.search) query.append("search", filters.search);
    if (filters.dateRange?.[0]) query.append("dateFrom", filters.dateRange[0]);
    if (filters.dateRange?.[1]) query.append("dateTo", filters.dateRange[1]);
    if (filters.packaging) query.append("packaging", filters.packaging);
    if (filters.carrier) query.append("carrier", filters.carrier);
    if (filters.service) query.append("service", filters.service);
    if (filters.status) query.append("status", filters.status);

    const response = await apiClient.get(`/claims?${query.toString()}`);
    return response.data;
};
