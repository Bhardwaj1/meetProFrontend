const DrawerHeader = ({ title, onClose }) => {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
      <h2 className="text-lg font-semibold text-white">{title}</h2>

      <button
        onClick={onClose}
        className="text-white/60 hover:text-white text-xl"
      >
        ×
      </button>
    </div>
  );
};

export default DrawerHeader;
