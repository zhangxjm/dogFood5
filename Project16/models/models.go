package models

import (
	"time"
)

type RescueLocation struct {
	Id        int       `orm:"column(id);auto" json:"id"`
	Name      string    `orm:"column(name);size(100)" json:"name"`
	Address   string    `orm:"column(address);size(255)" json:"address"`
	Remark    string    `orm:"column(remark);type(text);null" json:"remark"`
	CreatedAt time.Time `orm:"column(created_at);auto_now_add;type(datetime)" json:"created_at"`
}

func (r *RescueLocation) TableName() string {
	return "rescue_locations"
}

type Volunteer struct {
	Id        int       `orm:"column(id);auto" json:"id"`
	Name      string    `orm:"column(name);size(50)" json:"name"`
	Phone     string    `orm:"column(phone);size(20)" json:"phone"`
	Wechat    string    `orm:"column(wechat);size(50);null" json:"wechat"`
	Remark    string    `orm:"column(remark);type(text);null" json:"remark"`
	CreatedAt time.Time `orm:"column(created_at);auto_now_add;type(datetime)" json:"created_at"`
}

func (v *Volunteer) TableName() string {
	return "volunteers"
}

type RescueInfo struct {
	Id           int       `orm:"column(id);auto" json:"id"`
	AnimalType   string    `orm:"column(animal_type);size(50)" json:"animal_type"`
	Description  string    `orm:"column(description);type(text)" json:"description"`
	LocationId   int       `orm:"column(location_id)" json:"location_id"`
	LocationName string   `orm:"-" json:"location_name"`
	VolunteerId  int       `orm:"column(volunteer_id)" json:"volunteer_id"`
	VolunteerName string   `orm:"-" json:"volunteer_name"`
	Status       string    `orm:"column(status);size(20)" json:"status"`
	Remark       string    `orm:"column(remark);type(text);null" json:"remark"`
	CreatedAt    time.Time `orm:"column(created_at);auto_now_add;type(datetime)" json:"created_at"`
}

func (r *RescueInfo) TableName() string {
	return "rescue_infos"
}

type Donation struct {
	Id           int       `orm:"column(id);auto" json:"id"`
	ItemName     string    `orm:"column(item_name);size(100)" json:"item_name"`
	Quantity     int       `orm:"column(quantity)" json:"quantity"`
	Unit         string    `orm:"column(unit);size(20)" json:"unit"`
	DonorName    string    `orm:"column(donor_name);size(50)" json:"donor_name"`
	DonorPhone   string    `orm:"column(donor_phone);size(20);null" json:"donor_phone"`
	Remark       string    `orm:"column(remark);type(text);null" json:"remark"`
	CreatedAt    time.Time `orm:"column(created_at);auto_now_add;type(datetime)" json:"created_at"`
}

func (d *Donation) TableName() string {
	return "donations"
}
