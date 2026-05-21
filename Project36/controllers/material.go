package controllers

import (
	"warehouse/models"
	"warehouse/utils"
)

type MaterialController struct {
	BaseController
}

type MaterialListResponse struct {
	List  []MaterialDetail `json:"list"`
	Total int64             `json:"total"`
}

type MaterialDetail struct {
	models.Material
	AreaName string `json:"area_name"`
}

func (c *MaterialController) List() {
	page, _ := c.GetInt("page", 1)
	pageSize, _ := c.GetInt("page_size", 10)
	status, _ := c.GetInt("status", -1)
	warehouseAreaId, _ := c.GetUint("warehouse_area_id", 0)
	keyword := c.GetString("keyword")

	offset := (page - 1) * pageSize

	db := utils.DB.Table("material m").
		Select("m.*, wa.area_name").
		Joins("LEFT JOIN warehouse_area wa ON m.warehouse_area_id = wa.id")

	if status != -1 {
		db = db.Where("m.status = ?", status)
	}
	if warehouseAreaId > 0 {
		db = db.Where("m.warehouse_area_id = ?", warehouseAreaId)
	}
	if keyword != "" {
		db = db.Where("m.material_name LIKE ? OR m.material_code LIKE ?", "%"+keyword+"%", "%"+keyword+"%")
	}

	var total int64
	db.Count(&total)

	var list []MaterialDetail
	db.Offset(offset).Limit(pageSize).Order("m.id DESC").Scan(&list)

	c.Success(MaterialListResponse{
		List:  list,
		Total: total,
	})
}

func (c *MaterialController) Get() {
	id, err := c.GetUint(":id")
	if err != nil {
		c.Error(400, "Invalid ID")
		return
	}

	var material MaterialDetail
	if err := utils.DB.Table("material m").
		Select("m.*, wa.area_name").
		Joins("LEFT JOIN warehouse_area wa ON m.warehouse_area_id = wa.id").
		Where("m.id = ?", id).
		Scan(&material).Error; err != nil {
		c.Error(404, "Material not found")
		return
	}

	if material.Id == 0 {
		c.Error(404, "Material not found")
		return
	}

	c.Success(material)
}

func (c *MaterialController) Create() {
	var material models.Material
	if err := c.ParseForm(&material); err != nil {
		c.Error(400, "Invalid request data")
		return
	}

	if material.MaterialCode == "" || material.MaterialName == "" {
		c.Error(400, "Material code and name are required")
		return
	}

	if material.WarehouseAreaId == 0 {
		c.Error(400, "Warehouse area is required")
		return
	}

	var areaCount int64
	utils.DB.Model(&models.WarehouseArea{}).Where("id = ?", material.WarehouseAreaId).Count(&areaCount)
	if areaCount == 0 {
		c.Error(400, "Warehouse area not exists")
		return
	}

	var count int64
	utils.DB.Model(&models.Material{}).Where("material_code = ?", material.MaterialCode).Count(&count)
	if count > 0 {
		c.Error(400, "Material code already exists")
		return
	}

	material.Quantity = 0
	if err := utils.DB.Create(&material).Error; err != nil {
		c.Error(500, "Failed to create material")
		return
	}

	c.Success(material)
}

func (c *MaterialController) Update() {
	id, err := c.GetUint(":id")
	if err != nil {
		c.Error(400, "Invalid ID")
		return
	}

	var material models.Material
	if err := utils.DB.First(&material, id).Error; err != nil {
		c.Error(404, "Material not found")
		return
	}

	var updateData models.Material
	if err := c.ParseForm(&updateData); err != nil {
		c.Error(400, "Invalid request data")
		return
	}

	if updateData.MaterialName != "" {
		material.MaterialName = updateData.MaterialName
	}
	if updateData.Specification != "" {
		material.Specification = updateData.Specification
	}
	if updateData.Unit != "" {
		material.Unit = updateData.Unit
	}
	if updateData.Category != "" {
		material.Category = updateData.Category
	}
	if updateData.WarehouseAreaId > 0 {
		var areaCount int64
		utils.DB.Model(&models.WarehouseArea{}).Where("id = ?", updateData.WarehouseAreaId).Count(&areaCount)
		if areaCount == 0 {
			c.Error(400, "Warehouse area not exists")
			return
		}
		material.WarehouseAreaId = updateData.WarehouseAreaId
	}
	if updateData.MinStock >= 0 {
		material.MinStock = updateData.MinStock
	}
	if updateData.MaxStock > 0 {
		material.MaxStock = updateData.MaxStock
	}
	if updateData.Price >= 0 {
		material.Price = updateData.Price
	}
	if updateData.Supplier != "" {
		material.Supplier = updateData.Supplier
	}
	if updateData.Remark != "" {
		material.Remark = updateData.Remark
	}

	if err := utils.DB.Save(&material).Error; err != nil {
		c.Error(500, "Failed to update material")
		return
	}

	c.Success(material)
}

func (c *MaterialController) Delete() {
	id, err := c.GetUint(":id")
	if err != nil {
		c.Error(400, "Invalid ID")
		return
	}

	var material models.Material
	if err := utils.DB.First(&material, id).Error; err != nil {
		c.Error(404, "Material not found")
		return
	}

	if material.Quantity > 0 {
		c.Error(400, "Cannot delete material with inventory")
		return
	}

	if err := utils.DB.Delete(&models.Material{}, id).Error; err != nil {
		c.Error(500, "Failed to delete material")
		return
	}

	c.Success(nil)
}

func (c *MaterialController) UpdateStatus() {
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

	var material models.Material
	if err := utils.DB.First(&material, id).Error; err != nil {
		c.Error(404, "Material not found")
		return
	}

	material.Status = int8(status)
	if err := utils.DB.Save(&material).Error; err != nil {
		c.Error(500, "Failed to update status")
		return
	}

	c.Success(material)
}
