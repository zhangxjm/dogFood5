package main

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type User struct {
	ID       uint   `gorm:"primaryKey"`
	Username string `gorm:"unique;not null"`
	Password string `gorm:"not null"`
	RealName string `gorm:"not null"`
	Phone    string
	Role     string `gorm:"default:'user'"`
}

type Device struct {
	ID           uint   `gorm:"primaryKey"`
	DeviceCode   string `gorm:"unique;not null"`
	DeviceName   string `gorm:"not null"`
	DeviceType   string `gorm:"not null"`
	Location     string
	PurchaseDate string
	Status       string `gorm:"default:'normal'"`
	Description  string
}

func main() {
	err := godotenv.Load("../.env")
	if err != nil {
		log.Println("Warning: .env file not found")
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect:", err)
	}

	password := "123456"
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal("Failed to hash password:", err)
	}
	passwordHash := string(hash)

	db.Exec("TRUNCATE TABLE users")
	users := []User{
		{Username: "admin", Password: passwordHash, RealName: "系统管理员", Phone: "13800138000", Role: "admin"},
		{Username: "user1", Password: passwordHash, RealName: "张三", Phone: "13800138001", Role: "user"},
		{Username: "tech1", Password: passwordHash, RealName: "李工", Phone: "13800138002", Role: "technician"},
		{Username: "tech2", Password: passwordHash, RealName: "王工", Phone: "13800138003", Role: "technician"},
	}
	db.Create(&users)
	fmt.Println("Users inserted successfully")

	db.Exec("TRUNCATE TABLE devices")
	devices := []Device{
		{DeviceCode: "DEV001", DeviceName: "联想笔记本电脑", DeviceType: "电脑设备", Location: "办公室A101", PurchaseDate: "2023-01-15", Status: "normal", Description: "ThinkPad X1 Carbon"},
		{DeviceCode: "DEV002", DeviceName: "HP激光打印机", DeviceType: "打印设备", Location: "办公室A101", PurchaseDate: "2023-03-20", Status: "normal", Description: "HP LaserJet Pro M404dn"},
		{DeviceCode: "DEV003", DeviceName: "戴尔台式机", DeviceType: "电脑设备", Location: "办公室B201", PurchaseDate: "2023-02-10", Status: "broken", Description: "Dell OptiPlex 7090"},
		{DeviceCode: "DEV004", DeviceName: "投影机", DeviceType: "显示设备", Location: "会议室301", PurchaseDate: "2022-12-01", Status: "normal", Description: "Epson CB-X50"},
		{DeviceCode: "DEV005", DeviceName: "复印机", DeviceType: "打印设备", Location: "办公室B202", PurchaseDate: "2023-04-05", Status: "normal", Description: "Canon iR-ADV C3720"},
	}
	db.Create(&devices)
	fmt.Println("Devices inserted successfully")

	fmt.Println("Data initialization completed!")
}
