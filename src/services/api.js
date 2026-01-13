import axios from "axios";

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

// 🔒 refresh coordination
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

    // ❌ agar response hi nahi (network error)
    if (!error.response) {
      return Promise.reject(error);
    }

    // ❌ agar 401 nahi hai → normal error
    if (error.response.status !== 401) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return Promise.reject(message);
    }

    // ❌ refresh endpoint pe hi 401 aaya → logout
    if (originalRequest.url.includes("/auth/refresh-token")) {
      forceLogout();
      return Promise.reject("Session expired. Please login again.");
    }

    // ❌ infinite retry protection
    if (originalRequest._retry) {
      forceLogout();
      return Promise.reject("Unauthorized");
    }

    originalRequest._retry = true;

    /* ================================
       QUEUE HANDLING
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
      // 🔄 refresh token call (cookie based)
      const res = await api.post("/auth/refresh-token");

      const newAccessToken = res.data.accessToken;

      // 🔥 save new token
      localStorage.setItem("accessToken", newAccessToken);

      api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
      processQueue(null, newAccessToken);

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

  // socket disconnect yahan baad me add kar sakte ho
  setTimeout(() => {
    window.location.href = "/login";
  }, 100); // 👈 100ms

}

export default api;
