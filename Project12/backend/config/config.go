package config

import (
	"fmt"
	"log"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

var DB *gorm.DB

func InitDB() {
	dsn := "material_user:material_pass@tcp(127.0.0.1:3306)/material_manage?charset=utf8mb4&parseTime=True&loc=Local"
	var err error
	DB, err = gorm.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	DB.Exec("SET NAMES utf8mb4")
	DB.Exec("SET CHARACTER SET utf8mb4")

	fmt.Println("Database connected successfully")

	DB.DB().SetMaxIdleConns(10)
	DB.DB().SetMaxOpenConns(100)
}
