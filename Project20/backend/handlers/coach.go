package handlers

import (
	"driving-school-backend/config"
	"driving-school-backend/models"

	"github.com/gofiber/fiber/v2"
)

func GetCoaches(c *fiber.Ctx) error {
	var coaches []models.Coach
	if err := config.DB.Find(&coaches).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Failed to fetch coaches: " + err.Error(),
		})
	}
	return c.JSON(fiber.Map{
		"success": true,
		"data":    coaches,
	})
}

func GetCoachSchedules(c *fiber.Ctx) error {
	coachID := c.Params("id")
	date := c.Query("date")

	var schedules []models.Schedule
	query := config.DB.Where("coach_id = ?", coachID)
	if date != "" {
		query = query.Where("date = ?", date)
	}
	if err := query.Preload("Coach").Find(&schedules).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Failed to fetch schedules: " + err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    schedules,
	})
}

func CreateSchedule(c *fiber.Ctx) error {
	type CreateScheduleRequest struct {
		CoachID     uint   `json:"coach_id"`
		Date        string `json:"date"`
		StartTime   string `json:"start_time"`
		EndTime     string `json:"end_time"`
		MaxStudents int    `json:"max_students"`
	}

	var req CreateScheduleRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
		})
	}

	schedule := models.Schedule{
		CoachID:     req.CoachID,
		Date:        req.Date,
		StartTime:   req.StartTime,
		EndTime:     req.EndTime,
		MaxStudents: req.MaxStudents,
		Status:      "available",
	}

	if err := config.DB.Create(&schedule).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Failed to create schedule",
		})
	}

	config.DB.Preload("Coach").First(&schedule, schedule.ID)

	return c.JSON(fiber.Map{
		"success": true,
		"data":    schedule,
	})
}

func GenerateWeeklySchedules(c *fiber.Ctx) error {
	type GenerateRequest struct {
		CoachID   uint     `json:"coach_id"`
		StartDate string   `json:"start_date"`
		EndDate   string   `json:"end_date"`
		TimeSlots []string `json:"time_slots"`
	}

	var req GenerateRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
		})
	}

	var createdSchedules []models.Schedule
	
	for _, slot := range req.TimeSlots {
		schedule := models.Schedule{
			CoachID:     req.CoachID,
			Date:        req.StartDate,
			StartTime:   slot,
			EndTime:     slot,
			MaxStudents: 1,
			Status:      "available",
		}
		config.DB.FirstOrCreate(&schedule, models.Schedule{
			CoachID: req.CoachID,
			Date:    req.StartDate,
			StartTime: slot,
		})
		createdSchedules = append(createdSchedules, schedule)
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    createdSchedules,
		"message": "Schedules generated successfully",
	})
}
