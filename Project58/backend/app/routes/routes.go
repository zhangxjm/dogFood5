package routes

import (
	"inspection-system/app/controllers"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")

	pointController := controllers.NewPointController()
	points := api.Group("/points")
	points.Get("/", pointController.GetPoints)
	points.Get("/all", pointController.GetAllPoints)
	points.Get("/:id", pointController.GetPoint)
	points.Post("/", pointController.CreatePoint)
	points.Put("/:id", pointController.UpdatePoint)
	points.Delete("/:id", pointController.DeletePoint)

	recordController := controllers.NewRecordController()
	records := api.Group("/records")
	records.Get("/", recordController.GetRecords)
	records.Get("/:id", recordController.GetRecord)
	records.Post("/", recordController.CreateRecord)
	records.Put("/:id", recordController.UpdateRecord)
	records.Delete("/:id", recordController.DeleteRecord)
	records.Get("/:recordId/rectifications", recordController.GetRectifications)
	records.Post("/:recordId/rectifications", recordController.CreateRectification)

	statsController := controllers.NewStatsController()
	stats := api.Group("/stats")
	stats.Get("/summary", statsController.GetSummary)
	stats.Get("/by-time", statsController.GetStatsByTime)
	stats.Get("/by-point", statsController.GetStatsByPoint)
	stats.Get("/by-type", statsController.GetStatsByType)
	stats.Get("/rectification", statsController.GetRectificationStats)
	stats.Get("/export", statsController.ExportRecords)
}
