const TableSkeleton = ({ columns, rows = 5 }) => {
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-white/5">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="p-4 text-left text-sm text-white/60">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-t border-white/10">
              {columns.map((col) => (
                <td key={col.key} className="p-4">
                  <div className="h-4 w-full rounded bg-white/10 animate-pulse" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
