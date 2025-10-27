// src/api/authApi.js
import axiosInstance, { setAuthToken } from "./axiosInstance";

//  LOGIN
export async function login(data) {
  try {
    const res = await axiosInstance.post("/api/auth/login", data);
    if (res.data?.token) setAuthToken(res.data.token);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Network error" };
  }
}

// SIGNUP
export async function signup(data) {
  try {
    const res = await axiosInstance.post("/api/auth/signup", data);
    if (res.data?.token) setAuthToken(res.data.token);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Network error" };
  }
}

//  GET CURRENT USER (if backend provides /me route)
export async function me() {
  try {
    const res = await axiosInstance.get("/api/auth/me");
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Network error" };
  }
}

// FORGOT PASSWORD (send OTP to email)
export async function forgotPassword(data) {
  // data = { email }
  try {
    const res = await axiosInstance.post("/api/auth/forgot-password", data);
    return res.data; // { message: "OTP sent to email" }
  } catch (err) {
    throw err.response?.data || { message: "Network error" };
  }
}

// VERIFY OTP
export async function verifyOtp(data) {
  // data = { email, otp }
  try {
    const res = await axiosInstance.post("/api/auth/verify-otp", data);
    return res.data; // { message: "OTP verified" }
  } catch (err) {
    throw err.response?.data || { message: "Network error" };
  }
}

// RESET PASSWORD
export async function resetPassword(data) {
  // data = { email, otp, newPassword }
  try {
    const res = await axiosInstance.post("/api/auth/reset-password", data);
    return res.data; // { message: "Password reset successful" }
  } catch (err) {
    throw err.response?.data || { message: "Network error" };
  }
}
