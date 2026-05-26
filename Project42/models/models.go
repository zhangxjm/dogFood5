package models

import (
	"time"

	"gorm.io/gorm"
)

type WorkOrder struct {
	ID           uint           `gorm:"primaryKey" json:"id"`
	OrderNo      string         `gorm:"uniqueIndex;size:50" json:"order_no"`
	CustomerName string         `gorm:"size:100" json:"customer_name"`
	Phone        string         `gorm:"size:20" json:"phone"`
	Address      string         `gorm:"size:500" json:"address"`
	ProductType  string         `gorm:"size:50" json:"product_type"`
	Quantity     int            `gorm:"default:1" json:"quantity"`
	Status       string         `gorm:"size:20;default:pending" json:"status"`
	Feedback     string         `gorm:"size:1000" json:"feedback"`
	InstallDate  *time.Time     `json:"install_date"`
	CompleteDate *time.Time     `json:"complete_date"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

func (WorkOrder) TableName() string {
	return "work_orders"
}
