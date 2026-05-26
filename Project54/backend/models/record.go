package models

import (
	"time"
)

type CheckInRecord struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	WorkerID      uint      `gorm:"not null;index;comment:工人ID" json:"worker_id"`
	BedID         uint      `gorm:"not null;index;comment:床位ID" json:"bed_id"`
	CheckInDate   time.Time `gorm:"not null;comment:入住日期" json:"check_in_date"`
	ExpectedStayDays int    `gorm:"comment:预计入住天数" json:"expected_stay_days"`
	Remark        string    `gorm:"size:500;comment:备注" json:"remark"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
	Worker        Worker    `gorm:"foreignKey:WorkerID" json:"worker,omitempty"`
	Bed           Bed       `gorm:"foreignKey:BedID" json:"bed,omitempty"`
	HasCheckedOut bool      `gorm:"default:false;comment:是否已退宿" json:"has_checked_out"`
}

type CheckOutRecord struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	WorkerID     uint      `gorm:"not null;index;comment:工人ID" json:"worker_id"`
	BedID        uint      `gorm:"not null;index;comment:床位ID" json:"bed_id"`
	CheckInID    uint      `gorm:"not null;index;comment:入住记录ID" json:"check_in_id"`
	CheckOutDate time.Time `gorm:"not null;comment:退宿日期" json:"check_out_date"`
	ActualStayDays int     `gorm:"comment:实际入住天数" json:"actual_stay_days"`
	Reason       string    `gorm:"size:500;comment:退宿原因" json:"reason"`
	Remark       string    `gorm:"size:500;comment:备注" json:"remark"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	Worker       Worker    `gorm:"foreignKey:WorkerID" json:"worker,omitempty"`
	Bed          Bed       `gorm:"foreignKey:BedID" json:"bed,omitempty"`
	CheckInRecord CheckInRecord `gorm:"foreignKey:CheckInID" json:"check_in_record,omitempty"`
}
