package controllers

import (
	"fmt"
	"time"
	"warehouse/models"
	"warehouse/utils"
)

type InventoryController struct {
	BaseController
}

type InventoryListResponse struct {
	List  []InventoryDetail `json:"list"`
	Total int64              `json:"total"`
}

type InventoryDetail struct {
	models.InventoryRecord
	MaterialCode string `json:"material_code"`
	MaterialName string `json:"material_name"`
	Unit         string `json:"unit"`
}

type InboundRequest struct {
	MaterialId uint    `json:"material_id"`
	Quantity   float64 `json:"quantity"`
	Operator   string  `json:"operator"`
	Reason     string  `json:"reason"`
	BatchNo    string  `json:"batch_no"`
	Remark     string  `json:"remark"`
}

type OutboundRequest struct {
	MaterialId uint    `json:"material_id"`
	Quantity   float64 `json:"quantity"`
	Operator   string  `json:"operator"`
	Reason     string  `json:"reason"`
	BatchNo    string  `json:"batch_no"`
	Remark     string  `json:"remark"`
}

func generateRecordNo(recordType int8) string {
	prefix := "IN"
	if recordType == 2 {
		prefix = "OUT"
	}
	return fmt.Sprintf("%s%s%06d", prefix, time.Now().Format("20060102"), time.Now().UnixNano()%1000000)
}

func (c *InventoryController) List() {
	page, _ := c.GetInt("page", 1)
	pageSize, _ := c.GetInt("page_size", 10)
	materialId, _ := c.GetUint("material_id", 0)
	recordType, _ := c.GetInt("type", -1)
	startDate := c.GetString("start_date")
	endDate := c.GetString("end_date")

	offset := (page - 1) * pageSize

	db := utils.DB.Table("inventory_record ir").
		Select("ir.*, m.material_code, m.material_name, m.unit").
		Joins("LEFT JOIN material m ON ir.material_id = m.id")

	if materialId > 0 {
		db = db.Where("ir.material_id = ?", materialId)
	}
	if recordType != -1 {
		db = db.Where("ir.type = ?", recordType)
	}
	if startDate != "" {
		db = db.Where("ir.operate_time >= ?", startDate+" 00:00:00")
	}
	if endDate != "" {
		db = db.Where("ir.operate_time <= ?", endDate+" 23:59:59")
	}

	var total int64
	db.Count(&total)

	var list []InventoryDetail
	db.Offset(offset).Limit(pageSize).Order("ir.id DESC").Scan(&list)

	c.Success(InventoryListResponse{
		List:  list,
		Total: total,
	})
}

func (c *InventoryController) Get() {
	id, err := c.GetUint(":id")
	if err != nil {
		c.Error(400, "Invalid ID")
		return
	}

	var detail InventoryDetail
	if err := utils.DB.Table("inventory_record ir").
		Select("ir.*, m.material_code, m.material_name, m.unit").
		Joins("LEFT JOIN material m ON ir.material_id = m.id").
		Where("ir.id = ?", id).
		Scan(&detail).Error; err != nil {
		c.Error(404, "Record not found")
		return
	}

	if detail.Id == 0 {
		c.Error(404, "Record not found")
		return
	}

	c.Success(detail)
}

func (c *InventoryController) Inbound() {
	var req InboundRequest
	if err := c.ParseForm(&req); err != nil {
		c.Error(400, "Invalid request data")
		return
	}

	if req.MaterialId == 0 {
		c.Error(400, "Material ID is required")
		return
	}
	if req.Quantity <= 0 {
		c.Error(400, "Quantity must be greater than 0")
		return
	}

	var material models.Material
	if err := utils.DB.First(&material, req.MaterialId).Error; err != nil {
		c.Error(404, "Material not found")
		return
	}

	tx := utils.DB.Begin()

	beforeQuantity := material.Quantity
	afterQuantity := beforeQuantity + req.Quantity

	record := models.InventoryRecord{
		RecordNo:       generateRecordNo(1),
		MaterialId:     req.MaterialId,
		Type:           1,
		Quantity:       req.Quantity,
		BeforeQuantity: beforeQuantity,
		AfterQuantity:  afterQuantity,
		Operator:       req.Operator,
		OperateTime:    time.Now(),
		Reason:         req.Reason,
		BatchNo:        req.BatchNo,
		Remark:         req.Remark,
	}

	if err := tx.Create(&record).Error; err != nil {
		tx.Rollback()
		c.Error(500, "Failed to create inventory record")
		return
	}

	material.Quantity = afterQuantity
	if err := tx.Save(&material).Error; err != nil {
		tx.Rollback()
		c.Error(500, "Failed to update material quantity")
		return
	}

	tx.Commit()

	c.Success(record)
}

func (c *InventoryController) Outbound() {
	var req OutboundRequest
	if err := c.ParseForm(&req); err != nil {
		c.Error(400, "Invalid request data")
		return
	}

	if req.MaterialId == 0 {
		c.Error(400, "Material ID is required")
		return
	}
	if req.Quantity <= 0 {
		c.Error(400, "Quantity must be greater than 0")
		return
	}

	var material models.Material
	if err := utils.DB.First(&material, req.MaterialId).Error; err != nil {
		c.Error(404, "Material not found")
		return
	}

	if material.Quantity < req.Quantity {
		c.Error(400, fmt.Sprintf("Insufficient inventory. Current: %.2f, Requested: %.2f", material.Quantity, req.Quantity))
		return
	}

	tx := utils.DB.Begin()

	beforeQuantity := material.Quantity
	afterQuantity := beforeQuantity - req.Quantity

	record := models.InventoryRecord{
		RecordNo:       generateRecordNo(2),
		MaterialId:     req.MaterialId,
		Type:           2,
		Quantity:       req.Quantity,
		BeforeQuantity: beforeQuantity,
		AfterQuantity:  afterQuantity,
		Operator:       req.Operator,
		OperateTime:    time.Now(),
		Reason:         req.Reason,
		BatchNo:        req.BatchNo,
		Remark:         req.Remark,
	}

	if err := tx.Create(&record).Error; err != nil {
		tx.Rollback()
		c.Error(500, "Failed to create inventory record")
		return
	}

	material.Quantity = afterQuantity
	if err := tx.Save(&material).Error; err != nil {
		tx.Rollback()
		c.Error(500, "Failed to update material quantity")
		return
	}

	tx.Commit()

	c.Success(record)
}

func (c *InventoryController) Statistics() {
	type StatResult struct {
		TotalMaterials   int64   `json:"total_materials"`
		TotalAreas       int64   `json:"total_areas"`
		TotalInbound     int64   `json:"total_inbound"`
		TotalOutbound    int64   `json:"total_outbound"`
		LowStockCount    int64   `json:"low_stock_count"`
		TotalStockValue  float64 `json:"total_stock_value"`
	}

	var stats StatResult

	utils.DB.Model(&models.Material{}).Count(&stats.TotalMaterials)
	utils.DB.Model(&models.WarehouseArea{}).Where("status = 1").Count(&stats.TotalAreas)

	var totalIn, totalOut float64
	rows, _ := utils.DB.Model(&models.InventoryRecord{}).
		Select("type, SUM(quantity) as total").
		Group("type").
		Rows()
	for rows.Next() {
		var recordType int
		var total float64
		rows.Scan(&recordType, &total)
		if recordType == 1 {
			totalIn = total
		} else if recordType == 2 {
			totalOut = total
		}
	}
	stats.TotalInbound = int64(totalIn)
	stats.TotalOutbound = int64(totalOut)

	utils.DB.Model(&models.Material{}).
		Where("quantity <= min_stock AND status = 1").
		Count(&stats.LowStockCount)

	utils.DB.Model(&models.Material{}).
		Select("IFNULL(SUM(quantity * price), 0)").
		Row().
		Scan(&stats.TotalStockValue)

	c.Success(stats)
}
