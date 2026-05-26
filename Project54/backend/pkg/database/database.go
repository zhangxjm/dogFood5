package database

import (
	"dormitory-management/config"
	"fmt"
	"log"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func InitDB() error {
	var err error
	maxRetries := 10
	retryInterval := 3 * time.Second

	for i := 0; i < maxRetries; i++ {
		dsn := config.AppConfig.GetDSN()
		DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		})
		if err == nil {
			break
		}
		log.Printf("Failed to connect to database (attempt %d/%d): %v", i+1, maxRetries, err)
		log.Printf("Retrying in %v...", retryInterval)
		time.Sleep(retryInterval)
	}

	if err != nil {
		return fmt.Errorf("failed to connect to database after %d attempts: %w", maxRetries, err)
	}

	sqlDB, err := DB.DB()
	if err != nil {
		return fmt.Errorf("failed to get sql DB: %w", err)
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	log.Println("Database connection established successfully")
	return nil
}

func AutoMigrate(models ...interface{}) error {
	err := DB.AutoMigrate(models...)
	if err != nil {
		return fmt.Errorf("failed to auto migrate: %w", err)
	}
	log.Println("Database migration completed successfully")
	return nil
}
