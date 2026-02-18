import { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  format,
  startOfDay,
  isBefore,
} from "date-fns";

export default function Calendar({ selectedDate, onSelect }) {
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate || new Date()
  );

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const rows = [];
  let day = startDate;

  const today = startOfDay(new Date());

  while (day <= endDate) {
    const days = [];

    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      const currentDay = startOfDay(cloneDay);

      const isPast = isBefore(currentDay, today);
      const isSelected =
        selectedDate && isSameDay(cloneDay, selectedDate);

      days.push(
        <div
          key={cloneDay.toString()}
          onClick={() => {
            if (!isPast) onSelect(cloneDay);
          }}
          className={`
            w-10 h-10 flex items-center justify-center rounded-xl
            transition

            ${!isSameMonth(cloneDay, monthStart) ? "text-gray-500" : ""}

            ${
              isPast
                ? "text-gray-600 opacity-40 cursor-not-allowed"
                : "cursor-pointer"
            }

            ${
              isSelected
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                : !isPast && "hover:bg-white/10"
            }
          `}
        >
          {format(cloneDay, "d")}
        </div>
      );

      day = addDays(day, 1);
    }

    rows.push(
      <div key={day.toString()} className="flex gap-2 justify-between">
        {days}
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl w-[320px] animate-join">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="text-gray-400 hover:text-white transition"
        >
          ←
        </button>

        <h2 className="text-white font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>

        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="text-gray-400 hover:text-white transition"
        >
          →
        </button>
      </div>

      {/* Week Days */}
      <div className="flex justify-between text-xs text-gray-400 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((dayName) => (
          <div key={dayName} className="w-10 text-center">
            {dayName}
          </div>
        ))}
      </div>

      {/* Dates Grid */}
      <div className="flex flex-col gap-2">{rows}</div>
    </div>
  );
}
