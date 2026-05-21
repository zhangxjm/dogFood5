package models

import (
	"time"
)

type Product struct {
	ID            uint      `json:"id" gorm:"primaryKey"`
	Name          string    `json:"name" gorm:"not null;size:255"`
	Category      string    `json:"category" gorm:"size:100"`
	Brand         string    `json:"brand" gorm:"size:100"`
	Spec          string    `json:"spec" gorm:"size:255"`
	PurchasePrice float64   `json:"purchase_price" gorm:"type:decimal(10,2);not null"`
	SalePrice     float64   `json:"sale_price" gorm:"type:decimal(10,2);not null"`
	Stock         int       `json:"stock" gorm:"not null;default:0"`
	MinStock      int       `json:"min_stock" gorm:"not null;default:5"`
	Unit          string    `json:"unit" gorm:"size:20"`
	Remark        string    `json:"remark" gorm:"type:text"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

func (p *Product) IsLowStock() bool {
	return p.Stock <= p.MinStock
}
