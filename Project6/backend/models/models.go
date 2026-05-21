package models

import (
	"time"

	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

type Product struct {
	ID          uint64          `json:"id" gorm:"primaryKey;autoIncrement"`
	Name        string          `json:"name" gorm:"not null;size:255"`
	Category    string          `json:"category" gorm:"not null;size:100"`
	Price       decimal.Decimal `json:"price" gorm:"type:decimal(10,2);not null"`
	Stock       int             `json:"stock" gorm:"not null;default:0"`
	Unit        string          `json:"unit" gorm:"not null;size:50"`
	Description string          `json:"description" gorm:"type:text"`
	ImageURL    string          `json:"image_url" gorm:"size:500"`
	Status      string          `json:"status" gorm:"size:50;default:'on_sale'"`
	CreatedAt   time.Time       `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time       `json:"updated_at" gorm:"autoUpdateTime"`
}

type Customer struct {
	ID          uint64          `json:"id" gorm:"primaryKey;autoIncrement"`
	Name        string          `json:"name" gorm:"not null;size:255"`
	Phone       string          `json:"phone" gorm:"not null;size:50;uniqueIndex"`
	Address     string          `json:"address" gorm:"type:text"`
	Email       string          `json:"email" gorm:"size:255"`
	TotalOrders int             `json:"total_orders" gorm:"default:0"`
	TotalAmount decimal.Decimal `json:"total_amount" gorm:"type:decimal(12,2);default:0.00"`
	CreatedAt   time.Time       `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time       `json:"updated_at" gorm:"autoUpdateTime"`
}

type Order struct {
	ID           uint64          `json:"id" gorm:"primaryKey;autoIncrement"`
	OrderNo      string          `json:"order_no" gorm:"not null;size:100;uniqueIndex"`
	CustomerID   uint64          `json:"customer_id" gorm:"not null"`
	TotalAmount  decimal.Decimal `json:"total_amount" gorm:"type:decimal(12,2);not null"`
	Status       string          `json:"status" gorm:"size:50;default:'pending'"`
	Address      string          `json:"address" gorm:"type:text"`
	Phone        string          `json:"phone" gorm:"size:50"`
	ReceiverName string          `json:"receiver_name" gorm:"size:255"`
	Remark       string          `json:"remark" gorm:"type:text"`
	CreatedAt    time.Time       `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt    time.Time       `json:"updated_at" gorm:"autoUpdateTime"`
	Customer     Customer        `json:"customer,omitempty" gorm:"foreignKey:CustomerID"`
	OrderItems   []OrderItem     `json:"order_items,omitempty" gorm:"foreignKey:OrderID"`
}

type OrderItem struct {
	ID          uint64          `json:"id" gorm:"primaryKey;autoIncrement"`
	OrderID     uint64          `json:"order_id" gorm:"not null"`
	ProductID   uint64          `json:"product_id" gorm:"not null"`
	ProductName string          `json:"product_name" gorm:"not null;size:255"`
	Price       decimal.Decimal `json:"price" gorm:"type:decimal(10,2);not null"`
	Quantity    int             `json:"quantity" gorm:"not null"`
	Subtotal    decimal.Decimal `json:"subtotal" gorm:"type:decimal(12,2);not null"`
	CreatedAt   time.Time       `json:"created_at" gorm:"autoCreateTime"`
}

type OrderStatusLog struct {
	ID        uint64    `json:"id" gorm:"primaryKey;autoIncrement"`
	OrderID   uint64    `json:"order_id" gorm:"not null"`
	OldStatus string    `json:"old_status" gorm:"size:50"`
	NewStatus string    `json:"new_status" gorm:"not null;size:50"`
	Remark    string    `json:"remark" gorm:"size:500"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
}

func AutoMigrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&Product{},
		&Customer{},
		&Order{},
		&OrderItem{},
		&OrderStatusLog{},
	)
}
