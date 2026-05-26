package models

import (
	"time"
)

type Worker struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Name         string    `gorm:"size:50;not null;comment:姓名" json:"name"`
	Gender       string    `gorm:"size:10;not null;comment:性别" json:"gender"`
	Age          int       `gorm:"comment:年龄" json:"age"`
	IDCard       string    `gorm:"size:18;uniqueIndex;comment:身份证号" json:"id_card"`
	Phone        string    `gorm:"size:20;comment:联系电话" json:"phone"`
	WorkType     string    `gorm:"size:50;comment:工种" json:"work_type"`
	TeamName     string    `gorm:"size:100;comment:所属班组" json:"team_name"`
	Hometown     string    `gorm:"size:200;comment:籍贯" json:"hometown"`
	EmergencyContact string `gorm:"size:50;comment:紧急联系人" json:"emergency_contact"`
	EmergencyPhone   string `gorm:"size:20;comment:紧急联系电话" json:"emergency_phone"`
	Status       string    `gorm:"size:20;default:在住;comment:状态:在住/已退宿" json:"status"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	CurrentBedID *uint     `gorm:"index;comment:当前床位ID" json:"current_bed_id,omitempty"`
	CurrentBed   *Bed      `gorm:"foreignKey:CurrentBedID" json:"current_bed,omitempty"`
}

const (
	WorkerStatusLiving  = "在住"
	WorkerStatusCheckedOut = "已退宿"
)
