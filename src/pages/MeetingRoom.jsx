import { useEffect, useRef } from "react";
import socket from "../socket/socket";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { useMeeting } from "../context/MeetingContext";

import {
  connectSocket,
  disconnectSocket,
  hostMuteUser,
  hostUnmuteUser,
} from "../socket/socketEvents";

import VideoTile from "../components/meeting/VideoTile";
import Controls from "../components/meeting/Controls";

export default function MeetingRoom() {
  const { meetingId } = useSelector((state) => state.meeting);
  const { user } = useAuth(); // { id, name, email }
  const { participants, setParticipants } = useMeeting();

  const hasJoinedRef = useRef(false);

  /* ================================
     0️⃣ SOCKET CONNECT / DISCONNECT
  ================================ */
  useEffect(() => {
    connectSocket();
    return () => {
      disconnectSocket();
    };
  }, []);

  /* ================================
     1️⃣ JOIN MEETING (ONLY ONCE)
  ================================ */
  useEffect(() => {
    if (!meetingId || !user || hasJoinedRef.current) return;

    hasJoinedRef.current = true;
    socket.emit("join-meeting", { meetingId });

    console.log("🔗 joined meeting:", meetingId);
  }, [meetingId, user]);

  /* ================================
     2️⃣ AUTHORITATIVE SNAPSHOT
     (MOST IMPORTANT FIX)
  ================================ */
  useEffect(() => {
    if (!user) return;

    const handleMeetingState = (snapshot) => {
      console.log("📸 meeting-state:", snapshot);

      setParticipants(
        snapshot.participants.map((p) => ({
          id: p.id, // ✅ frontend uses `id`
          name: p.name,
          isMuted: p.isMuted,
          isMe: p.id === user.id, // ✅ correct comparison
        }))
      );
    };

    socket.on("meeting-state", handleMeetingState);

    return () => {
      socket.off("meeting-state", handleMeetingState);
    };
  }, [user, setParticipants]);

  /* ================================
     3️⃣ REALTIME JOIN / LEAVE
  ================================ */
  useEffect(() => {
    if (!user) return;

    const handleUserJoined = ({ user: joinedUser }) => {
      console.log("➕ user joined:", joinedUser);

      setParticipants((prev) =>
        prev.some((p) => p.id === joinedUser.id)
          ? prev
          : [
              ...prev,
              {
                id: joinedUser.id,
                name: joinedUser.name,
                isMuted: false,
                isMe: joinedUser.id === user.id,
              },
            ]
      );
    };

    const handleUserLeft = ({ userId }) => {
      console.log("➖ user left:", userId);

      setParticipants((prev) => prev.filter((p) => p.id !== userId));
    };

    socket.on("user-joined", handleUserJoined);
    socket.on("user-left", handleUserLeft);

    return () => {
      socket.off("user-joined", handleUserJoined);
      socket.off("user-left", handleUserLeft);
    };
  }, [user, setParticipants]);

  /* ================================
     4️⃣ MUTE / UNMUTE SYNC
  ================================ */
  useEffect(() => {
    const handleMuted = ({ userId }) => {
      setParticipants((prev) =>
        prev.map((p) => (p.id === userId ? { ...p, isMuted: true } : p))
      );
    };

    const handleUnmuted = ({ userId }) => {
      setParticipants((prev) =>
        prev.map((p) => (p.id === userId ? { ...p, isMuted: false } : p))
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
     GUARD (VERY IMPORTANT)
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
      {/* TOP BAR */}
      <div className="h-14 flex items-center justify-between px-6 bg-white/5 border-b border-white/10">
        <h1 className="font-semibold">🎥 Meeting in progress</h1>
        <span className="text-xs text-gray-400">ID: {meetingId}</span>
      </div>

      {/* VIDEO GRID */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {participants.map((p) => (
            <VideoTile
              key={p.id}
              name={p.name}
              isMe={p.isMe}
              isMuted={p.isMuted}
              onMute={() => hostMuteUser(meetingId, p.id)}
              onUnmute={() => hostUnmuteUser(meetingId, p.id)}
            />
          ))}
        </div>
      </div>

      {/* CONTROLS */}
      <div className="sticky bottom-0 z-40">
        <div className="mx-auto max-w-3xl px-6 pb-6">
          <div className="rounded-2xl bg-white/10 border border-white/10 shadow-xl">
            <Controls />
          </div>
        </div>
      </div>
    </div>
  );
}
