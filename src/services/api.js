import axios from "axios";
import { getSocket, refreshSocketAuth } from "../socket/socket";

/* ================================
   AXIOS INSTANCE
================================ */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 🔥 refreshToken cookie ke liye
});

/* ================================
   REQUEST INTERCEPTOR
================================ */
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================================
   RESPONSE INTERCEPTOR (REFRESH)
================================ */

// 🔒 refresh coordination (parallel 401 safe)
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ❌ Network / CORS error
    if (!error.response) {
      return Promise.reject(error);
    }

    // ❌ Not a 401 → normal error
    if (error.response.status !== 401) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return Promise.reject(message);
    }

    // ❌ Refresh-token endpoint itself failed
    if (originalRequest.url?.includes("/auth/refresh-token")) {
      forceLogout();
      return Promise.reject("Session expired. Please login again.");
    }

    // ❌ Infinite retry protection
    if (originalRequest._retry) {
      forceLogout();
      return Promise.reject("Unauthorized");
    }

    originalRequest._retry = true;

    /* ================================
       QUEUE HANDLING (MULTIPLE 401)
    ================================ */
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      /* 🔄 REFRESH TOKEN CALL
         ❗ plain axios (no interceptors) */
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
        {},
        { withCredentials: true }
      );

      const newAccessToken = res.data.accessToken;

      // 🔥 Save new token
      localStorage.setItem("accessToken", newAccessToken);

      // 🔥 FIX: set global header correctly
      api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

      // 🔁 resolve queued requests
      processQueue(null, newAccessToken);

      // 🔌 refresh socket auth
      refreshSocketAuth(newAccessToken);

      // 🔁 retry original request
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      forceLogout();
      return Promise.reject("Session expired. Please login again.");
    } finally {
      isRefreshing = false;
    }
  }
);

/* ================================
   FORCE LOGOUT (CENTRALIZED)
================================ */
function forceLogout() {
  console.log("ForceLogout");

  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");

  const socket = getSocket();
  socket?.disconnect();

  // hard redirect (interceptor context)
  setTimeout(() => {
    window.location.href = "/login";
  }, 100);
}

export default api;
