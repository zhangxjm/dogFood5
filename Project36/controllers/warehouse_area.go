package controllers

import (
	"warehouse/models"
	"warehouse/utils"
)

type WarehouseAreaController struct {
	BaseController
}

type WarehouseAreaListResponse struct {
	List  []models.WarehouseArea `json:"list"`
	Total int64                   `json:"total"`
}

func (c *WarehouseAreaController) List() {
	page, _ := c.GetInt("page", 1)
	pageSize, _ := c.GetInt("page_size", 10)
	status, _ := c.GetInt("status", -1)
	keyword := c.GetString("keyword")

	offset := (page - 1) * pageSize

	db := utils.DB.Model(&models.WarehouseArea{})

	if status != -1 {
		db = db.Where("status = ?", status)
	}
	if keyword != "" {
		db = db.Where("area_name LIKE ? OR area_code LIKE ?", "%"+keyword+"%", "%"+keyword+"%")
	}

	var total int64
	db.Count(&total)

	var list []models.WarehouseArea
	db.Offset(offset).Limit(pageSize).Order("id DESC").Find(&list)

	c.Success(WarehouseAreaListResponse{
		List:  list,
		Total: total,
	})
}

func (c *WarehouseAreaController) Get() {
	id, err := c.GetUint(":id")
	if err != nil {
		c.Error(400, "Invalid ID")
		return
	}

	var area models.WarehouseArea
	if err := utils.DB.First(&area, id).Error; err != nil {
		c.Error(404, "Warehouse area not found")
		return
	}

	c.Success(area)
}

func (c *WarehouseAreaController) Create() {
	var area models.WarehouseArea
	if err := c.ParseForm(&area); err != nil {
		c.Error(400, "Invalid request data")
		return
	}

	if area.AreaCode == "" || area.AreaName == "" {
		c.Error(400, "Area code and name are required")
		return
	}

	var count int64
	utils.DB.Model(&models.WarehouseArea{}).Where("area_code = ?", area.AreaCode).Count(&count)
	if count > 0 {
		c.Error(400, "Area code already exists")
		return
	}

	if err := utils.DB.Create(&area).Error; err != nil {
		c.Error(500, "Failed to create warehouse area")
		return
	}

	c.Success(area)
}

func (c *WarehouseAreaController) Update() {
	id, err := c.GetUint(":id")
	if err != nil {
		c.Error(400, "Invalid ID")
		return
	}

	var area models.WarehouseArea
	if err := utils.DB.First(&area, id).Error; err != nil {
		c.Error(404, "Warehouse area not found")
		return
	}

	var updateData models.WarehouseArea
	if err := c.ParseForm(&updateData); err != nil {
		c.Error(400, "Invalid request data")
		return
	}

	if updateData.AreaName != "" {
		area.AreaName = updateData.AreaName
	}
	if updateData.AreaType != 0 {
		area.AreaType = updateData.AreaType
	}
	if updateData.Location != "" {
		area.Location = updateData.Location
	}
	if updateData.Manager != "" {
		area.Manager = updateData.Manager
	}
	if updateData.Phone != "" {
		area.Phone = updateData.Phone
	}
	if updateData.Remark != "" {
		area.Remark = updateData.Remark
	}

	if err := utils.DB.Save(&area).Error; err != nil {
		c.Error(500, "Failed to update warehouse area")
		return
	}

	c.Success(area)
}

func (c *WarehouseAreaController) Delete() {
	id, err := c.GetUint(":id")
	if err != nil {
		c.Error(400, "Invalid ID")
		return
	}

	var count int64
	utils.DB.Model(&models.Material{}).Where("warehouse_area_id = ?", id).Count(&count)
	if count > 0 {
		c.Error(400, "Cannot delete area with materials")
		return
	}

	if err := utils.DB.Delete(&models.WarehouseArea{}, id).Error; err != nil {
		c.Error(500, "Failed to delete warehouse area")
		return
	}

	c.Success(nil)
}

func (c *WarehouseAreaController) UpdateStatus() {
	id, err := c.GetUint(":id")
	if err != nil {
		c.Error(400, "Invalid ID")
		return
	}

	status, err := c.GetInt("status")
	if err != nil || (status != 0 && status != 1) {
		c.Error(400, "Invalid status")
		return
	}

	var area models.WarehouseArea
	if err := utils.DB.First(&area, id).Error; err != nil {
		c.Error(404, "Warehouse area not found")
		return
	}

	area.Status = int8(status)
	if err := utils.DB.Save(&area).Error; err != nil {
		c.Error(500, "Failed to update status")
		return
	}

	c.Success(area)
}
