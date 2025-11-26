package httpserver

import (
	"database/sql"
	"net/http"

	"github.com/fmerah0852/badminton-reservation/backend/internal/courts"
)

type Server struct {
	db       *sql.DB
	courtSvc *courts.Service
}

func NewServer(db *sql.DB) http.Handler {
	s := &Server{
		db:       db,
		courtSvc: courts.NewService(db),
	}

	mux := http.NewServeMux()

	// user
	mux.Handle("/api/availability", withCORS(http.HandlerFunc(s.handleAvailability)))
	mux.Handle("/api/courts", withCORS(http.HandlerFunc(s.handleCourts)))
	mux.Handle("/api/bookings", withCORS(http.HandlerFunc(s.handleBookings)))

	// admin
	mux.Handle("/api/admin/courts", withCORS(http.HandlerFunc(s.handleAdminCourts)))
	mux.Handle("/api/admin/bookings", withCORS(http.HandlerFunc(s.handleAdminBookings)))

	return mux
}
