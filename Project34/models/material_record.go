package models

import (
	"time"
)

type MaterialRecord struct {
	Id           int       `orm:"auto"`
	MaterialId   int       `orm:"column(material_id)"`
	MaterialCode string    `orm:"size(50);null"`
	MaterialName string    `orm:"size(100);null"`
	Type         string    `orm:"size(20)"`
	Quantity     int       ``
	Operator     string    `orm:"size(100);null"`
	Remark       string    `orm:"size(500);null"`
	CreatedAt    time.Time `orm:"auto_now_add;type(datetime)"`
}

func (m *MaterialRecord) TableName() string {
	return "material_record"
}
