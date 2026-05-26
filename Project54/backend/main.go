package main

import (
	"database/sql"
	"dormitory-management/config"
	"dormitory-management/models"
	"dormitory-management/pkg/database"
	"dormitory-management/pkg/seed"
	"dormitory-management/routes"
	"fmt"
	"log"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	_ "gorm.io/driver/mysql"
)

func main() {
	log.Println("========================================")
	log.Println("工地宿舍入住人员管理系统启动中...")
	log.Println("========================================")

	if err := config.LoadConfig(); err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}
	log.Println("Configuration loaded successfully")

	if err := createDatabaseIfNotExists(); err != nil {
		log.Fatalf("Failed to create database: %v", err)
	}

	if err := database.InitDB(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	if err := database.AutoMigrate(
		&models.Dormitory{},
		&models.Room{},
		&models.Bed{},
		&models.Worker{},
		&models.CheckInRecord{},
		&models.CheckOutRecord{},
	); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	if err := seed.SeedData(); err != nil {
		log.Fatalf("Failed to seed data: %v", err)
	}

	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	frontendPath := filepath.Join("..", "frontend")
	r.Static("/static", filepath.Join(frontendPath, "static"))
	r.LoadHTMLGlob(filepath.Join(frontendPath, "templates", "*.html"))

	r.GET("/", func(c *gin.Context) {
		c.HTML(200, "index.html", nil)
	})

	routes.SetupRoutes(r)

	addr := fmt.Sprintf("%s:%s", config.AppConfig.ServerHost, config.AppConfig.ServerPort)
	log.Printf("Server starting on http://%s", addr)
	log.Println("========================================")
	log.Println("系统启动成功！请在浏览器中访问 http://localhost:8080")
	log.Println("========================================")

	if err := r.Run(addr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func createDatabaseIfNotExists() error {
	dsn := config.AppConfig.GetDSNWithoutDB()
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return fmt.Errorf("failed to connect to mysql: %w", err)
	}
	defer db.Close()

	maxRetries := 10
	for i := 0; i < maxRetries; i++ {
		err = db.Ping()
		if err == nil {
			break
		}
		log.Printf("Waiting for MySQL to be ready (attempt %d/%d)...", i+1, maxRetries)
		if i < maxRetries-1 {
			time.Sleep(3 * time.Second)
		}
	}
	if err != nil {
		return fmt.Errorf("mysql not ready after retries: %w", err)
	}

	dbName := config.AppConfig.DBName
	_, err = db.Exec(fmt.Sprintf("CREATE DATABASE IF NOT EXISTS `%s` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci", dbName))
	if err != nil {
		return fmt.Errorf("failed to create database: %w", err)
	}

	log.Printf("Database `%s` is ready", dbName)
	return nil
}
