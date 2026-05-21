package models

import (
	"time"
)

type Category struct {
	ID          uint      `json:"id" gorm:"primary_key"`
	Name        string    `json:"name" gorm:"type:varchar(100);not null"`
	Description string    `json:"description" gorm:"type:text"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Product struct {
	ID             uint      `json:"id" gorm:"primary_key"`
	CategoryID     uint      `json:"category_id" gorm:"not null"`
	Category       Category  `json:"category,omitempty" gorm:"foreignkey:CategoryID"`
	Name           string    `json:"name" gorm:"type:varchar(200);not null"`
	Specification  string    `json:"specification" gorm:"type:varchar(200)"`
	Price          float64   `json:"price" gorm:"type:decimal(10,2);not null"`
	StockQuantity  int       `json:"stock_quantity" gorm:"not null;default:0"`
	WarningQuantity int      `json:"warning_quantity" gorm:"not null;default:10"`
	Supplier       string    `json:"supplier" gorm:"type:varchar(200)"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type Customer struct {
	ID        uint      `json:"id" gorm:"primary_key"`
	Name      string    `json:"name" gorm:"type:varchar(100);not null"`
	Phone     string    `json:"phone" gorm:"type:varchar(20)"`
	Address   string    `json:"address" gorm:"type:varchar(500)"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type PurchaseRecord struct {
	ID           uint      `json:"id" gorm:"primary_key"`
	CustomerID   uint      `json:"customer_id" gorm:"not null"`
	Customer     Customer  `json:"customer,omitempty" gorm:"foreignkey:CustomerID"`
	ProductID    uint      `json:"product_id" gorm:"not null"`
	Product      Product   `json:"product,omitempty" gorm:"foreignkey:ProductID"`
	Quantity     int       `json:"quantity" gorm:"not null"`
	UnitPrice    float64   `json:"unit_price" gorm:"type:decimal(10,2);not null"`
	TotalPrice   float64   `json:"total_price" gorm:"type:decimal(10,2);not null"`
	PurchaseDate time.Time `json:"purchase_date"`
	Remark       string    `json:"remark" gorm:"type:text"`
	CreatedAt    time.Time `json:"created_at"`
}

type RestockAlert struct {
	ID              uint   `json:"id"`
	ProductID       uint   `json:"product_id"`
	ProductName     string `json:"product_name"`
	CategoryName    string `json:"category_name"`
	CurrentStock    int    `json:"current_stock"`
	WarningQuantity int    `json:"warning_quantity"`
	NeedRestock     int    `json:"need_restock"`
	Supplier        string `json:"supplier"`
}
