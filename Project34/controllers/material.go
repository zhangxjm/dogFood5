package controllers

import (
	"fmt"
	"strconv"

	"github.com/beego/beego/v2/client/orm"
	beego "github.com/beego/beego/v2/server/web"

	"warehouse-system/models"
)

type MaterialController struct {
	beego.Controller
}

type MaterialView struct {
	Id              int
	Code            string
	Name            string
	Category        string
	Unit            string
	WarehouseAreaId int
	AreaName        string
	Stock           int
	Description     string
}

func (c *MaterialController) List() {
	o := orm.NewOrm()

	var materials []models.Material
	_, err := o.QueryTable("material").OrderBy("-id").All(&materials)
	if err != nil {
		materials = []models.Material{}
	}

	var areas []models.WarehouseArea
	o.QueryTable("warehouse_area").All(&areas)
	areaMap := make(map[int]string)
	for _, a := range areas {
		areaMap[a.Id] = a.Name
	}

	var materialViews []MaterialView
	for _, m := range materials {
		mv := MaterialView{
			Id:              m.Id,
			Code:            m.Code,
			Name:            m.Name,
			Category:        m.Category,
			Unit:            m.Unit,
			WarehouseAreaId: m.WarehouseAreaId,
			AreaName:        areaMap[m.WarehouseAreaId],
			Stock:           m.Stock,
			Description:     m.Description,
		}
		materialViews = append(materialViews, mv)
	}

	c.Data["Materials"] = materialViews
	c.Data["Areas"] = areas
	c.Data["IsMaterial"] = true
	c.TplName = "material_list.tpl"
}

func (c *MaterialController) Add() {
	code := c.GetString("code")
	name := c.GetString("name")
	category := c.GetString("category")
	unit := c.GetString("unit")
	warehouseAreaIdStr := c.GetString("warehouse_area_id")
	description := c.GetString("description")

	if code == "" || name == "" {
		c.Data["json"] = map[string]interface{}{"success": false, "message": "Code and name are required"}
		c.ServeJSON()
		return
	}

	warehouseAreaId, _ := strconv.Atoi(warehouseAreaIdStr)

	material := models.Material{
		Code:            code,
		Name:            name,
		Category:        category,
		Unit:            unit,
		WarehouseAreaId: warehouseAreaId,
		Stock:           0,
		Description:     description,
	}

	o := orm.NewOrm()
	_, err := o.Insert(&material)
	if err != nil {
		c.Data["json"] = map[string]interface{}{"success": false, "message": fmt.Sprintf("Failed to add material: %v", err)}
		c.ServeJSON()
		return
	}

	c.Data["json"] = map[string]interface{}{"success": true, "message": "Material added successfully"}
	c.ServeJSON()
}

func (c *MaterialController) Delete() {
	idStr := c.Ctx.Input.Param(":id")
	id := 0
	fmt.Sscanf(idStr, "%d", &id)

	if id <= 0 {
		c.Data["json"] = map[string]interface{}{"success": false, "message": "Invalid ID"}
		c.ServeJSON()
		return
	}

	o := orm.NewOrm()
	material := models.Material{Id: id}
	_, err := o.Delete(&material)
	if err != nil {
		c.Data["json"] = map[string]interface{}{"success": false, "message": fmt.Sprintf("Failed to delete material: %v", err)}
		c.ServeJSON()
		return
	}

	c.Data["json"] = map[string]interface{}{"success": true, "message": "Material deleted successfully"}
	c.ServeJSON()
}
