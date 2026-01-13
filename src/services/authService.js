import api from "./api";

export const registerUser = async (payload) => {
  const response = await api.post("/auth/register", payload);
  return response.data;
};

export const verifyOtp = async ({ email, otp }) => {
  const res = await api.post("/auth/verify-otp", { email, otp });
  return res.data;
};

export const loginUser = async (payload) => {
  const response = await api.post("/auth/login", payload);
  return response.data;
};

export const resendOtp = async (email) => {
  const res = await api.post("/auth/resend-otp", { email });
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};
