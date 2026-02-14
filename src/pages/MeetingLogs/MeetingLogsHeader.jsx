import React from "react";

const MeetingLogsHeader = ({ onExport }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Meeting Logs</h1>
        <p className="text-sm text-white/60">
          View and manage all your meetings
        </p>
      </div>

      <button
        className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-sm font-medium hover:opacity-90 transition"
        onClick={onExport}
      >
        Export Excel
      </button>
    </div>
  );
};

export default MeetingLogsHeader;
