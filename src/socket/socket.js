import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:8000";

let socket;

export const initSocket = (accessToken) => {
  socket = io(SOCKET_URL, {
    autoConnect: false,
    withCredentials: true,
    auth: {
      accessToken,
    },
  });
};

export const getSocket = () => socket;

// Refresh Socket Auth
export const refreshSocketAuth = (newAccessToken) => {
  if (!socket) {
    return;
  };
  console.log("Refreshing socket auth");
  socket.auth.accessToken = newAccessToken;
  if (socket.connected) {
    socket.disconnect();
  };

  socket.connect();
};
