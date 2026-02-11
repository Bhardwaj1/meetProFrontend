import Table from "../../components/Table/Table";

import React, { useMemo, useState } from "react";
import MeetingDetailsDrawer from "./MeetingDetailsDrawer";
import StatusPill from "../../components/StatusPill";

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

const formatDuration = (start, end) => {
  if (!start || !end) return "-";
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return "-";
  }

  const diffMs = Math.max(0, endDate.getTime() - startDate.getTime());
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
};

const MeetingLogsTable = ({
  loading,
  meetingHistory,
  meta,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const logs = useMemo(
    () =>
      (meetingHistory || []).map((item) => ({
        ...item,
        id: item.meetingId,
        host: item.user?.name || "-",
        start: formatDateTime(item.joinedAt),
        end: formatDateTime(item.leftAt),
        duration: formatDuration(item.joinedAt, item.leftAt),
        users: 1,
        role: item.role || "-",
        status: item.leftAt ? "Completed" : "Ongoing",
      })),
    [meetingHistory]
  );

  const total = Number(meta?.total || 0);
  const pageSizeOptions = useMemo(() => {
    const currentLimit = Number(meta?.limit || pageSize || 20);
    const defaults = [10, 20, 50, 100];
    return [...new Set([currentLimit, ...defaults])].sort((a, b) => a - b);
  }, [meta?.limit, pageSize]);

  const handleRowClick = (meeting) => {
    setSelectedMeeting(meeting);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const columns = [
    { key: "id", label: "Meeting ID" },
    { key: "host", label: "User" },
    { key: "role", label: "Role", align: "center" },
    { key: "start", label: "Start", align: "center" },
    { key: "end", label: "End", align: "center" },
    { key: "duration", label: "Duration", align: "center" },
    { key: "users", label: "Users", align: "center" },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (v) => <StatusPill status={v} />,
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        data={logs}
        loading={loading}
        emptyStateProps={{
          title: "No meetings yet",
          description: "You haven’t created or joined any meetings yet.",
        }}
        pagination={{
          page,
          pageSize,
          total,
          pageSizeOptions,
          onPageChange,
          onPageSizeChange,
        }}
        onRowClick={handleRowClick}
      />
      <MeetingDetailsDrawer
        open={drawerOpen}
        meeting={selectedMeeting}
        onClose={closeDrawer}
      />
    </>
  );
};

export default MeetingLogsTable;
