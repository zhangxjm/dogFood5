package models

import (
	"time"
)

type Employee struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	EmployeeNo string    `gorm:"uniqueIndex;size:50;not null" json:"employee_no"`
	Name      string    `gorm:"size:100;not null" json:"name"`
	Department string   `gorm:"size:100" json:"department"`
	Phone     string    `gorm:"size:20" json:"phone"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type AccessRecord struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	EmployeeID  *uint     `json:"employee_id"`
	Employee    *Employee `gorm:"foreignKey:EmployeeID" json:"employee,omitempty"`
	VisitorID   *uint     `json:"visitor_id"`
	Visitor     *Visitor  `gorm:"foreignKey:VisitorID" json:"visitor,omitempty"`
	Type        string    `gorm:"size:20;not null" json:"type"`
	InTime      *time.Time `json:"in_time"`
	OutTime     *time.Time `json:"out_time"`
	Remark      string    `gorm:"size:255" json:"remark"`
	CreatedAt   time.Time `json:"created_at"`
}

type Visitor struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Name        string    `gorm:"size:100;not null" json:"name"`
	Phone       string    `gorm:"size:20" json:"phone"`
	IDCard      string    `gorm:"size:50" json:"id_card"`
	Company     string    `gorm:"size:100" json:"company"`
	Purpose     string    `gorm:"size:255" json:"purpose"`
	ContactPerson string  `gorm:"size:100" json:"contact_person"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
