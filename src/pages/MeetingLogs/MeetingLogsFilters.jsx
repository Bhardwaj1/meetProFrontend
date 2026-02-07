import React from "react";

const MeetingLogsFilters = () => {
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          placeholder="Search Meeting ID / Host"
          className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
        />

        <input
          type="date"
          className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm"
        />

        <input
          type="date"
          className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm"
        />

        <select className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm">
          <option>All Status</option>
          <option>Completed</option>
          <option>Ongoing</option>
        </select>
      </div>
    </div>
  );
};

export default MeetingLogsFilters;
