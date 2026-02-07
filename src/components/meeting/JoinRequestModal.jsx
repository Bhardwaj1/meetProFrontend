import React, { useState } from "react";
import { useEffect } from "react";
import { getSocket } from "../../socket/socket";
import { Notify } from "../../utils/notify";
import { useSound } from "../../hooks/useSound";

const JoinRequestModal = ({ meetingId, isHost }) => {
  const [requests, setRequests] = useState([]);
  const playAdmitSound = useSound("/sounds/admit.mp3");

  /* ================================
     SOCKET LISTENER (JOIN REQUEST)
  ================================ */


  // console.log("Render Modal");
  // console.log("isHost:", isHost);
  // console.log("requests.length:", requests.length);
  // console.log("requests:", requests);

  useEffect(() => {
    console.log("🔔 JoinRequestModal - isHost:", isHost);
    if (!isHost) {
      console.log("🚫 Not host, skipping listener");
      return;
    }
    const socket = getSocket();
    console.log("🔌 Socket in modal:", socket);
    console.log("🔌 Socket ID:", socket?.id);
    if (!socket) {
      console.log("🚫 No socket found");
      return;
    }

    const handleJoinRequest = ({ userId, name }) => {
      console.log("🔔 JOIN REQUEST RECEIVED:", { userId, name });
      setRequests((prev) =>
        prev.some((u) => u.userId === userId)
          ? prev
          : [...prev, { userId, name }]
      );
      Notify(`${name} want to join`, "info");
    };

    // Test listener - remove after debugging
    const testAllEvents = (eventName, ...args) => {
      console.log("📡 Socket event received:", eventName, args);
    };
    socket.onAny(testAllEvents);

    // console.log("✅ Registering join-requested listener");
    socket.on("join-requested", handleJoinRequest);
    
    return () => {
      // console.log("🧹 Cleaning up join-requested listener");
      socket.off("join-requested", handleJoinRequest);
      socket.offAny(testAllEvents);
    };
  }, [isHost]);
  
  /* ================================
     APPROVE / REJECT
  ================================ */

  const handleApprove = (userId) => {
    const socket = getSocket();
    socket?.emit("approve-join", { meetingId, userId });
    playAdmitSound();
    setRequests((prev) => prev.filter((u) => u.userId !== userId));
    Notify("User admitted", "success");
  };


  const handleReject = (userId) => {
    const socket = getSocket();
    socket?.emit("reject-join", { meetingId, userId });

    setRequests((prev) => prev.filter((u) => u.userId !== userId));
    Notify("User rejected", "warning");
  };

  if (!isHost || requests.length === 0) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md">
        {/* Glow */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-500/30 to-indigo-600/30 blur-2xl -z-10"></div>

        {/* Modal */}
        <div className="rounded-3xl bg-[#020617] border border-white/10 shadow-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Join Requests</h2>

          <p className="text-xs text-gray-400 mb-6">
            Approve or reject participants waiting to join.
          </p>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {requests.map((req) => (
              <div
                key={req.userId}
                className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-3 border border-white/10"
              >
                <div>
                  <p className="font-semibold text-sm">{req.name}</p>
                  <p className="text-xs text-gray-400">Waiting to join</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleReject(req.userId)}
                    className="
                      px-3 py-1.5
                      rounded-lg
                      text-xs
                      bg-white/10
                      hover:bg-white/20
                      transition
                    "
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => handleApprove(req.userId)}
                    className="
                      px-3 py-1.5
                      rounded-lg
                      text-xs
                      bg-gradient-to-r from-purple-500 to-indigo-600
                      hover:opacity-90
                      transition
                      font-semibold
                    "
                  >
                    Admit
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 text-xs text-gray-500">
            New requests will appear here automatically.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JoinRequestModal;
