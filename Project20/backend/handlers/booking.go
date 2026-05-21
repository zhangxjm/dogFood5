package handlers

import (
	"driving-school-backend/config"
	"driving-school-backend/models"

	"github.com/gofiber/fiber/v2"
)

func CreateBooking(c *fiber.Ctx) error {
	type BookingRequest struct {
		ScheduleID uint `json:"schedule_id"`
		StudentID  uint `json:"student_id"`
	}

	var req BookingRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
		})
	}

	var schedule models.Schedule
	if err := config.DB.First(&schedule, req.ScheduleID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"success": false,
			"message": "Schedule not found",
		})
	}

	if schedule.Status != "available" {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "This time slot is not available",
		})
	}

	if schedule.BookedCount >= schedule.MaxStudents {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "This time slot is fully booked",
		})
	}

	var existingBooking models.Booking
	if config.DB.Where("student_id = ? AND schedule_id = ?", req.StudentID, req.ScheduleID).First(&existingBooking).Error == nil {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "You have already booked this time slot",
		})
	}

	booking := models.Booking{
		ScheduleID:  req.ScheduleID,
		StudentID:   req.StudentID,
		CoachID:     schedule.CoachID,
		BookingDate: schedule.Date,
		StartTime:   schedule.StartTime,
		EndTime:     schedule.EndTime,
		Status:      "booked",
	}

	tx := config.DB.Begin()

	if err := tx.Create(&booking).Error; err != nil {
		tx.Rollback()
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Failed to create booking",
		})
	}

	schedule.BookedCount++
	if schedule.BookedCount >= schedule.MaxStudents {
		schedule.Status = "booked"
	}
	if err := tx.Save(&schedule).Error; err != nil {
		tx.Rollback()
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Failed to update schedule",
		})
	}

	tx.Commit()

	tx.Preload("Student").Preload("Coach").Preload("Schedule").First(&booking, booking.ID)

	return c.JSON(fiber.Map{
		"success": true,
		"data":    booking,
		"message": "Booking created successfully",
	})
}

func CancelBooking(c *fiber.Ctx) error {
	bookingID := c.Params("id")

	type CancelRequest struct {
		CancelReason string `json:"cancel_reason"`
	}

	var req CancelRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
		})
	}

	var booking models.Booking
	if err := config.DB.First(&booking, bookingID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"success": false,
			"message": "Booking not found",
		})
	}

	if booking.Status == "cancelled" {
		return c.Status(400).JSON(fiber.Map{
			"success": false,
			"message": "Booking is already cancelled",
		})
	}

	tx := config.DB.Begin()

	booking.Status = "cancelled"
	booking.CancelReason = req.CancelReason
	if err := tx.Save(&booking).Error; err != nil {
		tx.Rollback()
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Failed to cancel booking",
		})
	}

	var schedule models.Schedule
	if err := tx.First(&schedule, booking.ScheduleID).Error; err == nil {
		schedule.BookedCount--
		if schedule.BookedCount < 0 {
			schedule.BookedCount = 0
		}
		if schedule.BookedCount < schedule.MaxStudents && schedule.Status == "booked" {
			schedule.Status = "available"
		}
		tx.Save(&schedule)
	}

	tx.Commit()

	tx.Preload("Student").Preload("Coach").Preload("Schedule").First(&booking, booking.ID)

	return c.JSON(fiber.Map{
		"success": true,
		"data":    booking,
		"message": "Booking cancelled successfully",
	})
}

func GetStudentBookings(c *fiber.Ctx) error {
	studentID := c.Params("studentId")
	status := c.Query("status")

	var bookings []models.Booking
	query := config.DB.Where("student_id = ?", studentID)
	if status != "" {
		query = query.Where("status = ?", status)
	}
	if err := query.Preload("Coach").Preload("Schedule").Order("created_at DESC").Find(&bookings).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Failed to fetch bookings: " + err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    bookings,
	})
}

func GetCoachBookings(c *fiber.Ctx) error {
	coachID := c.Params("coachId")
	status := c.Query("status")

	var bookings []models.Booking
	query := config.DB.Where("coach_id = ?", coachID)
	if status != "" {
		query = query.Where("status = ?", status)
	}
	if err := query.Preload("Student").Preload("Schedule").Order("created_at DESC").Find(&bookings).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"success": false,
			"message": "Failed to fetch bookings: " + err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    bookings,
	})
}

func GetAvailableSchedules(c *fiber.Ctx) error {
	date := c.Query("date")
	coachID := c.Query("coach_id")

	var schedules []models.Schedule
	query := config.DB.Where("status = ?", "available")
	if date != "" {
		query = query.Where("date = ?", date)
	}
	if coachID != "" {
		query = query.Where("coach_id = ?", coachID)
	}
	if err := query.Where("booked_count < max_students").Preload("Coach").Order("date ASC, start_time ASC").Find(&schedules).Error; err != nil {
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
