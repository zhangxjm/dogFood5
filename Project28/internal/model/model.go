package model

import (
	"time"

	"gorm.io/gorm"
)

type RoomType struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	Name        string         `json:"name" gorm:"size:100;not null"`
	Description string         `json:"description" gorm:"type:text"`
	Price       float64        `json:"price" gorm:"type:decimal(10,2);not null"`
	Area        float64        `json:"area"`
	MaxGuests   int            `json:"max_guests" gorm:"not null"`
	BedCount    int            `json:"bed_count"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

type Facility struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	Name        string         `json:"name" gorm:"size:100;not null;unique"`
	Icon        string         `json:"icon" gorm:"size:255"`
	Description string         `json:"description" gorm:"type:text"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

type RoomFacility struct {
	ID         uint `json:"id" gorm:"primaryKey"`
	RoomID     uint `json:"room_id" gorm:"not null;index"`
	FacilityID uint `json:"facility_id" gorm:"not null;index"`
}

type Room struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	RoomNumber  string         `json:"room_number" gorm:"size:50;not null;unique"`
	RoomTypeID  uint           `json:"room_type_id" gorm:"not null;index"`
	Floor       int            `json:"floor"`
	Status      string         `json:"status" gorm:"size:20;not null;default:'available'"`
	Description string         `json:"description" gorm:"type:text"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
	RoomType    RoomType       `json:"room_type" gorm:"foreignKey:RoomTypeID"`
	Facilities  []Facility     `json:"facilities" gorm:"many2many:room_facilities;joinForeignKey:RoomID;joinReferences:FacilityID"`
}

type CheckInRecord struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	RoomID      uint           `json:"room_id" gorm:"not null;index"`
	CustomerName string        `json:"customer_name" gorm:"size:100;not null"`
	IDCard      string         `json:"id_card" gorm:"size:50;not null"`
	Phone       string         `json:"phone" gorm:"size:20"`
	CheckInTime time.Time      `json:"check_in_time" gorm:"not null"`
	CheckOutTime *time.Time    `json:"check_out_time"`
	GuestCount  int            `json:"guest_count" gorm:"not null;default:1"`
	Deposit     float64        `json:"deposit" gorm:"type:decimal(10,2)"`
	Remark      string         `json:"remark" gorm:"type:text"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
	Room        Room           `json:"room" gorm:"foreignKey:RoomID"`
}
