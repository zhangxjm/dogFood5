package utils

import (
	"context"
	"fmt"
	"log"

	beego "github.com/beego/beego/v2/server/web"
	"github.com/redis/go-redis/v9"
)

var RedisClient *redis.Client
var Ctx = context.Background()

func InitRedis() {
	host, _ := beego.AppConfig.String("redis::redis_host")
	port, _ := beego.AppConfig.String("redis::redis_port")
	password, _ := beego.AppConfig.String("redis::redis_password")
	db, _ := beego.AppConfig.Int("redis::redis_db")

	RedisClient = redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", host, port),
		Password: password,
		DB:       db,
	})

	_, err := RedisClient.Ping(Ctx).Result()
	if err != nil {
		log.Printf("Warning: Failed to connect to Redis: %v", err)
	} else {
		log.Println("Redis connection established successfully")
	}
}
