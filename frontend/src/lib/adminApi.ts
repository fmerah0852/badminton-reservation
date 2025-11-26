import type { Court } from "./api"; // reuse Court type
import type { BookingResult } from "./api";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export async function listCourts(): Promise<Court[]> {
  const res = await fetch(`${API}/api/admin/courts`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load courts");
  return res.json();
}

export async function saveCourt(court: Partial<Court>): Promise<Court> {
  const method = court.id ? "PUT" : "POST";
  const res = await fetch(`${API}/api/admin/courts`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(court)
  });
  if (!res.ok) throw new Error("Failed to save court");
  return res.json();
}

export async function deleteCourt(id: number): Promise<void> {
  const res = await fetch(`${API}/api/admin/courts?id=${id}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Failed to delete court");
}

export type AdminBooking = {
  id: number;
  courtName: string;
  date: string;
  time: string;
  userName: string;
  status: string;
  paymentRef: string;
};

export async function listBookings(): Promise<AdminBooking[]> {
  const res = await fetch(`${API}/api/admin/bookings`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load bookings");
  return res.json();
}
