import { useState, useRef, useEffect } from "react";
import Calendar from "./Calendar";
import { format } from "date-fns";

export default function CalendarInput({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const selectedDate = value || new Date();

  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Input */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left bg-white/10 border border-white/10 rounded-xl px-4 py-3 hover:border-cyan-500 transition focus:outline-none focus:ring-2 focus:ring-cyan-500"
      >
        {format(selectedDate, "MMMM d, yyyy")}
      </button>

      {open && (
        <div className="absolute mt-3 z-50">
          <Calendar
            selectedDate={selectedDate}
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
