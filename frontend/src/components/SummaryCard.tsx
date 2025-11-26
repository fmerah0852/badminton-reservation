// src/components/SummaryCard.tsx
"use client";

import type { Court } from "@/lib/api";

type Props = {
  stepLabel: string;
  dateStr: string;
  time: string;
  court: Court | null;
  name: string;
  paymentStatus: string;
};

export function SummaryCard({
  stepLabel,
  dateStr,
  time,
  court,
  name,
  paymentStatus
}: Props) {
  return (
    <div className="bg-slate-900/60 rounded-3xl p-5 space-y-3">
      <h3 className="text-sm font-semibold">Live Summary</h3>
      <div className="text-xs space-y-2">
        <div className="flex justify-between">
          <span className="text-slate-400">Step</span>
          <span>{stepLabel}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Tanggal</span>
          <span>{dateStr || "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Jam</span>
          <span>{time || "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Lapangan</span>
          <span>{court?.name || "-"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Nama</span>
          <span>{name || "-"}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-slate-800">
          <span className="text-slate-400">Status Pembayaran</span>
          <span className="font-semibold text-emerald-300">
            {paymentStatus || "-"}
          </span>
        </div>
      </div>
      <p className="mt-3 text-[11px] text-slate-500">
        Flow: Date → Timeslot → Court → Summary & Payment. UI sporty, hijau-putih,
        mobile-first, seperti requirement technical test.
      </p>
    </div>
  );
}
