package controllers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"repair-system-backend/database"
	"repair-system-backend/models"
)

func GetRepairRecords(c *fiber.Ctx) error {
	var records []models.RepairRecord
	query := database.DB.Preload("Request.Device").Preload("Technician")

	status := c.Query("status")
	if status != "" {
		query = query.Where("repair_records.status = ?", status)
	}

	technicianID := c.Query("technician_id")
	if technicianID != "" {
		query = query.Where("technician_id = ?", technicianID)
	}

	query.Find(&records)

	return c.JSON(models.Response{
		Success: true,
		Data:    records,
	})
}

func GetRepairRecord(c *fiber.Ctx) error {
	id := c.Params("id")
	var record models.RepairRecord

	if err := database.DB.Preload("Request.Device").Preload("Technician").First(&record, id).Error; err != nil {
		return c.Status(404).JSON(models.Response{
			Success: false,
			Message: "Repair record not found",
		})
	}

	return c.JSON(models.Response{
		Success: true,
		Data:    record,
	})
}

func StartRepair(c *fiber.Ctx) error {
	id := c.Params("id")
	var record models.RepairRecord

	if err := database.DB.First(&record, id).Error; err != nil {
		return c.Status(404).JSON(models.Response{
			Success: false,
			Message: "Repair record not found",
		})
	}

	now := time.Now()
	record.StartTime = &now
	record.Status = "processing"
	database.DB.Save(&record)

	database.DB.Model(&models.RepairRequest{}).Where("id = ?", record.RequestID).Update("status", "repairing")
	database.DB.Model(&models.Device{}).Where("id = (SELECT device_id FROM repair_requests WHERE id = ?)", record.RequestID).Update("status", "repairing")

	return c.JSON(models.Response{
		Success: true,
		Message: "Repair started successfully",
		Data:    record,
	})
}

func CompleteRepair(c *fiber.Ctx) error {
	id := c.Params("id")
	var record models.RepairRecord

	if err := database.DB.First(&record, id).Error; err != nil {
		return c.Status(404).JSON(models.Response{
			Success: false,
			Message: "Repair record not found",
		})
	}

	if err := c.BodyParser(&record); err != nil {
		return c.Status(400).JSON(models.Response{
			Success: false,
			Message: "Invalid request",
		})
	}

	now := time.Now()
	record.EndTime = &now
	record.Status = "completed"
	database.DB.Save(&record)

	database.DB.Model(&models.RepairRequest{}).Where("id = ?", record.RequestID).Update("status", "completed")
	database.DB.Model(&models.Device{}).Where("id = (SELECT device_id FROM repair_requests WHERE id = ?)", record.RequestID).Update("status", "normal")

	return c.JSON(models.Response{
		Success: true,
		Message: "Repair completed successfully",
		Data:    record,
	})
}
