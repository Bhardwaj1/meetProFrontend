import api from "./api";

export const registerUser = async (payload) => {
  const response = await api.post("/auth/register", payload);
  return response.data;
};

export const verifyOtp = async (payload) => {
  const response = await api.post("/auth/verify-otp", payload);
  return response.data;
};
export const resendOtp = async (email) => {
  const response = await api.post("/auth/resend-otp", { email });
  return response.data;
};
