import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";

export default function MeetingDateTimeInput({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(value || null);
  const [time, setTime] = useState("12:00");

  const ref = useRef();

  // Close when clicked outside
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDaySelect = (day) => {
    if (!day) return;
    setSelectedDay(day);
    updateDate(day, time);
  };

  const handleTimeChange = (e) => {
    const t = e.target.value;
    setTime(t);
    if (selectedDay) updateDate(selectedDay, t);
  };

  const updateDate = (day, t) => {
    const [h, m] = t.split(":");
    const newDate = new Date(day);
    newDate.setHours(h);
    newDate.setMinutes(m);
    onChange(newDate);
  };

  return (
    <div className="relative" ref={ref}>
      {/* Input Field */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left bg-white/10 border border-white/10 rounded-xl px-4 py-3 hover:border-cyan-500 transition focus:outline-none focus:ring-2 focus:ring-cyan-500"
      >
        {value
          ? format(value, "MMMM d, yyyy h:mm aa")
          : "Choose date & time"}
      </button>

      {/* Popover */}
      {open && (
        <div className="absolute mt-3 z-50 bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl flex gap-6">
          
          {/* Calendar */}
          <DayPicker
            mode="single"
            selected={selectedDay}
            onSelect={handleDaySelect}
            fromDate={new Date()}
            className="text-white"
          />

          {/* Time */}
          <div className="flex flex-col gap-3">
            <p className="text-sm text-slate-400">Time</p>
            <input
              type="time"
              value={time}
              onChange={handleTimeChange}
              className="bg-slate-800 border border-white/10 rounded-xl px-4 py-2 text-white"
            />
          </div>
        </div>
      )}
    </div>
  );
}
