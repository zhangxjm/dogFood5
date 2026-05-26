package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"

	"inspection-system/app/database"
	"inspection-system/app/middleware"
	"inspection-system/app/routes"
	"inspection-system/config"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func getFrontendPath() string {
	cwd, err := os.Getwd()
	if err != nil {
		return "./frontend"
	}

	paths := []string{
		filepath.Join(cwd, "frontend"),
		filepath.Join(cwd, "..", "frontend"),
		"./frontend",
		"../frontend",
	}

	for _, p := range paths {
		if _, err := os.Stat(p); err == nil {
			return p
		}
	}

	return "./frontend"
}

func main() {
	config.Load()

	if err := database.InitDB(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	if err := database.AutoMigrate(); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}
	fmt.Println("Database migrated successfully")

	if err := database.SeedData(); err != nil {
		log.Fatalf("Failed to seed data: %v", err)
	}
	fmt.Println("Database seeded successfully")

	app := fiber.New(fiber.Config{
		AppName: "河道周边环境巡查记录系统",
	})

	app.Use(middleware.CORS())
	app.Use(logger.New())
	app.Use(recover.New())

	frontendPath := getFrontendPath()
	fmt.Printf("Serving frontend from: %s\n", frontendPath)
	app.Static("/", frontendPath, fiber.Static{
		Index: "index.html",
	})

	routes.SetupRoutes(app)

	port := config.AppConfig.ServerPort
	fmt.Println("========================================")
	fmt.Println("River Inspection System is starting...")
	fmt.Printf("Please visit: http://localhost:%s\n", port)
	fmt.Println("========================================")
	log.Fatal(app.Listen(":" + port))
}
