import React from "react";

const MeetingLogsFilters = ({ values, onChange }) => {
  const handleFieldChange = (field) => (event) => {
    onChange({
      ...values,
      [field]: event.target.value,
    });
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          placeholder="Search Meeting ID / Host"
          value={values.search}
          onChange={handleFieldChange("search")}
          className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
        />

        <input
          type="date"
          value={values.fromDate}
          onChange={handleFieldChange("fromDate")}
          className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm"
        />

        <input
          type="date"
          value={values.toDate}
          onChange={handleFieldChange("toDate")}
          className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm"
        />

        <select
          value={values.status}
          onChange={handleFieldChange("status")}
          className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Status</option>
          <option value="Completed">Completed</option>
          <option value="Ongoing">Ongoing</option>
        </select>
      </div>
    </div>
  );
};

export default MeetingLogsFilters;
