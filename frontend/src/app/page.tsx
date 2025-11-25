"use client";

import { useEffect, useState } from "react";

type Timeslot = { id: string; from: string; to: string };
type Court = { id: string; name: string };

export default function Home() {
  const [dates, setDates] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<Timeslot[]>([]);
  const [slotId, setSlotId] = useState("");
  const [courts, setCourts] = useState<Court[]>([]);
  const [courtId, setCourtId] = useState("");
  const [name, setName] = useState("");
  const [result, setResult] = useState<any>(null);

  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    fetch(`${API}/api/dates`)
      .then((r) => r.json())
      .then(setDates);
  }, [API]);

  const onSelectDate = async (d: string) => {
    setDate(d);
    const res = await fetch(`${API}/api/timeslots?date=${d}`);
    setSlots(await res.json());
    setSlotId("");
    setCourts([]);
    setCourtId("");
  };

  const onSelectSlot = async (id: string) => {
    setSlotId(id);
    const res = await fetch(`${API}/api/courts?date=${date}&timeslot=${id}`);
    setCourts(await res.json());
    setCourtId("");
  };

  const onSubmit = async () => {
    const res = await fetch(`${API}/api/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, timeslotId: slotId, courtId, name }),
    });
    setResult(await res.json());
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-xl space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Badminton Reservation
        </h1>

        {/* Step 1: pilih tanggal */}
        <div>
          <label className="font-medium">1. Pilih Tanggal</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {dates.map((d) => (
              <button
                key={d}
                onClick={() => onSelectDate(d)}
                className={`px-3 py-1 rounded-full border ${
                  date === d ? "bg-blue-600 text-white" : "bg-white"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: pilih timeslot */}
        <div>
          <label className="font-medium">2. Pilih Timeslot</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {slots.map((s) => (
              <button
                key={s.id}
                onClick={() => onSelectSlot(s.id)}
                className={`px-3 py-1 rounded-full border ${
                  slotId === s.id ? "bg-green-600 text-white" : "bg-white"
                }`}
              >
                {s.from} - {s.to}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: pilih court */}
        <div>
          <label className="font-medium">3. Pilih Court</label>
          <select
            className="border rounded-lg w-full mt-2 px-3 py-2"
            value={courtId}
            onChange={(e) => setCourtId(e.target.value)}
          >
            <option value="">Pilih court...</option>
            {courts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Nama user */}
        <div>
          <label className="font-medium">Nama Pemesan</label>
          <input
            className="border rounded-lg w-full mt-2 px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tuliskan namamu..."
          />
        </div>

        <button
          onClick={onSubmit}
          disabled={!date || !slotId || !courtId || !name}
          className="w-full py-2 rounded-xl bg-indigo-600 text-white font-semibold disabled:bg-gray-400"
        >
          Konfirmasi & Bayar (dummy)
        </button>

        {result && (
          <div className="mt-4 border rounded-xl p-4 bg-slate-50">
            <p className="font-semibold">Reservation ID: {result.id}</p>
            <p>Status: {result.status}</p>
            <p>Paid: {result.paid ? "Yes" : "No"}</p>
          </div>
        )}
      </div>
    </main>
  );
}
