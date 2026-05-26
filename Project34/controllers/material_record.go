package controllers

import (
	"fmt"
	"strconv"

	"github.com/beego/beego/v2/client/orm"
	beego "github.com/beego/beego/v2/server/web"

	"warehouse-system/models"
)

type MaterialRecordController struct {
	beego.Controller
}

func (c *MaterialRecordController) List() {
	o := orm.NewOrm()

	var records []models.MaterialRecord
	_, err := o.QueryTable("material_record").OrderBy("-id").Limit(100).All(&records)
	if err != nil {
		records = []models.MaterialRecord{}
	}

	var materials []models.Material
	o.QueryTable("material").All(&materials)

	c.Data["Records"] = records
	c.Data["Materials"] = materials
	c.Data["IsRecord"] = true
	c.TplName = "record_list.tpl"
}

func (c *MaterialRecordController) In() {
	materialIdStr := c.GetString("material_id")
	quantityStr := c.GetString("quantity")
	operator := c.GetString("operator")
	remark := c.GetString("remark")

	materialId, err := strconv.Atoi(materialIdStr)
	if err != nil || materialId <= 0 {
		c.Data["json"] = map[string]interface{}{"success": false, "message": "Valid material ID is required"}
		c.ServeJSON()
		return
	}

	quantity, err := strconv.Atoi(quantityStr)
	if err != nil || quantity <= 0 {
		c.Data["json"] = map[string]interface{}{"success": false, "message": "Valid quantity is required"}
		c.ServeJSON()
		return
	}

	if operator == "" {
		operator = "Anonymous"
	}

	o := orm.NewOrm()

	material := models.Material{Id: materialId}
	err = o.Read(&material)
	if err != nil {
		c.Data["json"] = map[string]interface{}{"success": false, "message": "Material not found"}
		c.ServeJSON()
		return
	}

	record := models.MaterialRecord{
		MaterialId:   materialId,
		MaterialCode: material.Code,
		MaterialName: material.Name,
		Type:         "in",
		Quantity:     quantity,
		Operator:     operator,
		Remark:       remark,
	}

	_, err = o.Insert(&record)
	if err != nil {
		c.Data["json"] = map[string]interface{}{"success": false, "message": fmt.Sprintf("Failed to create record: %v", err)}
		c.ServeJSON()
		return
	}

	material.Stock += quantity
	_, err = o.Update(&material, "Stock")
	if err != nil {
		c.Data["json"] = map[string]interface{}{"success": false, "message": fmt.Sprintf("Failed to update stock: %v", err)}
		c.ServeJSON()
		return
	}

	c.Data["json"] = map[string]interface{}{"success": true, "message": "Stock-in record created successfully", "new_stock": material.Stock}
	c.ServeJSON()
}

func (c *MaterialRecordController) Out() {
	materialIdStr := c.GetString("material_id")
	quantityStr := c.GetString("quantity")
	operator := c.GetString("operator")
	remark := c.GetString("remark")

	materialId, err := strconv.Atoi(materialIdStr)
	if err != nil || materialId <= 0 {
		c.Data["json"] = map[string]interface{}{"success": false, "message": "Valid material ID is required"}
		c.ServeJSON()
		return
	}

	quantity, err := strconv.Atoi(quantityStr)
	if err != nil || quantity <= 0 {
		c.Data["json"] = map[string]interface{}{"success": false, "message": "Valid quantity is required"}
		c.ServeJSON()
		return
	}

	if operator == "" {
		operator = "Anonymous"
	}

	o := orm.NewOrm()

	material := models.Material{Id: materialId}
	err = o.Read(&material)
	if err != nil {
		c.Data["json"] = map[string]interface{}{"success": false, "message": "Material not found"}
		c.ServeJSON()
		return
	}

	if material.Stock < quantity {
		c.Data["json"] = map[string]interface{}{"success": false, "message": fmt.Sprintf("Insufficient stock. Current: %d, Requested: %d", material.Stock, quantity)}
		c.ServeJSON()
		return
	}

	record := models.MaterialRecord{
		MaterialId:   materialId,
		MaterialCode: material.Code,
		MaterialName: material.Name,
		Type:         "out",
		Quantity:     quantity,
		Operator:     operator,
		Remark:       remark,
	}

	_, err = o.Insert(&record)
	if err != nil {
		c.Data["json"] = map[string]interface{}{"success": false, "message": fmt.Sprintf("Failed to create record: %v", err)}
		c.ServeJSON()
		return
	}

	material.Stock -= quantity
	_, err = o.Update(&material, "Stock")
	if err != nil {
		c.Data["json"] = map[string]interface{}{"success": false, "message": fmt.Sprintf("Failed to update stock: %v", err)}
		c.ServeJSON()
		return
	}

	c.Data["json"] = map[string]interface{}{"success": true, "message": "Stock-out record created successfully", "new_stock": material.Stock}
	c.ServeJSON()
}
