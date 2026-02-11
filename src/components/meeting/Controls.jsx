
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { leaveMeeting } from "../../store/slices/meetingSlice";
import { useMeeting } from "../../context/useMeeting";
import { Notify } from "../../utils/notify";
import { leaveMeetingRoom } from "../../socket/socketEvents";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";

export default function Controls() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

const { toggleCamera, toggleMic, leaveSession, mediaState } = useMeeting();
  const { meetingId, loading } = useSelector((state) => state.meeting);

 

  /* ============================
     LEAVE MEETING
  ============================ */
  const handleLeaveMeeting = async () => {
    if (!window.confirm("Are you sure you want to leave the meeting?")) return;

    try {
      leaveMeetingRoom(meetingId);

      if (meetingId) {
        await dispatch(leaveMeeting({ meetingId })).unwrap();
      }

      leaveSession();
      Notify("You left the meeting", "success");
      navigate("/", { replace: true });
    } catch (error) {
      Notify("Failed to leave meeting:" + error, "error");
    }
  };

  return (
    <div className="flex justify-center">
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 backdrop-blur border border-white/10 shadow-lg">
        {/* 🎤 MIC */}
        <button
          onClick={toggleMic}
          className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-700 transition"
        >
          {mediaState.mic === "on" ? <Mic /> : <MicOff />}
        </button>

        {/* 🎥 CAMERA */}
        <button
          onClick={toggleCamera}
          className="p-3 rounded-full bg-purple-600 hover:bg-purple-700 transition"
        >
          {mediaState.camera === "on" ? <Video /> : <VideoOff />}
        </button>

        {/* ❌ LEAVE */}
        <button
          onClick={handleLeaveMeeting}
          disabled={loading}
          className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition"
        >
          <PhoneOff />
        </button>
      </div>
    </div>
  );
}
