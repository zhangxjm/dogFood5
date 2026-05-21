package controllers

import (
	"rescue-system/models"

	"github.com/beego/beego/v2/client/orm"
)

type LocationController struct {
	BaseController
}

func (c *LocationController) List() {
	var locations []models.RescueLocation
	o := orm.NewOrm()
	_, err := o.QueryTable("rescue_locations").OrderBy("-id").All(&locations)
	if err != nil {
		c.Fail(err.Error())
		return
	}
	c.Success(locations)
}

func (c *LocationController) Add() {
	var location models.RescueLocation
	if err := c.ParseForm(&location); err != nil {
		c.Fail(err.Error())
		return
	}
	o := orm.NewOrm()
	_, err := o.Insert(&location)
	if err != nil {
		c.Fail(err.Error())
		return
	}
	c.Success(location)
}

func (c *LocationController) Update() {
	id, _ := c.GetInt("id")
	var location models.RescueLocation
	o := orm.NewOrm()
	location.Id = id
	if err := o.Read(&location); err != nil {
		c.Fail("记录不存在")
		return
	}
	if err := c.ParseForm(&location); err != nil {
		c.Fail(err.Error())
		return
	}
	_, err := o.Update(&location)
	if err != nil {
		c.Fail(err.Error())
		return
	}
	c.Success(location)
}

func (c *LocationController) Delete() {
	id, _ := c.GetInt("id")
	o := orm.NewOrm()
	_, err := o.Delete(&models.RescueLocation{Id: id})
	if err != nil {
		c.Fail(err.Error())
		return
	}
	c.Success(nil)
}
