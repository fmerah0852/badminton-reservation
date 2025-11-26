package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/fmerah0852/badminton-reservation/backend/internal/db"
	"github.com/fmerah0852/badminton-reservation/backend/internal/httpserver"
)

func main() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgres://postgres@127.0.0.1:5433/badminton?sslmode=disable"

	}
	log.Println("Using DSN:", dsn) // <-- tambahkan ini

	conn, err := db.Connect(dsn)
	if err != nil {
		log.Fatal("connect db:", err)
	}
	defer conn.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := db.SetupSchema(ctx, conn); err != nil {
		log.Fatal("setup schema:", err)
	}

	handler := httpserver.NewServer(conn)

	addr := ":8080"
	log.Println("Backend running on", addr)
	log.Fatal(http.ListenAndServe(addr, handler))
}
