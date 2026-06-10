import { LoginPayload } from "@/types/auth/login.types";
import apiClient from "../client";
import { ForgotPasswordValues } from "@/lib/validations/auth/forgot-password-schema";
import { ResetPasswordValues } from "@/lib/validations/auth/reset-password-schema";
import { AddUserFormValues } from "@/app/(user)/settings/(user-preference)/(add-user)/AddUser";
import { ChangePasswordFormValues } from "@/lib/validations/user/change-password.schema";

export const registerUser = async (payload: any) => {
  const response = await apiClient.post("/auth/signup", payload);
  return response.data;
};
export const getUser = async () => {
  const response = await apiClient.get("/users/me");
  return response.data;
};
export const loginUser = async (payload: LoginPayload) => {
  const response = await apiClient.post("/auth/signin", payload);
  return response.data;
};
export const forgotPassword = async (data: ForgotPasswordValues) => {
  const response = await apiClient.post("/auth/forgot-password", data);
  return response.data;
};
export const resetPassword = async (data: ResetPasswordValues) => {
  const response = await apiClient.patch("/auth/reset-password", data);
  return response.data;
};
// Create users from admin dashboard
export const createUser = async (data: AddUserFormValues) => {
  const response = await apiClient.post("/users", data);
  return response.data;
};
export const getAllUsers = async () => {
  const response = await apiClient.get("/users");
  return response.data;
};
export const getAllUnverifiedUsers = async () => {
  const response = await apiClient.get("/users/unverified-accounts");
  return response.data;
};
export const getAllCompanies = async () => {
  const response = await apiClient.get("/companies");
  return response.data;
};
export const addCompanyRates = async (
  id:string,
  payload:any) => {
  const response = await apiClient.patch(`/companies/${id}/rates`, payload);
  return response.data;
};

export const logoutUser = async () => {
  const response = await apiClient.post("/auth/logout");
  return response.data;
};

export const changePassword = async (data: ChangePasswordFormValues) => {
  const response = await apiClient.patch("/users/password", data);
  return response.data;
};

export const updateUserProfile = async (data: FormData) => {
  const response = await apiClient.patch("/users/me", data);
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};

export const deleteUserProfilePhoto = async () => {
  const response = await apiClient.delete("/users/me/profile-pic");
  return response.data;
};

export const updateUserSettings = async (data: any) => {
  const response = await apiClient.post("/users/me/settings", data);
  return response.data;
};
// edit user from admin dashboard

export const editUserAdmin = async (data: AddUserFormValues) => {
  // // console.log("data", data)
  const response = await apiClient.patch(`/users/${data.id}`, data);
  return response.data;
};

export const approveUser = async (id: number, payload: any) => {
  const response = await apiClient.patch(
    `/users/${id}/account-review`,
    payload,
  );
  return response.data;
};

// roles
export const getAllRoles = async () => {
  const response = await apiClient.get("/roles");
  return response.data;
};

export const getAllPermissions = async () => {
  const response = await apiClient.get("/permissions");
  return response.data;
};

// Get all users admin dashboard
// export const getUsers = async () => {
//     const response = await apiClient.get("/users")
//     return response.data
// }
