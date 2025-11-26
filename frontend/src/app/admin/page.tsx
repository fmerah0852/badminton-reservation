"use client";

import { useEffect, useState } from "react";
import { listCourts, saveCourt, deleteCourt, listBookings, type AdminBooking } from "@/lib/adminApi";
import type { Court } from "@/lib/api";

export default function AdminDashboard() {
  const [tab, setTab] = useState<"courts" | "bookings">("courts");
  const [courts, setCourts] = useState<Court[]>([]);
  const [editing, setEditing] = useState<Partial<Court> | null>(null);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCourts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listCourts();
      setCourts(data);
    } catch (e: any) {
      setError(e.message || "Failed to load courts");
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listBookings();
      setBookings(data ?? []);
    } catch (e: any) {
      setError(e.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "courts") loadCourts();
    else loadBookings();
  }, [tab]);

  const handleSave = async () => {
    if (!editing) return;
    setLoading(true);
    try {
      const updated = await saveCourt(editing);
      setEditing(null);
      await loadCourts();
    } catch (e: any) {
      setError(e.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this court?")) return;
    setLoading(true);
    try {
      await deleteCourt(id);
      await loadCourts();
    } catch (e: any) {
      setError(e.message || "Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-2 text-sm">
            <button
              onClick={() => setTab("courts")}
              className={`px-3 py-1 rounded-full ${tab === "courts" ? "bg-emerald-500" : "bg-slate-700"}`}
            >
              Courts
            </button>
            <button
              onClick={() => setTab("bookings")}
              className={`px-3 py-1 rounded-full ${tab === "bookings" ? "bg-emerald-500" : "bg-slate-700"}`}
            >
              Bookings
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-3 text-sm bg-red-900/40 border border-red-600 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {tab === "courts" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">Manage Courts</h2>
              <button
                className="text-sm px-3 py-1 rounded-lg bg-emerald-500"
                onClick={() => setEditing({ name: "", pricePerHour: 80000, surface: "Karpet", hasAc: false, imageUrl: "" })}
              >
                + Add Court
              </button>
            </div>

            {/* List Courts */}
            <table className="w-full text-sm border border-slate-700 rounded-lg overflow-hidden">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-3 py-2 text-left">ID</th>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Price</th>
                  <th className="px-3 py-2 text-left">Surface</th>
                  <th className="px-3 py-2 text-left">AC</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courts.map((c) => (
                  <tr key={c.id} className="border-t border-slate-700">
                    <td className="px-3 py-2">{c.id}</td>
                    <td className="px-3 py-2">{c.name}</td>
                    <td className="px-3 py-2">Rp {c.pricePerHour.toLocaleString()}</td>
                    <td className="px-3 py-2">{c.surface}</td>
                    <td className="px-3 py-2">{c.hasAc ? "Yes" : "No"}</td>
                    <td className="px-3 py-2 text-right space-x-2">
                      <button
                        className="text-xs px-2 py-1 rounded bg-slate-700"
                        onClick={() => setEditing(c)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-xs px-2 py-1 rounded bg-red-600"
                        onClick={() => handleDelete(c.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {!courts.length && (
                  <tr>
                    <td colSpan={6} className="px-3 py-4 text-center text-slate-400">
                      No courts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Form modal sederhana */}
            {editing && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
                <div className="bg-slate-900 rounded-xl p-4 w-full max-w-md space-y-3">
                  <h3 className="font-semibold">{editing.id ? "Edit Court" : "Add Court"}</h3>
                  <input
                    className="w-full px-3 py-2 rounded bg-slate-800 text-sm"
                    placeholder="Name"
                    value={editing.name ?? ""}
                    onChange={e => setEditing({ ...editing, name: e.target.value })}
                  />
                  <input
                    type="number"
                    className="w-full px-3 py-2 rounded bg-slate-800 text-sm"
                    placeholder="Price per hour"
                    value={editing.pricePerHour ?? 0}
                    onChange={e => setEditing({ ...editing, pricePerHour: Number(e.target.value) })}
                  />
                  <input
                    className="w-full px-3 py-2 rounded bg-slate-800 text-sm"
                    placeholder="Surface"
                    value={editing.surface ?? ""}
                    onChange={e => setEditing({ ...editing, surface: e.target.value })}
                  />
                  <input
                    className="w-full px-3 py-2 rounded bg-slate-800 text-sm"
                    placeholder="Image URL"
                    value={editing.imageUrl ?? ""}
                    onChange={e => setEditing({ ...editing, imageUrl: e.target.value })}
                  />
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={editing.hasAc ?? false}
                      onChange={e => setEditing({ ...editing, hasAc: e.target.checked })}
                    />
                    Has AC
                  </label>
                  <div className="flex justify-end gap-2 text-sm">
                    <button
                      className="px-3 py-1 rounded bg-slate-700"
                      onClick={() => setEditing(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-emerald-500"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "bookings" && (
          <div className="space-y-3">
            <h2 className="font-semibold">All Bookings</h2>
            <table className="w-full text-sm border border-slate-700 rounded-lg overflow-hidden">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-3 py-2 text-left">ID</th>
                  <th className="px-3 py-2 text-left">Court</th>
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-left">Time</th>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Payment Ref</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id} className="border-t border-slate-700">
                    <td className="px-3 py-2">{b.id}</td>
                    <td className="px-3 py-2">{b.courtName}</td>
                    <td className="px-3 py-2">{b.date}</td>
                    <td className="px-3 py-2">{b.time}</td>
                    <td className="px-3 py-2">{b.userName}</td>
                    <td className="px-3 py-2">{b.status}</td>
                    <td className="px-3 py-2">{b.paymentRef}</td>
                  </tr>
                ))}
                {!bookings.length && (
                  <tr>
                    <td colSpan={7} className="px-3 py-4 text-center text-slate-400">
                      No bookings yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {loading && <p className="mt-3 text-xs text-slate-400">Loading...</p>}
      </div>
    </div>
  );
}
