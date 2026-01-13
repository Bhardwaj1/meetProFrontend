import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createMeeting, joinMeeting } from "../store/slices/meetingSlice";
import Button from "../components/common/Button";
import { Notify } from "../utils/notify";

export default function CreateMeeting() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasNavigatedRef = useRef(false);

  const { loading, meetingId } = useSelector((state) => state.meeting);

  const handleCreateMeeting = () => {
    dispatch(createMeeting({ type: "INSTANT" }));
  };

  /* ================================
     1️⃣ AUTO JOIN AFTER CREATE
  ================================ */
  // useEffect(() => {
  //   if (meetingId) {
  //     dispatch(joinMeeting(meetingId));
  //   }
  // }, [meetingId, dispatch]);

  /* ================================
     2️⃣ NAVIGATE ONCE (MEETING ID IS ENOUGH)
  ================================ */
  useEffect(() => {
    if (meetingId && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      Notify("Meeting created & joined successfully", "success");
      navigate(`/meeting/${meetingId}`);
    }
  }, [meetingId, navigate]);

  return (
    <div className="min-h-full flex items-center justify-center px-6 py-12 bg-[#020617] text-white">
      <div className="max-w-xl w-full">
        <div className="relative rounded-3xl bg-white/5 backdrop-blur border border-white/10 p-8 shadow-2xl">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-blue-600/30 blur-2xl rounded-3xl -z-10"></div>

          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            🚀 Start an Instant Meeting
          </h1>

          <p className="text-gray-400 mb-8 text-sm">
            Create a secure meeting room instantly and invite others to join.
          </p>

          <Button
            onClick={handleCreateMeeting}
            loading={loading}
            className="
              w-full py-4 text-base font-bold
              bg-gradient-to-r from-cyan-500 to-blue-600
              hover:opacity-90 active:scale-[0.98] transition
            "
          >
            {loading ? "Creating meeting..." : "Create & Join Meeting"}
          </Button>

          <p className="text-xs text-gray-400 mt-4 text-center">
            You’ll be redirected automatically after the meeting is created.
          </p>
        </div>
      </div>
    </div>
  );
}
