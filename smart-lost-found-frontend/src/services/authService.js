import API from "../api/axios";

export const loginWithPassword = (credentials) =>
  API.post("/auth/login", credentials);

export const resendOtp = (email) =>
  API.post("/auth/send-otp", { email });

export const verifyLoginOtp = (payload) =>
  API.post("/auth/verify-otp", payload);
