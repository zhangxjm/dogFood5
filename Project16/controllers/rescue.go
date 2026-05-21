package controllers

import (
	"rescue-system/models"

	"github.com/beego/beego/v2/client/orm"
)

type RescueController struct {
	BaseController
}

func (c *RescueController) List() {
	var rescues []models.RescueInfo
	o := orm.NewOrm()
	_, err := o.QueryTable("rescue_infos").OrderBy("-id").All(&rescues)
	if err != nil {
		c.Fail(err.Error())
		return
	}
	
	for i := range rescues {
		var loc models.RescueLocation
		var vol models.Volunteer
		o.QueryTable("rescue_locations").Filter("id", rescues[i].LocationId).One(&loc)
		rescues[i].LocationName = loc.Name
		o.QueryTable("volunteers").Filter("id", rescues[i].VolunteerId).One(&vol)
		rescues[i].VolunteerName = vol.Name
	}
	c.Success(rescues)
}

func (c *RescueController) Add() {
	var rescue models.RescueInfo
	if err := c.ParseForm(&rescue); err != nil {
		c.Fail(err.Error())
		return
	}
	o := orm.NewOrm()
	_, err := o.Insert(&rescue)
	if err != nil {
		c.Fail(err.Error())
		return
	}
	c.Success(rescue)
}

func (c *RescueController) Update() {
	id, _ := c.GetInt("id")
	var rescue models.RescueInfo
	o := orm.NewOrm()
	rescue.Id = id
	if err := o.Read(&rescue); err != nil {
		c.Fail("记录不存在")
		return
	}
	if err := c.ParseForm(&rescue); err != nil {
		c.Fail(err.Error())
		return
	}
	_, err := o.Update(&rescue)
	if err != nil {
		c.Fail(err.Error())
		return
	}
	c.Success(rescue)
}

func (c *RescueController) Delete() {
	id, _ := c.GetInt("id")
	o := orm.NewOrm()
	_, err := o.Delete(&models.RescueInfo{Id: id})
	if err != nil {
		c.Fail(err.Error())
		return
	}
	c.Success(nil)
}
