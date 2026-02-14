import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MeetingLogsHeader from "./MeetingLogsHeader";
import MeetingLogsFilters from "./MeetingLogsFilters";
import MeetingLogsTable from "./MeetingLogsTable";
import { getMeetingHistory } from "../../store/slices/meetingHistorySlice";
import { useAuth } from "../../context/AuthContext";
import { exportMeetingHistory } from "../../services/meetingHistoryService";

const MeetingLogs = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { loading, meetingHistory, meta } = useSelector(
    (state) => state.meetingHistory,
  );

  console.log({ user });

  // ✅ Server is source of truth
  const page = Number(meta?.page) || 1;
  const pageSize = Number(meta?.limit) || 25;

  const [filters, setFilters] = useState({
    search: "",
    fromDate: "",
    toDate: "",
    status: "",
  });

  const [debouncedSearch, setDebouncedSearch] = useState("");

  // 🔎 Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // 🧠 Build query params
  const queryParams = useMemo(() => {
    const params = {
      page,
      limit: pageSize,
    };

    if (debouncedSearch) params.search = debouncedSearch;
    if (filters.fromDate) params.fromDate = filters.fromDate;
    if (filters.toDate) params.toDate = filters.toDate;
    if (filters.status) params.status = filters.status;

    return params;
  }, [
    page,
    pageSize,
    debouncedSearch,
    filters.fromDate,
    filters.toDate,
    filters.status,
  ]);

  // 🚀 Fetch when query changes
  useEffect(() => {
    dispatch(getMeetingHistory(queryParams));
  }, [dispatch, queryParams]);

  // ✅ Page change → directly call API
  const handlePageChange = (nextPage) => {
    dispatch(
      getMeetingHistory({
        ...queryParams,
        page: nextPage,
      }),
    );
  };

  // ✅ Page size change → reset page to 1
  const handlePageSizeChange = (nextPageSize) => {
    dispatch(
      getMeetingHistory({
        ...queryParams,
        page: 1,
        limit: nextPageSize,
      }),
    );
  };

  const handleFiltersChange = (nextFilters) => {
    setFilters(nextFilters);

    dispatch(
      getMeetingHistory({
        page: 1,
        limit: pageSize,
        ...nextFilters,
      }),
    );
  };

  const handleExport = async () => {
    try {
      const blob = await exportMeetingHistory({
        search: debouncedSearch,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        status: filters.status,
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "meeting-history.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 text-white max-w-full overflow-x-hidden">
      <MeetingLogsHeader onExport={handleExport} />
      <MeetingLogsFilters values={filters} onChange={handleFiltersChange} />
      <MeetingLogsTable
        loading={loading}
        meetingHistory={meetingHistory}
        meta={meta}
        page={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default MeetingLogs;
