import { dataTagErrorSymbol } from "@tanstack/react-query";
import apiClient from "../client";

export const getNotifications = async (params?: { page?: number; limit?: number }) => {
    const response = await apiClient.get("/notifications", { params });
    return response.data;
};
// dismiss notification api
export const dismissNotification = async (id: number) => {
    const response = await apiClient.delete(`/notifications/?notificationIds=${id}`);
    return response.data;
};

// data
// {
//     "title": "Reminder to my self",
//     "message": "Be ready for what's comming in your way!",
//     "scheduledAt": "2026-04-18T02:10:00.000Z",
//     "sendTo": 1
// }

export interface CreateReminderType {
    title: string;
    message: string;
    scheduledAt: Date;
    sendTo: number[];
}
// create reminder api
export const createReminder = async (data: CreateReminderType) => {
    const response = await apiClient.post("/reminders", data);
    return response.data;
};
