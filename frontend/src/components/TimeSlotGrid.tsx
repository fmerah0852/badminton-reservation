// src/components/TimeSlotGrid.tsx
"use client";

import type { Slot } from "@/lib/api";

type Props = {
  slots: Slot[];
  selectedTime: string;
  onSelect: (time: string) => void;
};

export function TimeSlotGrid({ slots, selectedTime, onSelect }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3 mt-2">
      {slots.map((s) => {
        const isDisabled = s.status !== "AVAILABLE";
        const isSelected = selectedTime === s.time;

        const baseColor =
          s.status === "AVAILABLE"
            ? "bg-emerald-600 hover:bg-emerald-500"
            : s.status === "FULL"
            ? "bg-slate-700"
            : s.status === "PAST"
            ? "bg-slate-800"
            : "bg-red-700";

        return (
          <button
            key={s.time}
            disabled={isDisabled}
            onClick={() => onSelect(s.time)}
            className={[
              "text-sm font-medium rounded-xl px-3 py-2 flex flex-col items-center justify-center",
              baseColor,
              isSelected ? "ring-2 ring-yellow-300" : "",
              isDisabled ? "opacity-40" : ""
            ].join(" ")}
          >
            <span>{s.time}</span>
            <span className="text-[10px] opacity-80">{s.status}</span>
          </button>
        );
      })}
    </div>
  );
}
