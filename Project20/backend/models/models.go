package models

import (
	"time"
)

type Coach struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name" gorm:"size:50;not null"`
	Phone     string    `json:"phone" gorm:"size:20;unique;not null"`
	CarType   string    `json:"car_type" gorm:"size:20;not null"`
	CarNumber string    `json:"car_number" gorm:"size:20;not null"`
	Avatar    string    `json:"avatar" gorm:"size:255"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Student struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name" gorm:"size:50;not null"`
	Phone       string    `json:"phone" gorm:"size:20;unique;not null"`
	IDCard      string    `json:"id_card" gorm:"size:18;unique;not null"`
	SubjectType string    `json:"subject_type" gorm:"size:20;not null"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Schedule struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	CoachID      uint      `json:"coach_id" gorm:"not null;index"`
	Coach        Coach     `json:"coach" gorm:"foreignKey:CoachID"`
	Date         string    `json:"date" gorm:"type:date;not null;index"`
	StartTime    string    `json:"start_time" gorm:"type:time;not null"`
	EndTime      string    `json:"end_time" gorm:"type:time;not null"`
	Status       string    `json:"status" gorm:"size:20;default:'available'"`
	MaxStudents  int       `json:"max_students" gorm:"default:1"`
	BookedCount  int       `json:"booked_count" gorm:"default:0"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type Booking struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	ScheduleID   uint      `json:"schedule_id" gorm:"not null;index"`
	Schedule     Schedule  `json:"schedule" gorm:"foreignKey:ScheduleID"`
	StudentID    uint      `json:"student_id" gorm:"not null;index"`
	Student      Student   `json:"student" gorm:"foreignKey:StudentID"`
	CoachID      uint      `json:"coach_id" gorm:"not null;index"`
	Coach        Coach     `json:"coach" gorm:"foreignKey:CoachID"`
	BookingDate  string    `json:"booking_date" gorm:"type:date;not null"`
	StartTime    string    `json:"start_time" gorm:"type:time;not null"`
	EndTime      string    `json:"end_time" gorm:"type:time;not null"`
	Status       string    `json:"status" gorm:"size:20;default:'booked'"`
	CancelReason string    `json:"cancel_reason" gorm:"type:text"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type TrainingRecord struct {
	ID             uint      `json:"id" gorm:"primaryKey"`
	BookingID      uint      `json:"booking_id" gorm:"not null;index"`
	Booking        Booking   `json:"booking" gorm:"foreignKey:BookingID"`
	StudentID      uint      `json:"student_id" gorm:"not null;index"`
	Student        Student   `json:"student" gorm:"foreignKey:StudentID"`
	CoachID        uint      `json:"coach_id" gorm:"not null;index"`
	Coach          Coach     `json:"coach" gorm:"foreignKey:CoachID"`
	TrainingDate   string    `json:"training_date" gorm:"type:date;not null"`
	StartTime      string    `json:"start_time" gorm:"type:time;not null"`
	EndTime        string    `json:"end_time" gorm:"type:time;not null"`
	Duration       int       `json:"duration"`
	SubjectType    string    `json:"subject_type" gorm:"size:20;not null"`
	CoachFeedback  string    `json:"coach_feedback" gorm:"type:text"`
	StudentFeedback string   `json:"student_feedback" gorm:"type:text"`
	CreatedAt      time.Time `json:"created_at"`
}
