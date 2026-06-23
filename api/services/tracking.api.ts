import apiClient from "../client";

export const getAllTrackings = async (
  search: string = "",
  dateRange: string[] = ["", ""],
  packaging: string = "",
  carrier: string = "",
  service: string = "",
  status: string = "",
  username: string = "",
  orderSource: string = "",
  originPostal: string = "",
  destinationPostal: string = "",
  page: number = 1,
) => {
  const query = new URLSearchParams();
  if (search) query.append("search", search);
  if (dateRange[0]) query.append("dateFrom", dateRange[0]);
  if (dateRange[1]) query.append("dateTo", dateRange[1]);
  if (packaging) query.append("packaging", packaging);
  if (carrier) query.append("carrier", carrier);
  if (service) query.append("service", service);
  if (status) query.append("status", status);
  if (username) query.append("username", username);
  if (orderSource) query.append("orderSource", orderSource);
  if (originPostal) query.append("originPostalCode", originPostal);
  if (destinationPostal)
    query.append("destinationPostalCode", destinationPostal);
  if (page) query.append("page", page.toString());

  const response = await apiClient.get(`/trackings?${query.toString()}`);
  return response.data;
};

export const getShipmentTrackingEvents = async (payload: any) => {
  const response = await apiClient.post(`/shipment-carriers/track`, payload);
  return response.data;
};

export const getShippingLabelDocument = async (id: string) => {
  const response = await apiClient.post(`/shipments/${id}/shipping-labels`);
  return response.data;
};


export const cancelShipment = async (id: string) => {
  const response = await apiClient.delete(`/shipment-carriers/${id}/cancel`);
  return response.data;
};
