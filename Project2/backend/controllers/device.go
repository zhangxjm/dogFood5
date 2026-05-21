package controllers

import (
	"github.com/gofiber/fiber/v2"
	"repair-system-backend/database"
	"repair-system-backend/models"
)

func GetDevices(c *fiber.Ctx) error {
	var devices []models.Device
	query := database.DB

	deviceType := c.Query("type")
	if deviceType != "" {
		query = query.Where("device_type = ?", deviceType)
	}

	status := c.Query("status")
	if status != "" {
		query = query.Where("status = ?", status)
	}

	search := c.Query("search")
	if search != "" {
		query = query.Where("device_name LIKE ? OR device_code LIKE ?", "%"+search+"%", "%"+search+"%")
	}

	query.Find(&devices)

	return c.JSON(models.Response{
		Success: true,
		Data:    devices,
	})
}

func GetDevice(c *fiber.Ctx) error {
	id := c.Params("id")
	var device models.Device

	if err := database.DB.First(&device, id).Error; err != nil {
		return c.Status(404).JSON(models.Response{
			Success: false,
			Message: "Device not found",
		})
	}

	return c.JSON(models.Response{
		Success: true,
		Data:    device,
	})
}

func CreateDevice(c *fiber.Ctx) error {
	var device models.Device
	if err := c.BodyParser(&device); err != nil {
		return c.Status(400).JSON(models.Response{
			Success: false,
			Message: "Invalid request",
		})
	}

	if err := database.DB.Create(&device).Error; err != nil {
		return c.Status(500).JSON(models.Response{
			Success: false,
			Message: "Failed to create device",
		})
	}

	return c.JSON(models.Response{
		Success: true,
		Message: "Device created successfully",
		Data:    device,
	})
}

func UpdateDevice(c *fiber.Ctx) error {
	id := c.Params("id")
	var device models.Device

	if err := database.DB.First(&device, id).Error; err != nil {
		return c.Status(404).JSON(models.Response{
			Success: false,
			Message: "Device not found",
		})
	}

	if err := c.BodyParser(&device); err != nil {
		return c.Status(400).JSON(models.Response{
			Success: false,
			Message: "Invalid request",
		})
	}

	database.DB.Save(&device)

	return c.JSON(models.Response{
		Success: true,
		Message: "Device updated successfully",
		Data:    device,
	})
}

func DeleteDevice(c *fiber.Ctx) error {
	id := c.Params("id")
	var device models.Device

	if err := database.DB.First(&device, id).Error; err != nil {
		return c.Status(404).JSON(models.Response{
			Success: false,
			Message: "Device not found",
		})
	}

	database.DB.Delete(&device)

	return c.JSON(models.Response{
		Success: true,
		Message: "Device deleted successfully",
	})
}
