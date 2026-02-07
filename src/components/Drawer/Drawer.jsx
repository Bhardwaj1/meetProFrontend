import { useEffect } from "react";

const Drawer = ({ open, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (open) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full w-full sm:w-[420px] z-50
        backdrop-blur-xl bg-[#0B1220]/90 border-l border-white/10
        transform transition-transform duration-300"
      >
        {children}
      </div>
    </>
  );
};

export default Drawer;
