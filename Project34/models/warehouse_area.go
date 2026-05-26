package models

import (
	"time"
)

type WarehouseArea struct {
	Id          int       `orm:"auto"`
	Name        string    `orm:"size(100)"`
	Code        string    `orm:"size(50);unique"`
	Description string    `orm:"size(500);null"`
	CreatedAt   time.Time `orm:"auto_now_add;type(datetime)"`
	UpdatedAt   time.Time `orm:"auto_now;type(datetime)"`
}

func (w *WarehouseArea) TableName() string {
	return "warehouse_area"
}
