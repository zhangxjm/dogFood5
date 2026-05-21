package controllers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"repair-system-backend/database"
	"repair-system-backend/models"
)

func GetTechnicians(c *fiber.Ctx) error {
	var technicians []models.User
	database.DB.Where("role = ?", "technician").Find(&technicians)

	return c.JSON(models.Response{
		Success: true,
		Data:    technicians,
	})
}

func CreateAssignment(c *fiber.Ctx) error {
	user := c.Locals("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	assignerID := uint(claims["user_id"].(float64))

	var assignment models.RepairAssignment
	if err := c.BodyParser(&assignment); err != nil {
		return c.Status(400).JSON(models.Response{
			Success: false,
			Message: "Invalid request",
		})
	}

	assignment.AssignerID = assignerID
	assignment.AssignTime = time.Now()

	if err := database.DB.Create(&assignment).Error; err != nil {
		return c.Status(500).JSON(models.Response{
			Success: false,
			Message: "Failed to create assignment",
		})
	}

	database.DB.Model(&models.RepairRequest{}).Where("id = ?", assignment.RequestID).Update("status", "assigned")

	var record models.RepairRecord
	record.RequestID = assignment.RequestID
	record.TechnicianID = assignment.TechnicianID
	record.Status = "processing"
	database.DB.Create(&record)

	database.DB.Preload("Request.Device").Preload("Technician").Preload("Assigner").First(&assignment, assignment.ID)

	return c.JSON(models.Response{
		Success: true,
		Message: "Assignment created successfully",
		Data:    assignment,
	})
}

func GetAssignments(c *fiber.Ctx) error {
	var assignments []models.RepairAssignment
	query := database.DB.Preload("Request.Device").Preload("Technician").Preload("Assigner")

	technicianID := c.Query("technician_id")
	if technicianID != "" {
		query = query.Where("technician_id = ?", technicianID)
	}

	query.Find(&assignments)

	return c.JSON(models.Response{
		Success: true,
		Data:    assignments,
	})
}
