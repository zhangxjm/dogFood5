package routes

import (
	"driving-school-backend/handlers"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")

	api.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"success": true,
			"message": "Server is running",
		})
	})

	coaches := api.Group("/coaches")
	coaches.Get("/", handlers.GetCoaches)
	coaches.Get("/:id/schedules", handlers.GetCoachSchedules)
	coaches.Post("/schedules", handlers.CreateSchedule)
	coaches.Post("/schedules/generate", handlers.GenerateWeeklySchedules)
	coaches.Get("/:coachId/bookings", handlers.GetCoachBookings)
	coaches.Get("/:coachId/records", handlers.GetCoachRecords)

	students := api.Group("/students")
	students.Get("/", handlers.GetStudents)
	students.Get("/:id", handlers.GetStudent)
	students.Post("/", handlers.CreateStudent)
	students.Get("/:studentId/bookings", handlers.GetStudentBookings)
	students.Get("/:studentId/records", handlers.GetStudentRecords)

	bookings := api.Group("/bookings")
	bookings.Post("/", handlers.CreateBooking)
	bookings.Post("/:id/cancel", handlers.CancelBooking)

	schedules := api.Group("/schedules")
	schedules.Get("/available", handlers.GetAvailableSchedules)

	records := api.Group("/records")
	records.Post("/", handlers.CreateTrainingRecord)
	records.Get("/stats", handlers.GetRecordStats)
}
