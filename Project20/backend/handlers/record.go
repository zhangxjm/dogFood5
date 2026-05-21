package handlers

import (
	"driving-school-backend/config"
	"driving-school-backend/models"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
)

func CreateTrainingRecord(c *fiber.Ctx) error {
	type RecordRequest struct {
		BookingID     uint   `json:"booking_id"`
		SubjectType   string `json:"subject_type"`
		CoachFeedback string `json:"coach_feedback"`
	}

	var req RecordRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
		})
	}

	var booking models.Booking
	if err := config.DB.Preload("Student").Preload("Coach").First(&booking, req.BookingID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"success": false,
			"message": "Booking not found",
		})
	}

	startTime, _ := time.Parse("15:04:05", booking.StartTime)
	endTime, _ := time.Parse("15:04:05", booking.EndTime)
	duration := int(endTime.Sub(startTime).Minutes())

	record := models.TrainingRecord{
		BookingID:     req.BookingID,
		StudentID:     booking.StudentID,
		CoachID:       booking.CoachID,
		TrainingDate:  booking.BookingDate,
		StartTime:     booking.StartTime,
		EndTime:       booking.EndTime,
		Duration:      duration,
		SubjectType:   req.SubjectType,
		CoachFeedback: req.CoachFeedback,
	}

	tx := config.DB.Begin()

	if err := tx.Create(&record).Error; err != nil {
		tx.Rollback()
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Failed to create training record",
		})
	}

	booking.Status = "completed"
	if err := tx.Save(&booking).Error; err != nil {
		tx.Rollback()
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Failed to update booking status",
		})
	}

	tx.Commit()

	tx.Preload("Student").Preload("Coach").Preload("Booking").First(&record, record.ID)

	return c.JSON(fiber.Map{
		"success": true,
		"data":    record,
		"message": "Training record created successfully",
	})
}

func GetStudentRecords(c *fiber.Ctx) error {
	studentID := c.Params("studentId")
	page, _ := strconv.Atoi(c.Query("page", "1"))
	pageSize, _ := strconv.Atoi(c.Query("page_size", "10"))

	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 10
	}

	offset := (page - 1) * pageSize

	var records []models.TrainingRecord
	var total int64

	if err := config.DB.Model(&models.TrainingRecord{}).Where("student_id = ?", studentID).Count(&total).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Failed to count records: " + err.Error(),
		})
	}
	if err := config.DB.Where("student_id = ?", studentID).
		Preload("Student").
		Preload("Coach").
		Preload("Booking").
		Order("created_at DESC").
		Limit(pageSize).
		Offset(offset).
		Find(&records).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Failed to fetch records: " + err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data": fiber.Map{
			"records":   records,
			"total":     total,
			"page":      page,
			"page_size": pageSize,
		},
	})
}

func GetCoachRecords(c *fiber.Ctx) error {
	coachID := c.Params("coachId")
	page, _ := strconv.Atoi(c.Query("page", "1"))
	pageSize, _ := strconv.Atoi(c.Query("page_size", "10"))

	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 10
	}

	offset := (page - 1) * pageSize

	var records []models.TrainingRecord
	var total int64

	if err := config.DB.Model(&models.TrainingRecord{}).Where("coach_id = ?", coachID).Count(&total).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Failed to count records: " + err.Error(),
		})
	}
	if err := config.DB.Where("coach_id = ?", coachID).
		Preload("Student").
		Preload("Coach").
		Preload("Booking").
		Order("created_at DESC").
		Limit(pageSize).
		Offset(offset).
		Find(&records).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Failed to fetch records: " + err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data": fiber.Map{
			"records":   records,
			"total":     total,
			"page":      page,
			"page_size": pageSize,
		},
	})
}

func GetRecordStats(c *fiber.Ctx) error {
	studentID := c.Query("student_id")
	coachID := c.Query("coach_id")

	var totalRecords int64
	var totalDuration int64

	query := config.DB.Model(&models.TrainingRecord{})

	if studentID != "" {
		query = query.Where("student_id = ?", studentID)
	}
	if coachID != "" {
		query = query.Where("coach_id = ?", coachID)
	}

	if err := query.Count(&totalRecords).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Failed to count records: " + err.Error(),
		})
	}

	var records []models.TrainingRecord
	if err := query.Find(&records).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Failed to fetch records: " + err.Error(),
		})
	}
	for _, r := range records {
		totalDuration += int64(r.Duration)
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data": fiber.Map{
			"total_records":   totalRecords,
			"total_duration":  totalDuration,
			"total_hours":     float64(totalDuration) / 60,
		},
	})
}
