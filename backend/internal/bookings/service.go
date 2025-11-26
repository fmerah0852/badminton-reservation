package bookings

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/fmerah0852/badminton-reservation/backend/internal/models"
)

func CreateBooking(ctx context.Context, db *sql.DB, req models.BookingRequest) (models.BookingResponse, error) {
	tx, err := db.BeginTx(ctx, &sql.TxOptions{Isolation: sql.LevelSerializable})
	if err != nil {
		return models.BookingResponse{}, err
	}
	defer tx.Rollback()

	// cek double booking
	var exists bool
	err = tx.QueryRowContext(ctx, `
SELECT EXISTS(
  SELECT 1 FROM bookings
  WHERE court_id = $1 AND booking_date = $2 AND booking_time = $3
)`, req.CourtID, req.Date, req.Time+":00").Scan(&exists)
	if err != nil {
		return models.BookingResponse{}, err
	}
	if exists {
		return models.BookingResponse{}, fmt.Errorf("slot already booked")
	}

	paymentRef := "PAY-" + time.Now().Format("20060102150405")

	var id int
	err = tx.QueryRowContext(ctx, `
INSERT INTO bookings (court_id, booking_date, booking_time, user_name, status, payment_ref)
VALUES ($1,$2,$3,$4,$5,$6)
RETURNING id
`, req.CourtID, req.Date, req.Time+":00", req.UserName, "PAID", paymentRef).Scan(&id)
	if err != nil {
		return models.BookingResponse{}, err
	}

	if err := tx.Commit(); err != nil {
		return models.BookingResponse{}, err
	}

	return models.BookingResponse{
		ID:         id,
		Status:     "PAID",
		PaymentRef: paymentRef,
	}, nil
}

// untuk dashboard
func ListBookings(ctx context.Context, db *sql.DB) ([]models.Booking, error) {
	rows, err := db.QueryContext(ctx, `
SELECT b.id, c.name, b.booking_date, b.booking_time, b.user_name, b.status, b.payment_ref
FROM bookings b
JOIN courts c ON b.court_id = c.id
ORDER BY b.booking_date DESC, b.booking_time DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.Booking
	for rows.Next() {
		var bk models.Booking
		if err := rows.Scan(&bk.ID, &bk.CourtName, &bk.Date, &bk.Time, &bk.UserName, &bk.Status, &bk.PaymentRef); err != nil {
			return nil, err
		}
		list = append(list, bk)
	}
	return list, rows.Err()
}
