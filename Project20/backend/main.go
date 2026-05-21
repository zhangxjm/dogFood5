package main

import (
	"driving-school-backend/config"
	"driving-school-backend/models"
	"driving-school-backend/routes"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found")
	}

	config.ConnectDatabase()

	config.DB.AutoMigrate(&models.Coach{}, &models.Student{}, &models.Schedule{}, &models.Booking{}, &models.TrainingRecord{})

	app := fiber.New(fiber.Config{
		AppName: "Driving School Booking System",
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
		AllowHeaders: "*",
	}))

	routes.SetupRoutes(app)

	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(app.Listen(":" + port))
}
