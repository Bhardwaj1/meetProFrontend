import React from "react";
import MeetingLogsHeader from "./MeetingLogsHeader";
import MeetingLogsFilters from "./MeetingLogsFilters";
import MeetingLogsTable from "./MeetingLogsTable";

const MeetingLogs = () => {
  return (
    <div className="p-6 space-y-6 text-white">
      <MeetingLogsHeader />
      <MeetingLogsFilters />
      <MeetingLogsTable />
    </div>
  );
};

export default MeetingLogs;
