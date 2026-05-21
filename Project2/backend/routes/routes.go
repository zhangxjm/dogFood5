package routes

import (
	"os"

	"github.com/gofiber/fiber/v2"
	jwtware "github.com/gofiber/contrib/jwt"
	"repair-system-backend/controllers"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")

	api.Post("/login", controllers.Login)

	protected := api.Group("", jwtware.New(jwtware.Config{
		SigningKey: jwtware.SigningKey{Key: []byte(os.Getenv("JWT_SECRET"))},
	}))

	protected.Get("/me", controllers.GetCurrentUser)

	device := protected.Group("/devices")
	device.Get("/", controllers.GetDevices)
	device.Get("/:id", controllers.GetDevice)
	device.Post("/", controllers.CreateDevice)
	device.Put("/:id", controllers.UpdateDevice)
	device.Delete("/:id", controllers.DeleteDevice)

	request := protected.Group("/repair-requests")
	request.Get("/", controllers.GetRepairRequests)
	request.Get("/:id", controllers.GetRepairRequest)
	request.Post("/", controllers.CreateRepairRequest)
	request.Put("/:id", controllers.UpdateRepairRequest)
	request.Post("/:id/cancel", controllers.CancelRepairRequest)

	assignment := protected.Group("/assignments")
	assignment.Get("/technicians", controllers.GetTechnicians)
	assignment.Get("/", controllers.GetAssignments)
	assignment.Post("/", controllers.CreateAssignment)

	record := protected.Group("/records")
	record.Get("/", controllers.GetRepairRecords)
	record.Get("/:id", controllers.GetRepairRecord)
	record.Post("/:id/start", controllers.StartRepair)
	record.Post("/:id/complete", controllers.CompleteRepair)

	stats := protected.Group("/stats")
	stats.Get("/", controllers.GetStats)
}
