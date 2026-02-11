import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getSocket } from "../socket/socket";
import { useAuth } from "../context/AuthContext";
import { useMeeting } from "../context/useMeeting";

import {
  connectSocket,
  disconnectSocket,
  hostMuteUser,
  hostUnmuteUser,
} from "../socket/socketEvents";

import VideoTile from "../components/meeting/VideoTile";
import Controls from "../components/meeting/Controls";
import { Notify } from "../utils/notify";
import MeetingTime from "../components/meeting/MeetingTime";
import JoinRequestModal from "../components/meeting/JoinRequestModal";
import ChatPanel from "../components/meeting/ChatPanel";

export default function MeetingRoom() {
  const { id: meetingId } = useParams();
  const { user } = useAuth();
  const myUserId = (user?.id || user?._id || "").toString();
  const {
    participants,
    setParticipants,
    startLocalStream,
    mediaState,
    localStream,
    createOffer,
    handleWebRtcOffer,
    handleWebRtcAnswer,
    handleWebRtcIceCandidate,
    removePeerConnection,
  } = useMeeting();
  const [recentJoin, setRecentJoin] = useState(null);

  const hasJoinedRef = useRef(false);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef(null);
  const cameraStartedRef = useRef(false);
  const [showChat, setShowChat] = useState(false);

  console.log("🟢 MeetingRoom mounted",participants);

  /* ================================
     0️⃣ SOCKET CONNECT / DISCONNECT
  ================================ */
  useEffect(() => {
    connectSocket();

    const socket = getSocket();
    if (!socket) return;

    const onConnect = () => {
      console.log("✅ Socket connected:", socket.id);
    };

    const onDisconnect = () => {
      console.log("❌ Socket disconnected");
    };

    const onConnectError = (err) => {
      console.log("🚫 Socket connect error:", err.message);
      Notify("Connection issue. Reconnecting…", "warning");

      setTimeout(() => {
        socket.connect();
      }, 1500);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      disconnectSocket();
    };
  }, []);

  /* ================================
     🎥 AUTO-START CAMERA
  ================================ */
  useEffect(() => {
    if (!user || cameraStartedRef.current) return;
    if (mediaState.camera !== "off") return;

    cameraStartedRef.current = true;
    console.log("🎥 Auto-starting camera...");

    startLocalStream()
      .then(() => {
        console.log("✅ Camera auto-started successfully");
      })
      .catch((err) => {
        console.error("❌ Camera auto-start failed:", err);
        Notify("Camera access denied. Click camera button to enable.", "warning");
      });
  }, [user, mediaState.camera, startLocalStream]);



  /* ================================
     1️⃣ JOIN MEETING
  ================================ */
  useEffect(() => {
    if (!meetingId || !user) return;
    if (hasJoinedRef.current) return;

    const socket = getSocket();
    if (!socket) return;

    const emitJoin = () => {
      if (socket.connected) {
        socket.emit("join-meeting", { meetingId });
      } else {
        setTimeout(emitJoin, 300);
      }
    };

    emitJoin();
  }, [meetingId, user]);

  /* ================================
     2️⃣ AUTHORITATIVE SNAPSHOT
  ================================ */
  useEffect(() => {
    if (!user) return;

    const socket = getSocket();
    if (!socket) return;

    const handleMeetingState = ({ participants }) => {
      hasJoinedRef.current = true;
      retryCountRef.current = 0;

      const mappedParticipants = participants.map((p) => {
        const participantId = (p.id || p._id || "").toString();
        return {
          id: participantId,
          name: p.name,
          role: p.role,
          isMuted: p.isMuted,
          isMe: participantId === myUserId,
          stream: null,
        };
      });

      setParticipants(mappedParticipants);

      mappedParticipants.forEach((participant) => {
        if (participant.isMe) return;
        if (myUserId > participant.id) return;
        createOffer({ remoteUserId: participant.id, socket });
      });
    };

    socket.on("meeting-state", handleMeetingState);
    return () => socket.off("meeting-state", handleMeetingState);
  }, [user, myUserId, setParticipants, createOffer]);

  /* ================================
     3️⃣ REALTIME JOIN / LEAVE
  ================================ */
  useEffect(() => {
    if (!user) return;
    const socket = getSocket();
    if (!socket) return;

    const handleUserJoined = ({ user: joinedUser }) => {
      const joinedUserId = (joinedUser?._id || joinedUser?.id || "").toString();
      if (!joinedUserId) return;
      setRecentJoin(joinedUserId);
      setParticipants((prev) =>
        prev.some((p) => p.id === joinedUserId)
          ? prev
          : [
              ...prev,
              {
                id: joinedUserId,
                name: joinedUser.name,
                role: joinedUser.role || "PARTICIPANT",
                isMuted: false,
                isMe: joinedUserId === myUserId,
                stream: null,
              },
            ],
      );
      if (myUserId <= joinedUserId) {
        setTimeout(() => {
          createOffer({ remoteUserId: joinedUserId, socket });
        }, 200);
      }
      // reset after animation duration
      setTimeout(() => setRecentJoin(null), 800);
    };

    const handleUserLeft = ({ userId }) => {
      const leftUserId = userId?.toString();
      removePeerConnection(leftUserId);
      setParticipants((prev) => prev.filter((p) => p.id !== leftUserId));
    };

    socket.on("user-joined", handleUserJoined);
    socket.on("user-left", handleUserLeft);

    return () => {
      socket.off("user-joined", handleUserJoined);
      socket.off("user-left", handleUserLeft);
    };
  }, [user, myUserId, setParticipants, createOffer, removePeerConnection]);

  /* ================================
     4️⃣ MUTE / UNMUTE
  ================================ */
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleMuted = ({ userId }) => {
      setParticipants((prev) =>
        prev.map((p) => (p.id === userId ? { ...p, isMuted: true } : p)),
      );
    };

    const handleUnmuted = ({ userId }) => {
      setParticipants((prev) =>
        prev.map((p) => (p.id === userId ? { ...p, isMuted: false } : p)),
      );
    };

    socket.on("user-muted", handleMuted);
    socket.on("user-unmuted", handleUnmuted);

    return () => {
      socket.off("user-muted", handleMuted);
      socket.off("user-unmuted", handleUnmuted);
    };
  }, [setParticipants]);

  /* ================================
     4.5️⃣ WEBRTC SIGNALING
  ================================ */
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onOffer = async (payload) => {
      try {
        await handleWebRtcOffer(payload, socket);
      } catch (error) {
        console.error("Failed to handle WebRTC offer:", error);
      }
    };

    const onAnswer = async (payload) => {
      try {
        await handleWebRtcAnswer(payload);
      } catch (error) {
        console.error("Failed to handle WebRTC answer:", error);
      }
    };

    const onIceCandidate = async (payload) => {
      try {
        await handleWebRtcIceCandidate(payload);
      } catch (error) {
        console.error("Failed to handle ICE candidate:", error);
      }
    };

    socket.on("webrtc-offer", onOffer);
    socket.on("webrtc-answer", onAnswer);
    socket.on("webrtc-ice-candidate", onIceCandidate);

    return () => {
      socket.off("webrtc-offer", onOffer);
      socket.off("webrtc-answer", onAnswer);
      socket.off("webrtc-ice-candidate", onIceCandidate);
    };
  }, [handleWebRtcOffer, handleWebRtcAnswer, handleWebRtcIceCandidate]);

  /* ================================
     5️⃣ MEETING ERROR
  ================================ */
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const MAX_RETRY = 3;

    const handleMeetingError = () => {
      if (hasJoinedRef.current) return;

      if (retryCountRef.current < MAX_RETRY) {
        retryCountRef.current += 1;
        Notify(`Retry ${retryCountRef.current}/${MAX_RETRY}`, "warning");

        retryTimerRef.current = setTimeout(() => {
          socket.emit("join-meeting", { meetingId });
        }, 1000);
      } else {
        Notify("Meeting unavailable. Redirecting…", "error");
        socket.emit("leave-meeting", { meetingId });
        setTimeout(() => (window.location.href = "/"), 1200);
      }
    };

    socket.on("meeting-error", handleMeetingError);

    return () => {
      socket.off("meeting-error", handleMeetingError);
      clearTimeout(retryTimerRef.current);
    };
  }, [meetingId]);
  const isHost = participants.some((p) => p.isMe && p.role === "HOST");

  const getGridLayout = (count) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count <= 4) return "grid-cols-2";
    if (count <= 6) return "grid-cols-3";
    return "grid-cols-4";
  };
  /* ================================
     UI
  ================================ */
  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading meeting...
      </div>
    );
  }

  /* ================================
     UI
  ================================ */
  return (
  <div className="h-screen flex flex-col bg-[#020617] text-white">
    {/* 🔔 HOST JOIN REQUEST MODAL */}
    <JoinRequestModal meetingId={meetingId} isHost={isHost} />

    {/* HEADER */}
    <div className="h-14 flex items-center justify-between px-6 bg-white/5 border-b border-white/10">
      <h1 className="font-semibold">🎥 Meeting in progress</h1>
      <span className="text-xs text-gray-400">
        ID: {meetingId} | Users: {participants.length}
      </span>
    </div>

    {/* MAIN CONTENT AREA */}
    <div className="flex flex-1 overflow-hidden">

      {/* VIDEO AREA */}
      <div className="flex-1 p-4 overflow-hidden">
        <div
          className={`
            grid gap-4 h-full
            ${getGridLayout(participants.length)}
          `}
          style={{ gridAutoRows: "1fr" }}
        >
          {participants.map((p) => (
            <VideoTile
              key={p.id}
              name={p.name}
              isMe={p.isMe}
              isMuted={p.isMuted}
              stream={p.isMe ? localStream : p.stream}
              onMute={() => hostMuteUser(meetingId, p.id)}
              onUnmute={() => hostUnmuteUser(meetingId, p.id)}
              animate={p.id === recentJoin}
            />
          ))}
        </div>
      </div>

      {/* DESKTOP CHAT PANEL */}
      <div className="hidden md:block w-80 border-l border-white/10 bg-[#0f172a]">
        <ChatPanel />
      </div>
    </div>

    {/* MOBILE CHAT TOGGLE BUTTON */}
    <div className="md:hidden fixed bottom-24 right-4 z-50">
      <button
        onClick={() => setShowChat((prev) => !prev)}
        className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-full shadow-lg transition"
      >
        💬
      </button>
    </div>

    {/* MOBILE CHAT DRAWER */}
    {showChat && (
      <div className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex justify-end">
        <div className="w-80 h-full bg-[#0f172a] shadow-xl">
          <ChatPanel />
        </div>
      </div>
    )}

    {/* CONTROLS */}
    <div className="sticky bottom-0 z-40 relative">
      <MeetingTime />
      <div className="mx-auto max-w-3xl px-6 pb-6">
        <div className="shadow-xl">
          <Controls />
        </div>
      </div>
    </div>
  </div>
);

}
