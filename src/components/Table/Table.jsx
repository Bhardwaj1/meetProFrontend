import React from "react";
import TableSkeleton from "./TableSkeleton";
import EmptyState from "./EmptyState";
import Pagination from "./Pagination";

const Table = ({
  columns = [],
  data = [],
  loading = false,
  onRowClick,
  emptyStateProps,
  pagination,
}) => {
  if (loading) {
    return <TableSkeleton columns={columns} />;
  }

  if (!data.length) {
    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl">
        <EmptyState {...emptyStateProps} />
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-[800px] w-full text-sm">
          <thead className="bg-white/5 text-white/70">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`p-4 whitespace-nowrap ${
                    col.align === "center" ? "text-center" : "text-left"
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(row)}
                className={`border-t border-white/10 hover:bg-white/5 transition ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`p-4 whitespace-nowrap ${
                      col.align === "center" ? "text-center" : "text-left"
                    }`}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden divide-y divide-white/10">
        {data.map((row, index) => (
          <div
            key={index}
            onClick={() => onRowClick?.(row)}
            className={`p-4 space-y-3 hover:bg-white/5 transition ${
              onRowClick ? "cursor-pointer" : ""
            }`}
          >
            {columns.map((col) => (
              <div key={col.key} className="flex justify-between gap-4">
                <span className="text-white/50 text-xs">{col.label}</span>

                <span className="text-sm text-right">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ================= PAGINATION ================= */}
      {pagination && <Pagination {...pagination} />}
    </div>
  );
};

export default Table;
