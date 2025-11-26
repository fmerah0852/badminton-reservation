package config

import (
	"os"
)

type Config struct {
	DatabaseURL string
	Addr        string
}

func Load() Config {
	cfg := Config{
		DatabaseURL: getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:15432/badminton?sslmode=disable"),
		Addr:        getEnv("ADDR", ":8080"),
	}
	return cfg
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
