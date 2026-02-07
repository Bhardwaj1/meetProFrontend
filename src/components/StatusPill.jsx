const StatusPill = ({ status }) => {
  const styles =
    status === "Completed"
      ? "bg-green-500/20 text-green-400"
      : "bg-yellow-500/20 text-yellow-400";

  return (
    <span className={`px-3 py-1 rounded-full text-xs ${styles}`}>
      {status}
    </span>
  );
};

export default StatusPill;
