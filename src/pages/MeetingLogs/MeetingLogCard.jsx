import React from "react";

const MeetingLogCard = ({ log }) => {
  return (
    <div className="border-b p-4 flex flex-col gap-2">
      <div className="flex justify-between">
        <span className="font-medium">{log.id}</span>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            log.status === "Completed"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {log.status}
        </span>
      </div>

      <div className="text-sm text-gray-600">Host: {log.host}</div>

      <div className="grid grid-cols-2 text-sm">
        <span>Start: {log.start}</span>
        <span>End: {log.end}</span>
        <span>Duration: {log.duration}</span>
        <span>Users: {log.participants}</span>
      </div>
    </div>
  );
};

export default MeetingLogCard;
