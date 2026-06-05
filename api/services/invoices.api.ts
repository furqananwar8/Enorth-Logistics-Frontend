import apiClient from "../client";

export const getAllInvoices = async (
    search: string = "",
    dateRange: string[] = ["", ""],
    packaging: string = "",
    carrier: string = "",
    service: string = "",
    status: string = "",
    shipmentDetail: string = "",
    bookedBy: string = "",
    category: string = "all",
    currency: string = "both"
) => {
    const query = new URLSearchParams();
    if (search) query.append("search", search);
    if (dateRange[0]) query.append("dateFrom", dateRange[0]);
    if (dateRange[1]) query.append("dateTo", dateRange[1]);
    if (packaging) query.append("packaging", packaging);
    if (carrier) query.append("carrier", carrier);
    if (service) query.append("service", service);
    if (status) query.append("status", status);
    if (shipmentDetail) query.append("shipmentDetail", shipmentDetail);
    if (bookedBy) query.append("bookedBy", bookedBy);
    if (category && category !== "all") query.append("category", category);
    if (currency && currency !== "both") query.append("currency", currency);

    const response = await apiClient.get(`/invoices?${query.toString()}`);
    return response.data;
};

// get invoice by id
export const getInvoiceById = async (id: number) => {
    const response = await apiClient.get(`/invoices/${id}`);
    return response.data;
}

export const payInvoice = async (id: number) => {
    const response = await apiClient.get(`/invoices/${id}/pay`);
    return response.data;
}

