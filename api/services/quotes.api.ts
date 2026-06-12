// create quote


import apiClient from "../client";

export const createQuote = async (payload: any) => {
    const response = await apiClient.post("/quotes", payload);
    return response.data;
};

export const updateQuote = async (id: string, payload: any) => {
    const response = await apiClient.patch(`/quotes/${id}`, payload);
    return response.data;
};
// delete quote
export const deleteQuote = async (id: string) => {
    const response = await apiClient.delete(`/quotes/${id}`);
    return response.data;
};
// add to favorite
export const addToFavorite = async (id: string) => {
    const response = await apiClient.post(`/quotes/${id}/favorite`);
    return response.data;
};
// remove from favorite
export const removeFromFavorite = async (id: string) => {
    const response = await apiClient.delete(`/quotes/${id}/favorite`);
    return response.data;
};
// get all quotes


// get single quote
export const getSingleQuote = async (id: string | number) => {
    const response = await apiClient.get(`/quotes/${id}`);
    return response.data;
};

// export const getAllQuotes = async (search: string, dateRange: string[], shipmentType: string) => {
//     // /api/v1/quotes?status=draft&quoteNumber&dateFrom&dateTo&shipmentType
//     const response = await apiClient.get(`/quotes`);
//     return response.data;
// };

export const getAllQuotes = async (
    search: string = "", 
    dateRange: string[] = ["", ""], 
    packaging: string = "",
    status: string = "",
) => {
    const query = new URLSearchParams();
    if (search) query.append("quoteNumber", search);
    if (dateRange[0]) query.append("dateFrom", dateRange[0]);
    if (dateRange[1]) query.append("dateTo", dateRange[1]);
    if (packaging) query.append("shipmentType", packaging);
    if (status) query.append("status", status);

    const response = await apiClient.get(`/quotes?${query.toString()}`);
    return response.data;
};
export const getFavoriteQuotes = async () => {
    const response = await apiClient.get(`/quotes/favorites`);
    return response.data;
};
export const getSavedQuotes = async () => {
    const response = await apiClient.get(`/quotes/saved`);
    return response.data;
};
export const getSpotQuotes = async () => {
    const response = await apiClient.get(`/quotes/?shipmentType=SPOT_LTL,SPOT_FTL`);
    return response.data;
};
