import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createMeeting, scheduleMeeting } from "../store/slices/meetingSlice";
import Button from "../components/common/Button";
import { Notify } from "../utils/notify";
import CalendarInput from "../components/Calendar/CalendarInput";
import TimeInput from "../components/TimeInput";
import InviteUsersInput from "../components/common/InviteUsersInput";

const initialFormData = {
  title: "",
  duration: 30,
  description: "",
};

export default function CreateMeeting() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.meeting);

  const [mode, setMode] = useState("INSTANT");
  const [selectedDate, setSelectedDate] = useState(null);
  const [invitedUserInputs, setInvitedUserInputs] = useState([]);
  const [formData, setFormData] = useState(initialFormData);

  /* ================================
     Instant Meeting
  ================================ */
  const handleInstantMeeting = async () => {
    try {
      const response = await dispatch(createMeeting()).unwrap();
      Notify("Meeting created successfully", "success");
      navigate(`/meeting/${response.meetingId}`);
    } catch (error) {
      Notify(error || "Unable to create meeting", "error");
    }
  };

  /* ================================
     Schedule Meeting
  ================================ */
  const handleScheduleMeeting = async () => {
    const invitedUsers = invitedUserInputs.map((value) => value.trim());

    if (!selectedDate) {
      return Notify("Please select date & time", "warning");
    }

    if (!formData.title.trim()) {
      return Notify("Meeting title is required", "warning");
    }

    if (formData.duration < 5) {
      return Notify("Minimum duration is 5 minutes", "warning");
    }

    if (invitedUsers.length === 0) {
      return Notify("At least one invited user is required", "warning");
    }

    const endTime = new Date(
      selectedDate.getTime() + formData.duration * 60000,
    );

    if (endTime <= new Date()) {
      return Notify("Meeting end time must be in the future", "warning");
    }

    try {
      await dispatch(
        scheduleMeeting({
          title: formData.title,
          description: formData.description,
          scheduledAt: selectedDate.toISOString(),
          duration: formData.duration,
          invitedUsers,
        }),
      ).unwrap();

      setFormData(initialFormData);
      setSelectedDate(null);
      setInvitedUserInputs([]);
      Notify("Meeting scheduled successfully", "success");
      navigate("/meeting-logs");
    } catch (error) {
      Notify(error || "Unable to schedule meeting", "error");
    }
  };

  console.log({invitedUserInputs})

  /* ================================
     Custom Date Input (Premium Look)
  ================================ */

  return (
    <div className="min-h-full flex items-center justify-center px-6 py-12 bg-[#020617] text-white">
      <div className="max-w-2xl w-full">
        <div className="relative rounded-3xl bg-white/5 backdrop-blur border border-white/10 p-8 shadow-2xl">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-blue-600/30 blur-2xl rounded-3xl -z-10"></div>

          <h1 className="text-3xl font-extrabold tracking-tight mb-6">
            Create Meeting
          </h1>

          {/* Toggle */}
          <div className="flex mb-8 bg-white/10 rounded-xl p-1">
            <button
              onClick={() => setMode("INSTANT")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                mode === "INSTANT"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                  : "text-gray-400"
              }`}
            >
              Instant
            </button>
            <button
              onClick={() => setMode("SCHEDULED")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                mode === "SCHEDULED"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                  : "text-gray-400"
              }`}
            >
              Schedule
            </button>
          </div>

          {/* =======================
              INSTANT MODE
          ======================= */}
          {mode === "INSTANT" && (
            <>
              <p className="text-gray-400 mb-6 text-sm">
                Start a meeting immediately and invite participants.
              </p>

              <Button
                onClick={handleInstantMeeting}
                loading={loading}
                className="w-full py-4 font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 transition"
              >
                {loading ? "Creating..." : "Create & Join Now"}
              </Button>
            </>
          )}

          {/* =======================
              SCHEDULE MODE
          ======================= */}
          {mode === "SCHEDULED" && (
            <div className="space-y-5">
              <input
                type="text"
                placeholder="Meeting Title"
                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Invite Participants
                </label>

                <InviteUsersInput
                  emails={invitedUserInputs}
                  setEmails={setInvitedUserInputs}
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">
                  Select Date & Time
                </label>

                <CalendarInput
                  value={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                />
              </div>

              {selectedDate && (
                <p className="text-xs text-cyan-400">
                  Starts {selectedDate.toLocaleString()}
                </p>
              )}

              <TimeInput
                value={selectedDate}
                onChange={(date) => setSelectedDate(date)}
              />

              <input
                type="number"
                min="5"
                placeholder="Duration (minutes)"
                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: Number(e.target.value),
                  })
                }
              />

              <textarea
                placeholder="Description (optional)"
                rows={3}
                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
              />

              <Button
                onClick={handleScheduleMeeting}
                loading={loading}
                className="w-full py-4 font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 transition"
              >
                {loading ? "Scheduling..." : "Schedule Meeting"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
