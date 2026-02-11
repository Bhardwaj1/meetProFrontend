import api from "./api";

/**
 * Meeting History API Service (Domain Layer)
 * - Keep only API calling logic here
 * - No Redux/UI logic
 * - All functions return `res.data` for consistent consumer behavior
 */
export const meetingHistoryService = {
  /**
   * Get my meeting history
   * @param {Object=} params
   * @param {number=} params.page
   * @param {number=} params.limit
   */
  get: async (params = {}) => {
    const res = await api.get("/meeting-history", { params });
    return res.data;
  },
};

export const exportMeetingHistory = async (filters = {}) => {
  const res = await api.get("/meeting-history/export", {
    params: filters,
    responseType: "blob", // 🔥 important
  });

  return res.data;
};
