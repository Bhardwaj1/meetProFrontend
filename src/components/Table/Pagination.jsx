import React from "react";
const Pagination = ({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 py-3 border-t border-white/10">
      {/* Page size */}
      <div className="flex items-center gap-2 text-sm text-white/70">
        <span>Rows per page:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="bg-black/30 border border-white/10 rounded-md px-2 py-1 text-sm"
        >
          {[25, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Page controls */}
      <div className="flex items-center gap-2 text-sm">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-1 rounded-md border border-white/10 disabled:opacity-40"
        >
          Prev
        </button>

        <span className="text-white/70">
          Page <strong>{page}</strong> of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-1 rounded-md border border-white/10 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
