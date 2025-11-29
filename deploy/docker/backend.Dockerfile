# ---- build stage ----
FROM golang:1.22-alpine AS build
WORKDIR /app

# copy go.mod & go.sum
COPY backend/go.mod backend/go.sum ./
RUN go mod download

# copy source backend
COPY backend/ ./

# build binary
RUN go build -o server ./cmd/api

# ---- runtime stage ----
FROM alpine:3.20
WORKDIR /app

# install timezone / ca-certificates jika perlu
RUN apk add --no-cache ca-certificates

COPY --from=build /app/server /app/server

# port backend
EXPOSE 8080

# DATABASE_URL akan diisi lewat env di Deployment
ENV DATABASE_URL=""

CMD ["/app/server"]
