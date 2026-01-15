import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { joinMeeting } from "../store/slices/meetingSlice";
import { toast } from "sonner";

export default function JoinMeeting() {
  const [meetingId, setMeetingId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleJoinMeeting = async () => {
    if (!meetingId.trim()) return;

    try {
      setLoading(true);

      const res = await dispatch(joinMeeting(meetingId.trim())).unwrap();

      // 🔥 CASE 1: waiting for host approval
      if (res?.message?.toLowerCase().includes("waiting")) {
        navigate(`/waiting-room/${meetingId.trim()}`);
        return;
      }

      // 🔥 CASE 2: host / already approved user
      navigate(`/meeting/${meetingId.trim()}`);
    } catch (err) {
      toast.error(err?.message || "Unable to join meeting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center px-6 py-12 bg-[#020617] text-white">
      <div className="max-w-xl w-full">
        {/* Card */}
        <div className="relative rounded-3xl bg-white/5 backdrop-blur border border-white/10 p-8 shadow-2xl">
          {/* Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-indigo-600/30 blur-2xl rounded-3xl -z-10"></div>

          {/* Header */}
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            🔗 Join a Meeting
          </h1>
          <p className="text-gray-400 mb-8 text-sm">
            Enter the meeting ID shared by the host to join the meeting room.
          </p>

          {/* Input */}
          <div className="space-y-4">
            <Input
              placeholder="Enter Meeting ID"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
            />

            <Button
              disabled={loading}
              onClick={handleJoinMeeting}
              className="
                w-full
                py-4
                text-base
                font-bold
                bg-gradient-to-r from-purple-500 to-indigo-600
                hover:opacity-90
                active:scale-[0.98]
                transition
              "
            >
              {loading ? "Joining meeting..." : "Join Meeting"}
            </Button>
          </div>

          {/* Helper text */}
          <div className="mt-6 text-xs text-gray-400 space-y-2">
            <p>• Make sure your camera & microphone permissions are enabled</p>
            <p>• Check the meeting ID carefully before joining</p>
          </div>
        </div>
      </div>
    </div>
  );
}
