package models

import (
	"time"
)

type Dormitory struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Name        string    `gorm:"size:100;not null;comment:宿舍楼名称" json:"name"`
	FloorCount  int       `gorm:"not null;default:6;comment:楼层数" json:"floor_count"`
	Description string    `gorm:"size:500;comment:描述" json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	Rooms       []Room    `gorm:"foreignKey:DormitoryID" json:"rooms,omitempty"`
}

type Room struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	DormitoryID  uint      `gorm:"not null;index;comment:宿舍楼ID" json:"dormitory_id"`
	RoomNo       string    `gorm:"size:20;not null;comment:房间号" json:"room_no"`
	Floor        int       `gorm:"not null;comment:楼层" json:"floor"`
	BedCount     int       `gorm:"not null;default:4;comment:床位数" json:"bed_count"`
	RoomType     string    `gorm:"size:20;default:标准间;comment:房间类型" json:"room_type"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	Dormitory    Dormitory `gorm:"foreignKey:DormitoryID" json:"dormitory,omitempty"`
	Beds         []Bed     `gorm:"foreignKey:RoomID" json:"beds,omitempty"`
}

type Bed struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	RoomID     uint      `gorm:"not null;index;comment:房间ID" json:"room_id"`
	BedNo      string    `gorm:"size:20;not null;comment:床位号" json:"bed_no"`
	Status     string    `gorm:"size:20;default:空闲;comment:状态:空闲/已入住" json:"status"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
	Room       Room      `gorm:"foreignKey:RoomID" json:"room,omitempty"`
	CurrentWorker *Worker `gorm:"-" json:"current_worker,omitempty"`
}

const (
	BedStatusAvailable = "空闲"
	BedStatusOccupied  = "已入住"
)
