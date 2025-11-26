package httpserver

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/fmerah0852/badminton-reservation/backend/internal/availability"
	"github.com/fmerah0852/badminton-reservation/backend/internal/bookings"
	"github.com/fmerah0852/badminton-reservation/backend/internal/models"
)

// helper kecil untuk kirim JSON
func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

// ---------- USER HANDLERS ----------

func (s *Server) handleAvailability(w http.ResponseWriter, r *http.Request) {
	date := r.URL.Query().Get("date")
	if date == "" {
		http.Error(w, "missing date", http.StatusBadRequest)
		return
	}

	slots, err := availability.GetAvailability(r.Context(), s.db, date)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	writeJSON(w, http.StatusOK, slots)
}

func (s *Server) handleCourts(w http.ResponseWriter, r *http.Request) {
	date := r.URL.Query().Get("date")
	timeStr := r.URL.Query().Get("time")
	if date == "" || timeStr == "" {
		http.Error(w, "missing date or time", http.StatusBadRequest)
		return
	}

	list, err := s.courtSvc.GetAvailableCourts(r.Context(), date, timeStr)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	writeJSON(w, http.StatusOK, list)
}

func (s *Server) handleBookings(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.BookingRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	resp, err := bookings.CreateBooking(r.Context(), s.db, req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusConflict)
		return
	}

	writeJSON(w, http.StatusOK, resp)
}

// ---------- ADMIN HANDLERS ----------

func (s *Server) handleAdminCourts(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		list, err := s.courtSvc.ListCourts(r.Context())
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeJSON(w, http.StatusOK, list)

	case http.MethodPost:
		var c models.Court
		if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		if err := s.courtSvc.CreateCourt(r.Context(), &c); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeJSON(w, http.StatusCreated, c)

	case http.MethodPut:
		var c models.Court
		if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		if c.ID == 0 {
			http.Error(w, "missing id", http.StatusBadRequest)
			return
		}
		if err := s.courtSvc.UpdateCourt(r.Context(), &c); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		writeJSON(w, http.StatusOK, c)

	case http.MethodDelete:
		idStr := r.URL.Query().Get("id")
		if idStr == "" {
			http.Error(w, "missing id", http.StatusBadRequest)
			return
		}
		id, _ := strconv.Atoi(idStr)
		if err := s.courtSvc.DeleteCourt(r.Context(), id); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)

	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}

func (s *Server) handleAdminBookings(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	list, err := bookings.ListBookings(r.Context(), s.db)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	writeJSON(w, http.StatusOK, list)
}
