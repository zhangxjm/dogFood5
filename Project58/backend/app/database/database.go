package database

import (
	"database/sql"
	"fmt"
	"inspection-system/app/models"
	"inspection-system/config"
	"os"
	"path/filepath"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"

	_ "modernc.org/sqlite"
)

var db *gorm.DB
var sqlDB *sql.DB

func InitDB() error {
	dbType := config.AppConfig.DBType

	if dbType == "sqlite" {
		return initSQLite()
	}
	return initMySQL()
}

func initSQLite() error {
	dbPath := config.AppConfig.DBPath

	dir := filepath.Dir(dbPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return fmt.Errorf("failed to create database directory: %w", err)
	}

	var err error
	sqlDB, err = sql.Open("sqlite", dbPath)
	if err != nil {
		return fmt.Errorf("failed to open sqlite database: %w", err)
	}

	db, err = gorm.Open(sqlite.Dialector{
		Conn: sqlDB,
	}, &gorm.Config{})
	if err != nil {
		sqlDB.Close()
		return fmt.Errorf("failed to connect to sqlite database: %w", err)
	}

	sqlDB.SetMaxIdleConns(1)
	sqlDB.SetMaxOpenConns(1)
	sqlDB.SetConnMaxLifetime(time.Hour)

	fmt.Println("SQLite database connected successfully")
	return nil
}

func initMySQL() error {
	host := config.AppConfig.DBHost
	port := config.AppConfig.DBPort
	user := config.AppConfig.DBUser
	password := config.AppConfig.DBPassword
	dbname := config.AppConfig.DBName

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		user, password, host, port, dbname)

	var err error
	maxRetries := 10
	retryInterval := 3 * time.Second

	for i := 0; i < maxRetries; i++ {
		db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
		if err == nil {
			sqlDB, err := db.DB()
			if err != nil {
				return fmt.Errorf("failed to get database instance: %w", err)
			}
			sqlDB.SetMaxIdleConns(10)
			sqlDB.SetMaxOpenConns(100)
			sqlDB.SetConnMaxLifetime(time.Hour)
			fmt.Println("MySQL database connected successfully")
			return nil
		}
		fmt.Printf("Failed to connect to database (attempt %d/%d): %v\n", i+1, maxRetries, err)
		if i < maxRetries-1 {
			time.Sleep(retryInterval)
		}
	}

	return fmt.Errorf("failed to connect to database after %d attempts: %w", maxRetries, err)
}

func AutoMigrate() error {
	if db == nil {
		return fmt.Errorf("database not initialized")
	}

	dbType := config.AppConfig.DBType
	if dbType == "sqlite" {
		return autoMigrateSQLite()
	}

	return db.AutoMigrate(
		&models.InspectionPoint{},
		&models.InspectionRecord{},
		&models.RectificationRecord{},
	)
}

func autoMigrateSQLite() error {
	if sqlDB == nil {
		return fmt.Errorf("sql database not initialized")
	}

	statements := []string{
		`CREATE TABLE IF NOT EXISTS inspection_points (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			location TEXT NOT NULL,
			river TEXT NOT NULL,
			longitude REAL DEFAULT 0,
			latitude REAL DEFAULT 0,
			area TEXT,
			status INTEGER DEFAULT 1,
			description TEXT,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS inspection_records (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			point_id INTEGER NOT NULL,
			inspection_time DATETIME NOT NULL,
			inspector TEXT NOT NULL,
			problem_type TEXT NOT NULL,
			description TEXT NOT NULL,
			severity TEXT,
			photo_url TEXT,
			status TEXT DEFAULT 'pending',
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)`,
		`CREATE TABLE IF NOT EXISTS rectification_records (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			record_id INTEGER NOT NULL,
			measures TEXT NOT NULL,
			rectification_time DATETIME,
			person_in_charge TEXT,
			after_photo_url TEXT,
			status TEXT DEFAULT 'processing',
			remarks TEXT,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)`,
	}

	for _, stmt := range statements {
		_, err := sqlDB.Exec(stmt)
		if err != nil {
			return fmt.Errorf("failed to execute migration: %w", err)
		}
	}

	return nil
}

func GetDB() *gorm.DB {
	return db
}

func GetSQLDB() *sql.DB {
	return sqlDB
}
