package availability

import (
	"context"
	"database/sql"
	"time"

	"github.com/fmerah0852/badminton-reservation/backend/internal/models"
)

// GetAvailability menghitung slot jam dan statusnya (AVAILABLE / FULL / PAST)
// berdasarkan data bookings di database.
func GetAvailability(ctx context.Context, db *sql.DB, date string) ([]models.AvailabilitySlot, error) {
	// Daftar jam dasar
	baseSlots := []string{
		"08:00", "09:00", "10:00", "11:00",
		"14:00", "15:00", "16:00", "17:00",
		"19:00", "20:00", "21:00",
	}

	// Hitung total court
	var totalCourts int
	if err := db.QueryRowContext(ctx, `SELECT COUNT(*) FROM courts`).Scan(&totalCourts); err != nil {
		return nil, err
	}

	todayStr := time.Now().Format("2006-01-02")
	nowTime := time.Now().Format("15:04")

	slots := make([]models.AvailabilitySlot, 0, len(baseSlots))

	for _, t := range baseSlots {
		status := "AVAILABLE"

		// status PAST kalau hari ini dan jam sudah lewat
		if date == todayStr && t <= nowTime {
			status = "PAST"
		} else {
			var bookedCount int
			err := db.QueryRowContext(ctx, `
        SELECT COUNT(DISTINCT court_id)
        FROM bookings
        WHERE booking_date = $1 AND booking_time = $2
      `, date, t+":00").Scan(&bookedCount)
			if err != nil {
				return nil, err
			}
			if bookedCount >= totalCourts {
				status = "FULL"
			}
		}

		slots = append(slots, models.AvailabilitySlot{
			Time:   t,
			Status: status,
		})
	}

	return slots, nil
}
