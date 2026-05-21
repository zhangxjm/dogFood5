package models

import (
	"time"
)

type User struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Username  string    `json:"username" gorm:"unique;not null"`
	Password  string    `json:"-" gorm:"not null"`
	RealName  string    `json:"real_name" gorm:"not null"`
	Phone     string    `json:"phone"`
	Role      string    `json:"role" gorm:"default:'user'"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Device struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	DeviceCode   string    `json:"device_code" gorm:"unique;not null"`
	DeviceName   string    `json:"device_name" gorm:"not null"`
	DeviceType   string    `json:"device_type" gorm:"not null"`
	Location     string    `json:"location"`
	PurchaseDate string    `json:"purchase_date"`
	Status       string    `json:"status" gorm:"default:'normal'"`
	Description  string    `json:"description"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type RepairRequest struct {
	ID               uint      `json:"id" gorm:"primaryKey"`
	RequestNo        string    `json:"request_no" gorm:"unique;not null"`
	DeviceID         uint      `json:"device_id" gorm:"not null"`
	ReporterID       uint      `json:"reporter_id" gorm:"not null"`
	FaultType        string    `json:"fault_type" gorm:"not null"`
	FaultDescription string    `json:"fault_description" gorm:"not null"`
	Priority         string    `json:"priority" gorm:"default:'medium'"`
	Status           string    `json:"status" gorm:"default:'pending'"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
	Device           Device    `json:"device" gorm:"foreignKey:DeviceID"`
	Reporter         User      `json:"reporter" gorm:"foreignKey:ReporterID"`
}

type RepairAssignment struct {
	ID                 uint      `json:"id" gorm:"primaryKey"`
	RequestID          uint      `json:"request_id" gorm:"not null"`
	TechnicianID       uint      `json:"technician_id" gorm:"not null"`
	AssignerID         uint      `json:"assigner_id" gorm:"not null"`
	AssignTime         time.Time `json:"assign_time"`
	ExpectedCompleteTime *time.Time `json:"expected_complete_time"`
	Remark             string    `json:"remark"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
	Request            RepairRequest `json:"request" gorm:"foreignKey:RequestID"`
	Technician         User      `json:"technician" gorm:"foreignKey:TechnicianID"`
	Assigner           User      `json:"assigner" gorm:"foreignKey:AssignerID"`
}

type RepairRecord struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	RequestID    uint      `json:"request_id" gorm:"not null"`
	TechnicianID uint      `json:"technician_id" gorm:"not null"`
	StartTime    *time.Time `json:"start_time"`
	EndTime      *time.Time `json:"end_time"`
	FaultCause   string    `json:"fault_cause"`
	Solution     string    `json:"solution"`
	PartsUsed    string    `json:"parts_used"`
	Cost         float64   `json:"cost" gorm:"default:0"`
	Status       string    `json:"status" gorm:"default:'processing'"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	Request      RepairRequest `json:"request" gorm:"foreignKey:RequestID"`
	Technician   User      `json:"technician" gorm:"foreignKey:TechnicianID"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}
