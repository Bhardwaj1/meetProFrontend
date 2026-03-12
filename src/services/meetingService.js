import api from "./api";

/**
 * Meetings API Service (Domain Layer)
 * - Keep only API calling logic here
 * - No Redux/UI logic
 * - All functions return `res.data` for consistent consumer behavior
 */

export const meetingService = {
  createInstant: async () => {
    const res = await api.post("/meeting/create-meeting");
    return res.data;
  },

  schedule: async ({
    title,
    description,
    scheduledAt,
    duration,
    invitedUsers = [],
  }) => {
    const res = await api.post("/meeting/schedule-meeting", {
      title,
      description,
      scheduledAt,
      duration,
      invitedUsers,
    });
    return res.data;
  },

  start: async ({ meetingId }) => {
    const res = await api.post("/meeting/start-meeting", {
      meetingId,
    });
    return res.data;
  },

  /**
   * Join meeting
   * @param {Object} payload
   * @param {string} payload.meetingId
   * @param {string=} payload.displayName
   */
  join: async ({ meetingId }) => {
    const res = await api.post("/meeting/join-meeting", {
      meetingId,
    });
    return res.data;
  },

  /**
   * Leave meeting
   * @param {Object} payload
   * @param {string} payload.meetingId
   */
  leave: async ({ meetingId }) => {
    const res = await api.post("/meeting/leave-meeting", {
      meetingId,
    });
    return res.data;
  },

  /**
   * End meeting (host-only usually)
   * @param {Object} payload
   * @param {string} payload.meetingId
   */
  end: async ({ meetingId }) => {
    const res = await api.post("/meeting/end-meeting", {
      meetingId,
    });
    return res.data;
  },

  /**
   * Get meeting details
   * @param {string} meetingId
   */
  getDetails: async (meetingId) => {
    const res = await api.get(`/meeting/${meetingId}`);
    return res.data;
  },

  /**
   * List my meetings (optional)
   * @param {Object=} params
   */
  list: async (params = {}) => {
    const res = await api.get("/meeting", { params });
    return res.data;
  },
};
