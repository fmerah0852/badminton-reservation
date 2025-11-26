package courts

import (
	"context"
	"database/sql"

	"github.com/fmerah0852/badminton-reservation/backend/internal/models"
)

type Service struct {
	DB *sql.DB
}

func NewService(db *sql.DB) *Service {
	return &Service{DB: db}
}

// ---------- UNTUK USER (PILIH LAPANGAN) ----------

func (s *Service) GetAvailableCourts(ctx context.Context, date, timeStr string) ([]models.Court, error) {
	rows, err := s.DB.QueryContext(ctx, `
SELECT c.id, c.name, c.price_per_hour, c.image_url, c.surface, c.has_ac
FROM courts c
LEFT JOIN bookings b
  ON b.court_id = c.id
 AND b.booking_date = $1
 AND b.booking_time = $2
WHERE b.id IS NULL
ORDER BY c.id;
`, date, timeStr+":00")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.Court
	for rows.Next() {
		var c models.Court
		if err := rows.Scan(
			&c.ID,
			&c.Name,
			&c.PricePerHour,
			&c.ImageURL,
			&c.Surface,
			&c.HasAC,
		); err != nil {
			return nil, err
		}
		list = append(list, c)
	}
	return list, rows.Err()
}

// ---------- CRUD UNTUK ADMIN DASHBOARD ----------

func (s *Service) ListCourts(ctx context.Context) ([]models.Court, error) {
	rows, err := s.DB.QueryContext(ctx, `
SELECT id, name, price_per_hour, image_url, surface, has_ac
FROM courts
ORDER BY id;
`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.Court
	for rows.Next() {
		var c models.Court
		if err := rows.Scan(
			&c.ID,
			&c.Name,
			&c.PricePerHour,
			&c.ImageURL,
			&c.Surface,
			&c.HasAC,
		); err != nil {
			return nil, err
		}
		list = append(list, c)
	}
	return list, rows.Err()
}

func (s *Service) CreateCourt(ctx context.Context, c *models.Court) error {
	return s.DB.QueryRowContext(ctx, `
INSERT INTO courts (name, price_per_hour, image_url, surface, has_ac)
VALUES ($1,$2,$3,$4,$5)
RETURNING id;
`, c.Name, c.PricePerHour, c.ImageURL, c.Surface, c.HasAC,
	).Scan(&c.ID)
}

func (s *Service) UpdateCourt(ctx context.Context, c *models.Court) error {
	_, err := s.DB.ExecContext(ctx, `
UPDATE courts
SET name = $1,
    price_per_hour = $2,
    image_url = $3,
    surface = $4,
    has_ac = $5
WHERE id = $6;
`, c.Name, c.PricePerHour, c.ImageURL, c.Surface, c.HasAC, c.ID)
	return err
}

func (s *Service) DeleteCourt(ctx context.Context, id int) error {
	_, err := s.DB.ExecContext(ctx, `DELETE FROM courts WHERE id = $1;`, id)
	return err
}
