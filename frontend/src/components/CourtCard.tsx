// src/components/CourtCard.tsx
"use client";

import type { Court } from "@/lib/api";
import Image from "next/image";

type Props = {
  court: Court;
  selected: boolean;
  onSelect: () => void;
};

export function CourtCard({ court, selected, onSelect }: Props) {
  const imgSrc =
    court.imageUrl || "/courts/court-a.jpg";

  return (
    <button
      onClick={onSelect}
      className={[
        "rounded-2xl overflow-hidden text-left bg-slate-950/60 border",
        selected ? "border-emerald-400" : "border-slate-700"
      ].join(" ")}
    >
      <div className="relative h-28 w-full">
        <Image src={imgSrc} alt={court.name} fill className="object-cover" />
      </div>
      <div className="p-3 space-y-1">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-sm">{court.name}</h3>
          <span className="text-xs text-emerald-300 font-semibold">
            Rp {court.pricePerHour.toLocaleString()}/jam
          </span>
        </div>
        <p className="text-[11px] text-slate-400">
          {court.surface || "Karpet"} • {court.hasAc ? "AC" : "Non-AC"}
        </p>
      </div>
    </button>
  );
}
