import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full px-6 py-8 bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617] text-white">
      {/* HERO */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Welcome back <span className="inline-block animate-pulse">👋</span>
        </h1>
        <p className="text-gray-400 mt-2 text-base">
          Start or join a meeting instantly with MeetPro
        </p>
      </div>

      {/* ACTION CARDS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* PRIMARY – CREATE */}
        <div className="relative rounded-3xl p-7 bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_20px_60px_-15px_rgba(56,189,248,0.6)] hover:scale-[1.03] transition">
          <h2 className="text-xl font-semibold mb-2">🎥 New Meeting</h2>
          <p className="text-white/80 mb-8 text-sm">
            Start an instant meeting and invite participants
          </p>

          <Button
            className="w-full py-4 text-base font-bold bg-white text-blue-600 hover:bg-gray-100"
            onClick={() => navigate("/create-meeting")}
          >
            Create Meeting
          </Button>
        </div>

        {/* JOIN */}
        <div className="rounded-3xl p-7 bg-white/5 backdrop-blur border border-white/10 shadow-lg hover:border-cyan-400/40 transition">
          <h2 className="text-xl font-semibold mb-2">🔗 Join Meeting</h2>
          <p className="text-gray-400 mb-8 text-sm">
            Join using a meeting ID shared with you
          </p>

          <Button
            className="w-full py-4 text-base font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90"
            onClick={() => navigate("/join-meeting")}
          >
            Join Meeting
          </Button>
        </div>

        {/* HISTORY */}
        <div className="rounded-3xl p-7 bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold mb-2">📁 Meeting History</h2>
          <p className="text-gray-400 mb-8 text-sm">
            View your past meetings (coming soon)
          </p>

          <Button
            className="w-full py-4 text-base font-semibold bg-white/10 hover:bg-white/15 transition"
            onClick={() => navigate("/meeting-logs")}
          >
            View History
          </Button>
        </div>
      </div>

      {/* QUICK TIPS */}
      <div className="max-w-7xl mx-auto mt-14">
        <div className="rounded-3xl bg-white/5 backdrop-blur border border-white/10 p-6">
          <h3 className="text-lg font-semibold mb-4">💡 Quick Tips</h3>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>• Allow camera & microphone permissions</li>
            <li>• Use headphones for better audio quality</li>
            <li>• Share meeting link to invite others</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
