import socket from "./socket";

/* ---------- CONNECTION ---------- */
export const connectSocket = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("❌ Socket not connecting: token missing");
    return;
  }

  socket.auth = { token }; // 🔥 THIS IS THE KEY LINE

  if (!socket.connected) {
    console.log("🔌 Socket connecting with token...");
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    console.log("❌ Socket disconnecting...");
    socket.disconnect();
  }
};

/* ---------- SOCKET CONNECT HANDLER ---------- */
export const onSocketConnected = (cb) => {
  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);

    // 🔁 Auto rejoin meeting after refresh / reconnect
    if (socket.meetingId) {
      console.log("🔁 Rejoining meeting:", socket.meetingId);
      socket.emit("join-meeting", { meetingId: socket.meetingId });
    }

    cb?.();
  });
};

/* ---------- MEETING EVENTS ---------- */
export const joinMeetingRoom = ({ meetingId }) => {
  console.log("➡️ Joining meeting room:", meetingId);

  // ✅ attach to socket, not global
  socket.meetingId = meetingId;

  socket.emit("join-meeting", { meetingId });
};

export const leaveMeetingRoom = (meetingId) => {
  console.log("⬅️ Leaving meeting room");

  socket.meetingId = null;
  socket.emit("leave-meeting", { meetingId });
};

export const onMeetingError=(cb)=>{
socket.on("meeting-error",(error)=>{
  console.log("Meeting Socket error",error);
  cb?.(error);
})
}

/* ---------- HOST CONTROLS ---------- */
export const hostMuteUser = (meetingId, targetUserId) => {
  socket.emit("host-mute-user", { meetingId, targetUserId });
};

export const hostUnmuteUser = (meetingId, targetUserId) => {
  socket.emit("host-unmute-user", { meetingId, targetUserId });
};

/* ---------- LISTENERS ---------- */
export const onUserJoined = (cb) => socket.on("user-joined", cb);
export const onUserLeft = (cb) => socket.on("user-left", cb);
export const onParticipantsCount = (cb) =>
  socket.on("participants-count", cb);
export const onUserMuted = (cb) => socket.on("user-muted", cb);
export const onUserUnmuted = (cb) => socket.on("user-unmuted", cb);
export const onMeetingEnded = (cb) => socket.on("meeting-ended", cb);

/* ---------- CLEANUP ---------- */
export const offMeetingListeners = () => {
  socket.off("user-joined");
  socket.off("user-left");
  socket.off("participants-count");
  socket.off("user-muted");
  socket.off("user-unmuted");
  socket.off("meeting-ended");
  socket.off("meeting-error");
};
