import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSocket } from "../socket/socket";
import { connectSocket } from "../socket/socketEvents";
import { Notify } from "../utils/notify";
import { leaveMeetingRoom } from "../socket/socketEvents";


export default function WaitingRoom() {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(0);

  /* ================================
     CONNECT SOCKET
  ================================ */
  useEffect(() => {
    connectSocket();
  }, []);

  /* ================================
     TIMER (UX polish)
  ================================ */
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* ================================
     EMIT REQUEST-JOIN (ONCE)
  ================================ */
  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      console.log("❌ WaitingRoom: No socket instance");
      return;
    }

    let emitted = false;
    const emitRequest = () => {
      if (emitted) return;
      
      if (socket.connected) {
        console.log("🚀 WaitingRoom: Emitting request-join for meetingId:", meetingId);
        socket.emit("request-join", { meetingId });
        emitted = true;
      } else {
        console.log("⏳ WaitingRoom: Socket not connected, retrying...");
        setTimeout(emitRequest, 300);
      }
    };

    // Delay to ensure API call completed first
    const timer = setTimeout(emitRequest, 500);
    return () => clearTimeout(timer);
  }, [meetingId]);

  /* ================================
     SOCKET LISTENERS
  ================================ */
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleApproved = () => {
      Notify("Host approved your request 🎉", "success");
      navigate(`/meeting/${meetingId}`);
    };

    const handleRejected = () => {
      Notify("Host rejected your request", "error");
      navigate("/");
    };

    socket.on("join-approved", handleApproved);
    socket.on("join-rejected", handleRejected);

    return () => {
      socket.off("join-approved", handleApproved);
      socket.off("join-rejected", handleRejected);
    };
  }, [meetingId, navigate]);

  /* ================================
     LEAVE WAITING ROOM
  ================================ */
  const handleCancel = () => {
    leaveMeetingRoom(meetingId);
    navigate("/");
  };

  /* ================================
     UI
  ================================ */
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white px-6">
      <div className="relative max-w-xl w-full">
        {/* Glow */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-500/30 to-indigo-600/30 blur-2xl -z-10"></div>

        {/* Card */}
        <div className="rounded-3xl bg-white/5 backdrop-blur border border-white/10 p-10 shadow-2xl text-center">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600/20">
            <span className="text-3xl">⏳</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            Waiting for host
          </h1>

          <p className="text-gray-400 text-sm mb-8">
            Your request has been sent. Please wait while the host admits you
            into the meeting.
          </p>

          {/* Status */}
          <div className="flex items-center justify-center gap-2 text-sm text-indigo-400 mb-6">
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
            Waiting for approval…
          </div>

          {/* Timer */}
          <p className="text-xs text-gray-500 mb-8">
            Waiting for <span className="font-semibold">{seconds}s</span>
          </p>

          {/* Actions */}
          <button
            onClick={handleCancel}
            className="
              w-full
              py-3
              rounded-xl
              bg-white/10
              hover:bg-white/15
              transition
              text-sm
              font-semibold
            "
          >
            Cancel request & go back
          </button>

          {/* Helper */}
          <p className="mt-6 text-xs text-gray-500 leading-relaxed">
            • Do not refresh the page
            <br />• You will be redirected automatically once approved
          </p>
        </div>
      </div>
    </div>
  );
}
