package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	ServerHost string
	ServerPort string
}

var AppConfig *Config

func LoadConfig() error {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Warning: .env file not found, using environment variables")
	}

	AppConfig = &Config{
		DBHost:     getEnv("DB_HOST", "127.0.0.1"),
		DBPort:     getEnv("DB_PORT", "3306"),
		DBUser:     getEnv("DB_USER", "root"),
		DBPassword: getEnv("DB_PASSWORD", "123456"),
		DBName:     getEnv("DB_NAME", "dormitory_db"),
		ServerHost: getEnv("SERVER_HOST", "0.0.0.0"),
		ServerPort: getEnv("SERVER_PORT", "8080"),
	}

	return nil
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

func (c *Config) GetDSN() string {
	return fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local&timeout=30s&readTimeout=30s&writeTimeout=30s",
		c.DBUser, c.DBPassword, c.DBHost, c.DBPort, c.DBName)
}

func (c *Config) GetDSNWithoutDB() string {
	return fmt.Sprintf("%s:%s@tcp(%s:%s)/?charset=utf8mb4&parseTime=True&loc=Local&timeout=30s&readTimeout=30s&writeTimeout=30s",
		c.DBUser, c.DBPassword, c.DBHost, c.DBPort)
}
