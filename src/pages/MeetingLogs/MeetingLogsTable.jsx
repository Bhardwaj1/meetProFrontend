

import Table from "../../components/Table/Table";

import React ,{ useEffect, useState } from "react";
import MeetingDetailsDrawer from "./MeetingDetailsDrawer";
import StatusPill from "../../components/StatusPill";

const MeetingLogsTable = () => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [total, setTotal] = useState(0);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLogs([
        {
          id: "MTG-101",
          host: "Gaurav",
          start: "10:00 AM",
          end: "10:45 AM",
          duration: "45 mins",
          users: 6,
          status: "Completed",
        },
      ]);
      setTotal(120);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [page, pageSize]);

  const onPageChange = (newPage) => {
    setLoading(true);
    setPage(newPage);
  };

  const onPageSizeChange = (size) => {
    setLoading(true);
    setPage(1);
    setPageSize(size);
  };

  const handleRowClick = (meeting) => {
    setSelectedMeeting(meeting);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const columns = [
    { key: "id", label: "Meeting ID" },
    { key: "host", label: "Host" },
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
