package models

import (
	"time"
)

type Material struct {
	Id              int       `orm:"auto"`
	Code            string    `orm:"size(50);unique"`
	Name            string    `orm:"size(100)"`
	Category        string    `orm:"size(100);null"`
	Unit            string    `orm:"size(20);null"`
	WarehouseAreaId int       `orm:"column(warehouse_area_id);null"`
	Stock           int       `orm:"default(0)"`
	Description     string    `orm:"size(500);null"`
	CreatedAt       time.Time `orm:"auto_now_add;type(datetime)"`
	UpdatedAt       time.Time `orm:"auto_now;type(datetime)"`
}

func (m *Material) TableName() string {
	return "material"
}
