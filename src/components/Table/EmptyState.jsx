const EmptyState = ({
  title = "No data found",
  description = "There is nothing to show here yet.",
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center text-white">
      {/* Illustration placeholder */}
      <div className="mb-6 text-5xl opacity-60">📭</div>

      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-white/60 mt-1 max-w-sm">
        {description}
      </p>

      {actionLabel && (
        <button
          onClick={onAction}
          className="mt-6 px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-sm font-medium hover:opacity-90 transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
