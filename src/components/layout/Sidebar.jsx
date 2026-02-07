import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const navItem = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition
     ${
       location.pathname === path
         ? "bg-cyan-500/15 text-cyan-300"
         : "text-gray-300 hover:bg-white/10 hover:text-white"
     }`;

  return (
    <aside className="hidden md:flex w-64 flex-col bg-white/5 backdrop-blur-xl border-r border-white/10">
      {/* Logo / Title */}
      <div className="px-6 py-5 border-b border-white/10">
        <h2 className="text-xl font-extrabold tracking-tight text-white">
          Meet<span className="text-cyan-400">Pro</span>
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <Link to="/" className={navItem("/")}>
          Dashboard
        </Link>

        <Link to="/create-meeting" className={navItem("/create-meeting")}>
          Create Meeting
        </Link>

        <Link to="/join-meeting" className={navItem("/join-meeting")}>
          Join Meeting
        </Link>

        <Link to="/meeting-logs" className={navItem("/meeting-logs")}>
          Meeting Logs
        </Link>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 text-xs text-gray-400 border-t border-white/10">
        © {new Date().getFullYear()} MeetPro
      </div>
    </aside>
  );
}
