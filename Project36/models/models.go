package models

import (
	"time"
)

type WarehouseArea struct {
	Id        uint      `gorm:"primary_key;auto_increment" json:"id"`
	AreaCode  string    `gorm:"size:50;unique;not null" json:"area_code"`
	AreaName  string    `gorm:"size:100;not null" json:"area_name"`
	AreaType  int8      `gorm:"default:1" json:"area_type"`
	Location  string    `gorm:"size:200" json:"location"`
	Manager   string    `gorm:"size:50" json:"manager"`
	Phone     string    `gorm:"size:20" json:"phone"`
	Status    int8      `gorm:"default:1" json:"status"`
	Remark    string    `gorm:"size:500" json:"remark"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}

func (WarehouseArea) TableName() string {
	return "warehouse_area"
}

type Material struct {
	Id             uint      `gorm:"primary_key;auto_increment" json:"id"`
	MaterialCode   string    `gorm:"size:50;unique;not null" json:"material_code"`
	MaterialName   string    `gorm:"size:100;not null" json:"material_name"`
	Specification  string    `gorm:"size:200" json:"specification"`
	Unit           string    `gorm:"size:20" json:"unit"`
	Category       string    `gorm:"size:50" json:"category"`
	WarehouseAreaId uint     `gorm:"not null" json:"warehouse_area_id"`
	Quantity       float64   `gorm:"type:decimal(12,2);default:0.00" json:"quantity"`
	MinStock       float64   `gorm:"type:decimal(12,2);default:0.00" json:"min_stock"`
	MaxStock       float64   `gorm:"type:decimal(12,2);default:999999.99" json:"max_stock"`
	Price          float64   `gorm:"type:decimal(12,2);default:0.00" json:"price"`
	Supplier       string    `gorm:"size:100" json:"supplier"`
	Status         int8      `gorm:"default:1" json:"status"`
	Remark         string    `gorm:"size:500" json:"remark"`
	CreatedAt      time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
	UpdatedAt      time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"updated_at"`
}

func (Material) TableName() string {
	return "material"
}

type InventoryRecord struct {
	Id             uint      `gorm:"primary_key;auto_increment" json:"id"`
	RecordNo       string    `gorm:"size:50;unique;not null" json:"record_no"`
	MaterialId     uint      `gorm:"not null" json:"material_id"`
	Type           int8      `gorm:"not null" json:"type"`
	Quantity       float64   `gorm:"type:decimal(12,2);not null" json:"quantity"`
	BeforeQuantity float64   `gorm:"type:decimal(12,2);not null" json:"before_quantity"`
	AfterQuantity  float64   `gorm:"type:decimal(12,2);not null" json:"after_quantity"`
	Operator       string    `gorm:"size:50" json:"operator"`
	OperateTime    time.Time `gorm:"not null" json:"operate_time"`
	Reason         string    `gorm:"size:200" json:"reason"`
	BatchNo        string    `gorm:"size:50" json:"batch_no"`
	Remark         string    `gorm:"size:500" json:"remark"`
	CreatedAt      time.Time `gorm:"default:CURRENT_TIMESTAMP" json:"created_at"`
}

func (InventoryRecord) TableName() string {
	return "inventory_record"
}
