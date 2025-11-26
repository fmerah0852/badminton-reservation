package db

import (
	"context"
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

func Connect(dsn string) (*sql.DB, error) {
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, err
	}
	if err := db.Ping(); err != nil {
		return nil, err
	}
	return db, nil
}

func SetupSchema(ctx context.Context, db *sql.DB) error {
	schema := `
CREATE TABLE IF NOT EXISTS courts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price_per_hour INT NOT NULL,
  image_url TEXT NOT NULL,
  surface TEXT NOT NULL,
  has_ac BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  court_id INT NOT NULL REFERENCES courts(id),
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  user_name TEXT NOT NULL,
  status TEXT NOT NULL,
  payment_ref TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (court_id, booking_date, booking_time)
);

CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL
);
`
	if _, err := db.ExecContext(ctx, schema); err != nil {
		return fmt.Errorf("create schema: %w", err)
	}

	seedCourts := `
INSERT INTO courts (name, price_per_hour, image_url, surface, has_ac)
VALUES
 ('Court A', 80000, '/courts/court-a.jpg', 'Karpet', true),
 ('Court B', 70000, '/courts/court-b.jpg', 'Karpet', false),
 ('Court C', 90000, '/courts/court-c.jpg', 'Kayu', true)
ON CONFLICT DO NOTHING;
`
	if _, err := db.ExecContext(ctx, seedCourts); err != nil {
		return fmt.Errorf("seed courts: %w", err)
	}
	return nil
}
