package controllers

import (
	"rescue-system/models"

	"github.com/beego/beego/v2/client/orm"
)

type VolunteerController struct {
	BaseController
}

func (c *VolunteerController) List() {
	var volunteers []models.Volunteer
	o := orm.NewOrm()
	_, err := o.QueryTable("volunteers").OrderBy("-id").All(&volunteers)
	if err != nil {
		c.Fail(err.Error())
		return
	}
	c.Success(volunteers)
}

func (c *VolunteerController) Add() {
	var volunteer models.Volunteer
	if err := c.ParseForm(&volunteer); err != nil {
		c.Fail(err.Error())
		return
	}
	o := orm.NewOrm()
	_, err := o.Insert(&volunteer)
	if err != nil {
		c.Fail(err.Error())
		return
	}
	c.Success(volunteer)
}

func (c *VolunteerController) Update() {
	id, _ := c.GetInt("id")
	var volunteer models.Volunteer
	o := orm.NewOrm()
	volunteer.Id = id
	if err := o.Read(&volunteer); err != nil {
		c.Fail("记录不存在")
		return
	}
	if err := c.ParseForm(&volunteer); err != nil {
		c.Fail(err.Error())
		return
	}
	_, err := o.Update(&volunteer)
	if err != nil {
		c.Fail(err.Error())
		return
	}
	c.Success(volunteer)
}

func (c *VolunteerController) Delete() {
	id, _ := c.GetInt("id")
	o := orm.NewOrm()
	_, err := o.Delete(&models.Volunteer{Id: id})
	if err != nil {
		c.Fail(err.Error())
		return
	}
	c.Success(nil)
}
