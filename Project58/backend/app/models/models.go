package models

import "time"

type InspectionPoint struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Name        string    `gorm:"size:100;not null" json:"name"`
	Location    string    `gorm:"size:255;not null" json:"location"`
	River       string    `gorm:"size:100;not null" json:"river"`
	Longitude   float64   `gorm:"type:decimal(10,7)" json:"longitude"`
	Latitude    float64   `gorm:"type:decimal(10,7)" json:"latitude"`
	Area        string    `gorm:"size:100" json:"area"`
	Status      int       `gorm:"default:1" json:"status"`
	Description string    `gorm:"type:text" json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type InspectionRecord struct {
	ID             uint             `gorm:"primaryKey" json:"id"`
	PointID        uint             `gorm:"not null" json:"point_id"`
	Point          InspectionPoint  `gorm:"foreignKey:PointID" json:"point,omitempty"`
	InspectionTime time.Time        `gorm:"not null" json:"inspection_time"`
	Inspector      string           `gorm:"size:50;not null" json:"inspector"`
	ProblemType    string           `gorm:"size:50;not null" json:"problem_type"`
	Description    string           `gorm:"type:text;not null" json:"description"`
	Severity       string           `gorm:"size:20" json:"severity"`
	PhotoURL       string           `gorm:"size:255" json:"photo_url"`
	Status         string           `gorm:"size:20;default:'pending'" json:"status"`
	Rectifications []RectificationRecord `gorm:"foreignKey:RecordID" json:"rectifications,omitempty"`
	CreatedAt      time.Time        `json:"created_at"`
	UpdatedAt      time.Time        `json:"updated_at"`
}

type RectificationRecord struct {
	ID                uint           `gorm:"primaryKey" json:"id"`
	RecordID          uint           `gorm:"not null" json:"record_id"`
	Record            InspectionRecord `gorm:"foreignKey:RecordID" json:"record,omitempty"`
	Measures          string         `gorm:"type:text;not null" json:"measures"`
	RectificationTime *time.Time     `json:"rectification_time"`
	PersonInCharge    string         `gorm:"size:50" json:"person_in_charge"`
	AfterPhotoURL     string         `gorm:"size:255" json:"after_photo_url"`
	Status            string         `gorm:"size:20;default:'processing'" json:"status"`
	Remarks           string         `gorm:"type:text" json:"remarks"`
	CreatedAt         time.Time      `json:"created_at"`
	UpdatedAt         time.Time      `json:"updated_at"`
}
