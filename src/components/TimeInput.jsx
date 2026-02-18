import { useState, useRef, useEffect, useMemo } from "react";

/* Generate 24h time slots */
function generateTimes(interval = 15) {
  const times = [];

  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += interval) {
      const h = hour % 12 === 0 ? 12 : hour % 12;
      const ampm = hour < 12 ? "AM" : "PM";
      const minute = min.toString().padStart(2, "0");

      times.push({
        label: `${h}:${minute} ${ampm}`,
        hour,
        minute: min,
      });
    }
  }

  return times;
}

/* Round UP to nearest interval */
function roundToNearestInterval(date, interval = 15) {
  const ms = 1000 * 60 * interval;
  return new Date(Math.ceil(date.getTime() / ms) * ms);
}

export default function TimeInput({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  /* Stable time list */
  const times = useMemo(() => generateTimes(15), []);

  /* Rotated list starts from rounded current time */
  const rotatedTimes = useMemo(() => {
    const now = new Date();
    const rounded = roundToNearestInterval(now, 15);

    const startIndex = times.findIndex(
      (t) =>
        t.hour === rounded.getHours() &&
        t.minute === rounded.getMinutes()
    );

    if (startIndex === -1) return times;

    return [
      ...times.slice(startIndex),
      ...times.slice(0, startIndex),
    ];
  }, [times]);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const now = new Date();

  const isToday =
    value && value.toDateString() === now.toDateString();

  const formatDisplay = () => {
    if (!value) return "Select time";

    const hour = value.getHours();
    const minute = value.getMinutes();

    const h = hour % 12 === 0 ? 12 : hour % 12;
    const ampm = hour < 12 ? "AM" : "PM";

    return `${h}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };

  const handleSelect = (hour, minute, disabled) => {
    if (disabled) return;

    const newDate = new Date(value || new Date());
    newDate.setHours(hour);
    newDate.setMinutes(minute);
    onChange(newDate);
    setOpen(false);
  };

  const handleNowClick = () => {
    const rounded = roundToNearestInterval(new Date(), 15);
    onChange(rounded);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      {/* Input */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left bg-white/10 border border-white/10 rounded-xl px-4 py-3 hover:border-cyan-500 transition focus:outline-none focus:ring-2 focus:ring-cyan-500"
      >
        {formatDisplay()}
      </button>

      {open && (
        <div
          className="
            absolute mt-3 w-full
            bg-slate-900 border border-white/10 rounded-2xl shadow-2xl
            z-50 animate-dropdown
          "
        >
          {/* NOW OPTION */}
          <div
            onClick={handleNowClick}
            className="
              px-4 py-3 border-b border-white/10
              bg-slate-800 text-cyan-400 font-medium
              cursor-pointer hover:bg-slate-700 transition
            "
          >
            Now ({roundToNearestInterval(new Date(), 15)
              .toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })})
          </div>

          {/* TIME LIST */}
          <div className="max-h-60 overflow-y-auto">
            {rotatedTimes.map((t, i) => {
              const disabled =
                isToday &&
                (t.hour < now.getHours() ||
                  (t.hour === now.getHours() &&
                    t.minute < now.getMinutes()));

              const isSelected =
                value &&
                value.getHours() === t.hour &&
                value.getMinutes() === t.minute;

              return (
                <div
                  key={i}
                  onClick={() =>
                    handleSelect(t.hour, t.minute, disabled)
                  }
                  className={`
                    px-4 py-2 transition
                    ${
                      disabled
                        ? "text-gray-600 cursor-not-allowed"
                        : "cursor-pointer"
                    }
                    ${
                      isSelected
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                        : !disabled &&
                          "text-gray-300 hover:bg-white/10"
                    }
                  `}
                >
                  {t.label}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
