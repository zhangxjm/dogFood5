package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DBType     string
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	DBPath     string
	ServerPort string
}

var AppConfig *Config

func Load() {
	err := godotenv.Load()
	if err != nil {
		err = godotenv.Load(".env.local")
		if err != nil {
			log.Println("Warning: No .env or .env.local file found, using environment variables")
		}
	}

	AppConfig = &Config{
		DBType:     getEnv("DB_TYPE", "sqlite"),
		DBHost:     getEnv("DB_HOST", "127.0.0.1"),
		DBPort:     getEnv("DB_PORT", "3306"),
		DBUser:     getEnv("DB_USER", "root"),
		DBPassword: getEnv("DB_PASSWORD", "root123456"),
		DBName:     getEnv("DB_NAME", "inspection_db"),
		DBPath:     getEnv("DB_PATH", "./data/inspection.db"),
		ServerPort: getEnv("SERVER_PORT", "8080"),
	}
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
