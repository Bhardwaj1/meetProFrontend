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
      <table className="w-full text-sm">
        <thead className="bg-white/5 text-white/70">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`p-4 ${
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
                  className={`p-4 ${
                    col.align === "center" ? "text-center" : "text-left"
                  }`}
                >
                  {col.render
                    ? col.render(row[col.key], row)
                    : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination footer */}
      {pagination && <Pagination {...pagination} />}
    </div>
  );
};

export default Table;
