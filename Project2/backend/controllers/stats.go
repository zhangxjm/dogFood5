package controllers

import (
	"github.com/gofiber/fiber/v2"
	"repair-system-backend/database"
	"repair-system-backend/models"
)

func GetStats(c *fiber.Ctx) error {
	var deviceCount int64
	database.DB.Model(&models.Device{}).Count(&deviceCount)

	var pendingCount int64
	database.DB.Model(&models.RepairRequest{}).Where("status = ?", "pending").Count(&pendingCount)

	var repairingCount int64
	database.DB.Model(&models.RepairRequest{}).Where("status = ?", "repairing").Count(&repairingCount)

	var completedCount int64
	database.DB.Model(&models.RepairRequest{}).Where("status = ?", "completed").Count(&completedCount)

	var totalCost float64
	database.DB.Model(&models.RepairRecord{}).Select("COALESCE(SUM(cost), 0)").Scan(&totalCost)

	type FaultTypeStats struct {
		FaultType string `json:"fault_type"`
		Count     int64  `json:"count"`
	}
	var faultTypeStats []FaultTypeStats
	database.DB.Model(&models.RepairRequest{}).Select("fault_type, COUNT(*) as count").Group("fault_type").Scan(&faultTypeStats)

	type DeviceTypeStats struct {
		DeviceType string `json:"device_type"`
		Count      int64  `json:"count"`
	}
	var deviceTypeStats []DeviceTypeStats
	database.DB.Model(&models.Device{}).Select("device_type, COUNT(*) as count").Group("device_type").Scan(&deviceTypeStats)

	type MonthlyStats struct {
		Month string `json:"month"`
		Count int64  `json:"count"`
	}
	var monthlyStats []MonthlyStats
	database.DB.Model(&models.RepairRequest{}).Select("DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count").Group("month").Order("month DESC").Limit(6).Scan(&monthlyStats)

	return c.JSON(models.Response{
		Success: true,
		Data: fiber.Map{
			"devices":         deviceCount,
			"pending":         pendingCount,
			"repairing":       repairingCount,
			"completed":       completedCount,
			"total_cost":      totalCost,
			"fault_type_stats": faultTypeStats,
			"device_type_stats": deviceTypeStats,
			"monthly_stats":    monthlyStats,
		},
	})
}
