package controllers

import (
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"repair-system-backend/database"
	"repair-system-backend/models"
)

func generateRequestNo() string {
	now := time.Now()
	return fmt.Sprintf("REQ%s%06d", now.Format("20060102"), time.Now().Unix()%1000000)
}

func GetRepairRequests(c *fiber.Ctx) error {
	var requests []models.RepairRequest
	query := database.DB.Preload("Device").Preload("Reporter")

	status := c.Query("status")
	if status != "" {
		query = query.Where("repair_requests.status = ?", status)
	}

	priority := c.Query("priority")
	if priority != "" {
		query = query.Where("priority = ?", priority)
	}

	query.Find(&requests)

	return c.JSON(models.Response{
		Success: true,
		Data:    requests,
	})
}

func GetRepairRequest(c *fiber.Ctx) error {
	id := c.Params("id")
	var request models.RepairRequest

	if err := database.DB.Preload("Device").Preload("Reporter").First(&request, id).Error; err != nil {
		return c.Status(404).JSON(models.Response{
			Success: false,
			Message: "Repair request not found",
		})
	}

	return c.JSON(models.Response{
		Success: true,
		Data:    request,
	})
}

func CreateRepairRequest(c *fiber.Ctx) error {
	user := c.Locals("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userID := uint(claims["user_id"].(float64))

	var request models.RepairRequest
	if err := c.BodyParser(&request); err != nil {
		return c.Status(400).JSON(models.Response{
			Success: false,
			Message: "Invalid request",
		})
	}

	request.ReporterID = userID
	request.RequestNo = generateRequestNo()
	request.Status = "pending"

	if err := database.DB.Create(&request).Error; err != nil {
		return c.Status(500).JSON(models.Response{
			Success: false,
			Message: "Failed to create repair request",
		})
	}

	database.DB.Model(&models.Device{}).Where("id = ?", request.DeviceID).Update("status", "broken")

	database.DB.Preload("Device").Preload("Reporter").First(&request, request.ID)

	return c.JSON(models.Response{
		Success: true,
		Message: "Repair request created successfully",
		Data:    request,
	})
}

func UpdateRepairRequest(c *fiber.Ctx) error {
	id := c.Params("id")
	var request models.RepairRequest

	if err := database.DB.First(&request, id).Error; err != nil {
		return c.Status(404).JSON(models.Response{
			Success: false,
			Message: "Repair request not found",
		})
	}

	if err := c.BodyParser(&request); err != nil {
		return c.Status(400).JSON(models.Response{
			Success: false,
			Message: "Invalid request",
		})
	}

	database.DB.Save(&request)
	database.DB.Preload("Device").Preload("Reporter").First(&request, id)

	return c.JSON(models.Response{
		Success: true,
		Message: "Repair request updated successfully",
		Data:    request,
	})
}

func CancelRepairRequest(c *fiber.Ctx) error {
	id := c.Params("id")
	var request models.RepairRequest

	if err := database.DB.First(&request, id).Error; err != nil {
		return c.Status(404).JSON(models.Response{
			Success: false,
			Message: "Repair request not found",
		})
	}

	request.Status = "cancelled"
	database.DB.Save(&request)

	return c.JSON(models.Response{
		Success: true,
		Message: "Repair request cancelled successfully",
	})
}
