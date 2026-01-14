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

  useEffect(() => {
    if (!isHost) {
      return;
    }
    const socket = getSocket();
    if (!socket) {
      return;
    }

    const handleJoinRequest = ({ userId, name }) => {
      setRequests((prev) =>
        prev.some((u) => u.userId === userId)
          ? prev
          : [...prev, { userId, name }]
      );
      Notify(`${name} want to join`, "info");
    };

    socket.on("join-request", handleJoinRequest);
    return () => {
      socket.off("join-request", handleJoinRequest);
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
