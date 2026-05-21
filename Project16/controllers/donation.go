package controllers

import (
	"rescue-system/models"

	"github.com/beego/beego/v2/client/orm"
)

type DonationController struct {
	BaseController
}

func (c *DonationController) List() {
	var donations []models.Donation
	o := orm.NewOrm()
	_, err := o.QueryTable("donations").OrderBy("-id").All(&donations)
	if err != nil {
		c.Fail(err.Error())
		return
	}
	c.Success(donations)
}

func (c *DonationController) Add() {
	var donation models.Donation
	if err := c.ParseForm(&donation); err != nil {
		c.Fail(err.Error())
		return
	}
	o := orm.NewOrm()
	_, err := o.Insert(&donation)
	if err != nil {
		c.Fail(err.Error())
		return
	}
	c.Success(donation)
}

func (c *DonationController) Update() {
	id, _ := c.GetInt("id")
	var donation models.Donation
	o := orm.NewOrm()
	donation.Id = id
	if err := o.Read(&donation); err != nil {
		c.Fail("记录不存在")
		return
	}
	if err := c.ParseForm(&donation); err != nil {
		c.Fail(err.Error())
		return
	}
	_, err := o.Update(&donation)
	if err != nil {
		c.Fail(err.Error())
		return
	}
	c.Success(donation)
}

func (c *DonationController) Delete() {
	id, _ := c.GetInt("id")
	o := orm.NewOrm()
	_, err := o.Delete(&models.Donation{Id: id})
	if err != nil {
		c.Fail(err.Error())
		return
	}
	c.Success(nil)
}
