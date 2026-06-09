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
    destinationPostal: string = ""
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
    if (destinationPostal) query.append("destinationPostalCode", destinationPostal);

    const response = await apiClient.get(`/trackings?${query.toString()}`);
    return response.data;
};