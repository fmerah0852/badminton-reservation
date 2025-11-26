// src/lib/api.ts

export type SlotStatus = "AVAILABLE" | "FULL" | "PAST" | "MAINTENANCE";

export type Slot = {
  time: string;
  status: SlotStatus;
};

export type Court = {
  id: number;
  name: string;
  pricePerHour: number;
  imageUrl: string;
  surface: string;
  hasAc: boolean;
};

export type BookingResult = {
  id: number;
  status: string;
  paymentRef: string;
};

const API = process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://192.168.49.2:30081";

console.log(">>> API BASE URL =", API);

export async function fetchDates(): Promise<string[]> {
  const res = await fetch(`${API}/api/dates`);
  if (!res.ok) {
    throw new Error("Failed to load available dates");
  }
  return res.json();
}

export async function fetchAvailability(date: string): Promise<Slot[]> {
  const res = await fetch(`${API}/api/availability?date=${date}`);
  if (!res.ok) {
    throw new Error("Failed to load availability");
  }
  return res.json();
}

export async function fetchCourts(date: string, time: string): Promise<Court[]> {
  const res = await fetch(`${API}/api/courts?date=${date}&time=${time}`);
  if (!res.ok) {
    throw new Error("Failed to load courts");
  }
  return res.json();
}

export async function createBooking(payload: {
  date: string;
  time: string;
  courtId: number;
  userName: string;
}): Promise<BookingResult> {
  const res = await fetch(`${API}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to create booking");
  }

  return res.json();
}
