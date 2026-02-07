import React from "react";
const SkeletonRow = () => (
  <tr className="border-t border-white/10">
    {Array.from({ length: 7 }).map((_, i) => (
      <td key={i} className="p-4">
        <div className="h-4 w-full rounded bg-white/10 animate-pulse" />
      </td>
    ))}
  </tr>
);

const LogsTableSkeleton = () => {
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-white/5">
          <tr>
            {[
              "Meeting ID",
              "Host",
              "Start",
              "End",
              "Duration",
              "Users",
              "Status",
            ].map((h) => (
              <th key={h} className="p-4 text-left text-sm text-white/60">
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogsTableSkeleton;
