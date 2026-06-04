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
export const createClaim = async (data: any) => {
  const response = await apiClient.post("/claims", data);
  return response.data;
};
export const deleteClaimDocument = async (fileName: string) => {
  const response = await apiClient.delete(`/claims/documents/${fileName}`);
  return response.data;
};

export const getClaimById = async (id: number | string) => {
  const response = await apiClient.get(`/claims/${id}`);
  return response.data;
};

export const updateClaim = async (id: number | string, data: any) => {
  const response = await apiClient.put(`/claims/${id}`, data);
  return response.data;
};

export const getClaimComments = async (claimId: string | null) => {
  const response = await apiClient.get(`/claims/${claimId}/comments`);
  return response.data;
};
export const addClaimComment = async ({
  claimId,
  message,
}: {
  claimId: string | number;
  message: string;
}) => {
  const response = await apiClient.post(`/claims/${claimId}/comments`, {
    message,
  });
  return response.data;
};
