package controllers

import (
	"fmt"

	"github.com/beego/beego/v2/client/orm"
	beego "github.com/beego/beego/v2/server/web"

	"warehouse-system/models"
)

type WarehouseAreaController struct {
	beego.Controller
}

func (c *WarehouseAreaController) List() {
	o := orm.NewOrm()
	var areas []models.WarehouseArea
	_, err := o.QueryTable("warehouse_area").OrderBy("-id").All(&areas)
	if err != nil {
		areas = []models.WarehouseArea{}
	}

	c.Data["Areas"] = areas
	c.Data["IsWarehouse"] = true
	c.TplName = "warehouse_list.tpl"
}

func (c *WarehouseAreaController) Add() {
	name := c.GetString("name")
	code := c.GetString("code")
	description := c.GetString("description")

	if name == "" || code == "" {
		c.Data["json"] = map[string]interface{}{"success": false, "message": "Name and code are required"}
		c.ServeJSON()
		return
	}

	area := models.WarehouseArea{
		Name:        name,
		Code:        code,
		Description: description,
	}

	o := orm.NewOrm()
	_, err := o.Insert(&area)
	if err != nil {
		c.Data["json"] = map[string]interface{}{"success": false, "message": fmt.Sprintf("Failed to add area: %v", err)}
		c.ServeJSON()
		return
	}

	c.Data["json"] = map[string]interface{}{"success": true, "message": "Area added successfully"}
	c.ServeJSON()
}

func (c *WarehouseAreaController) Delete() {
	idStr := c.Ctx.Input.Param(":id")
	id := 0
	fmt.Sscanf(idStr, "%d", &id)

	if id <= 0 {
		c.Data["json"] = map[string]interface{}{"success": false, "message": "Invalid ID"}
		c.ServeJSON()
		return
	}

	o := orm.NewOrm()
	area := models.WarehouseArea{Id: id}
	_, err := o.Delete(&area)
	if err != nil {
		c.Data["json"] = map[string]interface{}{"success": false, "message": fmt.Sprintf("Failed to delete area: %v", err)}
		c.ServeJSON()
		return
	}

	c.Data["json"] = map[string]interface{}{"success": true, "message": "Area deleted successfully"}
	c.ServeJSON()
}
