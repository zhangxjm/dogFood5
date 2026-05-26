package main

import (
	"door-window-system/database"
	"door-window-system/handlers"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html/v2"
)

func main() {
	database.Init()

	engine := html.New("./views", ".html")

	app := fiber.New(fiber.Config{
		Views: engine,
	})

	app.Static("/static", "./static")

	app.Get("/", handlers.GetIndex)

	api := app.Group("/api")

	api.Get("/orders", handlers.GetWorkOrders)
	api.Get("/orders/:id", handlers.GetWorkOrder)
	api.Post("/orders", handlers.CreateWorkOrder)
	api.Put("/orders/:id", handlers.UpdateWorkOrder)
	api.Delete("/orders/:id", handlers.DeleteWorkOrder)
	api.Patch("/orders/:id/status", handlers.UpdateStatus)

	log.Println("Server starting on http://localhost:8080")
	log.Fatal(app.Listen(":8080"))
}
