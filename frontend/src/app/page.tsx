// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Clock, MapPin, Ticket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Stepper } from "@/components/Stepper";
import { TimeSlotGrid } from "@/components/TimeSlotGrid";
import { CourtCard } from "@/components/CourtCard";
import { SummaryCard } from "@/components/SummaryCard";
import {
  fetchAvailability,
  fetchCourts,
  createBooking,
  type Slot,
  type Court,
  type BookingResult
} from "@/lib/api";

const steps = ["Date", "Time", "Court", "Summary"];

export default function Home() {
  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [courts, setCourts] = useState<Court[]>([]);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<BookingResult | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  const dateStr = selectedDate
    ? selectedDate.toISOString().slice(0, 10)
    : "";

  // load availability ketika date berubah
  useEffect(() => {
    if (!dateStr) return;
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchAvailability(dateStr);
        setSlots(data);
        setSelectedTime("");
        setSelectedCourt(null);
        setError("");
      } catch (e: any) {
        setError(e.message || "Failed to load availability");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [dateStr]);

  const handleSelectSlot = async (time: string) => {
    setSelectedTime(time);
    try {
      setLoading(true);
      const data = await fetchCourts(dateStr, time);
      setCourts(data);
      setSelectedCourt(null);
      setError("");
      setStep(2);
    } catch (e: any) {
      setError(e.message || "Failed to load courts");
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    if (!dateStr || !selectedTime || !selectedCourt || !name) return;
    setProcessingPayment(true);
    setResult(null);
    setError("");

    try {
      // simulasi payment delay
      await new Promise((r) => setTimeout(r, 1500));
      const data = await createBooking({
        date: dateStr,
        time: selectedTime,
        courtId: selectedCourt.id,
        userName: name
      });
      setResult(data);
    } catch (e: any) {
      setError(e.message || "Failed to create booking");
    } finally {
      setProcessingPayment(false);
    }
  };

  const paymentStatus =
    processingPayment ? "Processing..." : result?.status === "PAID" ? "Paid" : "";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl space-y-6">
        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/80 to-slate-900/90" />
          <img
            src="https://images.pexels.com/photos/5739189/pexels-photo-5739189.jpeg"
            alt="badminton"
            className="w-full h-56 object-cover opacity-40"
          />
          <div className="absolute inset-0 p-8 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold">DIRO Badminton</h1>
                <p className="text-sm text-slate-200 mt-1">
                  Book your court in a few taps. Sporty, clean, and mobile-first.
                </p>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 bg-black/40 rounded-full px-4 py-2 text-xs">
                <Ticket className="w-4 h-4" />
                <span>
                  Step {step + 1} of {steps.length}: {steps[step]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid md:grid-cols-[3fr,2fr] gap-6">
          {/* Wizard */}
          <div className="bg-slate-900/60 rounded-3xl p-5 md:p-6 space-y-4">
            <Stepper steps={steps} activeIndex={step} />

            {error && (
              <div className="text-sm text-red-300 bg-red-900/40 border border-red-700/60 rounded-xl px-3 py-2">
                {error}
              </div>
            )}

            {loading && (
              <p className="text-xs text-slate-400">Loading...</p>
            )}

            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="date"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  <h2 className="text-lg font-semibold">Pilih Tanggal</h2>
                  <p className="text-xs text-slate-400">
                    Tanggal menentukan jam & lapangan yang tersedia.
                  </p>
                  <div className="bg-slate-950/60 rounded-2xl p-3">
                    <DayPicker
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={{ before: new Date() }}
                    />
                  </div>
                  <button
                    disabled={!selectedDate}
                    onClick={() => setStep(1)}
                    className="mt-2 w-full bg-emerald-500 hover:bg-emerald-600 text-sm font-semibold py-2 rounded-xl disabled:bg-slate-600"
                  >
                    Next: Choose Time
                  </button>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="time"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Clock className="w-5 h-5 text-emerald-400" />
                      Pilih Jam Main
                    </h2>
                    <button
                      onClick={() => setStep(0)}
                      className="text-xs text-slate-400"
                    >
                      &larr; Ganti tanggal
                    </button>
                  </div>
                  <TimeSlotGrid
                    slots={slots}
                    selectedTime={selectedTime}
                    onSelect={handleSelectSlot}
                  />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="court"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-emerald-400" />
                      Pilih Lapangan
                    </h2>
                    <button
                      onClick={() => setStep(1)}
                      className="text-xs text-slate-400"
                    >
                      &larr; Ganti jam
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {courts.map((c) => (
                      <CourtCard
                        key={c.id}
                        court={c}
                        selected={selectedCourt?.id === c.id}
                        onSelect={() => {
                          setSelectedCourt(c);
                          setStep(3);
                        }}
                      />
                    ))}
                    {!courts.length && !loading && (
                      <p className="text-xs text-slate-400">
                        Tidak ada lapangan tersedia pada jam ini.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-emerald-400" />
                    Ringkasan & Pembayaran
                  </h2>
                  <div className="bg-slate-950/70 rounded-2xl p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tanggal</span>
                      <span>{dateStr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Jam</span>
                      <span>{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Lapangan</span>
                      <span>{selectedCourt?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Harga</span>
                      <span className="font-semibold text-emerald-300">
                        Rp{" "}
                        {selectedCourt?.pricePerHour.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-400">Nama Kamu</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="Tulis nama lengkap"
                    />
                  </div>

                  <button
                    onClick={handlePay}
                    disabled={!name || processingPayment}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-sm font-semibold disabled:bg-slate-600"
                  >
                    {processingPayment ? "Processing payment..." : "Book & Pay Now"}
                  </button>

                  {result && (
                    <div className="mt-2 text-xs bg-emerald-900/40 border border-emerald-600 rounded-xl px-3 py-2">
                      <p>Booking sukses!</p>
                      <p>ID Booking: {result.id}</p>
                      <p>Ref Pembayaran: {result.paymentRef}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <SummaryCard
            stepLabel={steps[step]}
            dateStr={dateStr}
            time={selectedTime}
            court={selectedCourt}
            name={name}
            paymentStatus={paymentStatus}
          />
        </div>
      </div>
    </div>
  );
}
