package main

import (
	"hardware-store/database"
	"hardware-store/routes"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	database.Connect()

	r := gin.Default()

	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	routes.SetupRoutes(r)

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "五金小店商品台账管理系统运行正常",
		})
	})

	log.Println("服务器启动成功，监听端口 :8080")
	log.Println("API 文档:")
	log.Println("  GET    /api/products              - 获取所有商品")
	log.Println("  GET    /api/products/:id          - 获取单个商品")
	log.Println("  POST   /api/products              - 创建商品")
	log.Println("  PUT    /api/products/:id          - 更新商品")
	log.Println("  DELETE /api/products/:id          - 删除商品")
	log.Println("  GET    /api/products/alert/low-stock - 库存缺货提醒")
	log.Println("  GET    /health                    - 健康检查")

	err := r.Run(":8080")
	if err != nil {
		log.Fatal("服务器启动失败:", err)
	}
}
