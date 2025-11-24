package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"
)

type Timeslot struct {
	ID   string `json:"id"`
	From string `json:"from"`
	To   string `json:"to"`
}

type Court struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type ReservationRequest struct {
	Date       string `json:"date"`
	TimeslotID string `json:"timeslotId"`
	CourtID    string `json:"courtId"`
	Name       string `json:"name"`
}

type ReservationResponse struct {
	ID     string `json:"id"`
	Status string `json:"status"`
	Paid   bool   `json:"paid"`
}

func enableCors(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
}

func datesHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(w)
	today := time.Now()
	var dates []string
	for i := 0; i < 7; i++ {
		dates = append(dates, today.AddDate(0, 0, i).Format("2006-01-02"))
	}
	json.NewEncoder(w).Encode(dates)
}

func timeslotsHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(w)
	// di real app: filter by date, cek dari DB
	slots := []Timeslot{
		{"1", "08:00", "09:00"},
		{"2", "09:00", "10:00"},
		{"3", "19:00", "20:00"},
	}
	json.NewEncoder(w).Encode(slots)
}

func courtsHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(w)
	// di real app: filter by date & timeslot, cek dari DB
	courts := []Court{
		{"1", "Court A"},
		{"2", "Court B"},
	}
	json.NewEncoder(w).Encode(courts)
}

func reservationHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(w)
	if r.Method == http.MethodOptions {
		return
	}
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var req ReservationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// Di sini kamu bisa:
	// - Cek ketersediaan
	// - Simpan ke DB
	// - Panggil payment gateway (bonus point)

	resp := ReservationResponse{
		ID:     "RES-" + time.Now().Format("20060102150405"),
		Status: "CONFIRMED",
		Paid:   true, // misalnya sudah bayar
	}
	json.NewEncoder(w).Encode(resp)
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/dates", datesHandler)
	mux.HandleFunc("/api/timeslots", timeslotsHandler)
	mux.HandleFunc("/api/courts", courtsHandler)
	mux.HandleFunc("/api/reservations", reservationHandler)

	log.Println("Backend running on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
