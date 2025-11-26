package models

type AvailabilitySlot struct {
	Time   string `json:"time"`
	Status string `json:"status"`
}

type Court struct {
	ID           int    `json:"id"`
	Name         string `json:"name"`
	PricePerHour int    `json:"pricePerHour"`
	ImageURL     string `json:"imageUrl"`
	Surface      string `json:"surface"`
	HasAC        bool   `json:"hasAc"`
}

type BookingRequest struct {
	Date     string `json:"date"`
	Time     string `json:"time"`
	CourtID  int    `json:"courtId"`
	UserName string `json:"userName"`
}

type BookingResponse struct {
	ID         int    `json:"id"`
	Status     string `json:"status"`
	PaymentRef string `json:"paymentRef"`
}

type Booking struct {
	ID         int    `json:"id"`
	CourtName  string `json:"courtName"`
	Date       string `json:"date"`
	Time       string `json:"time"`
	UserName   string `json:"userName"`
	Status     string `json:"status"`
	PaymentRef string `json:"paymentRef"`
}
