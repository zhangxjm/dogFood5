package main

import (
	"hardware-shop/database"
	"hardware-shop/handlers"
	"hardware-shop/models"
	"log"
	"os"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {
	maxRetries := 10
	for i := 0; i < maxRetries; i++ {
		err := database.InitDB()
		if err == nil {
			break
		}
		log.Printf("Database connection attempt %d/%d failed: %v", i+1, maxRetries, err)
		if i < maxRetries-1 {
			time.Sleep(5 * time.Second)
		} else {
			log.Fatal("Failed to connect to database after maximum retries")
		}
	}

	db := database.GetDB()
	db.AutoMigrate(&models.Product{}, &models.StockLog{}, &models.PriceHistory{})

	if err := models.SeedData(db); err != nil {
		log.Printf("Warning: Failed to seed initial data: %v", err)
	}

	r := gin.Default()

	r.LoadHTMLGlob("templates/*")
	r.Static("/static", "./static")

	r.GET("/", handlers.IndexPage)
	r.GET("/products/new", handlers.NewProductPage)
	r.GET("/products/edit/:id", handlers.EditProductPage)
	r.GET("/stock", handlers.StockPage)
	r.GET("/logs", handlers.LogsPage)

	api := r.Group("/api")
	{
		api.GET("/products", handlers.GetProducts)
		api.GET("/products/:id", handlers.GetProduct)
		api.POST("/products", handlers.CreateProduct)
		api.PUT("/products/:id", handlers.UpdateProduct)
		api.DELETE("/products/:id", handlers.DeleteProduct)

		api.POST("/products/:id/restock", handlers.RestockProduct)
		api.POST("/products/:id/sell", handlers.SellProduct)

		api.GET("/stock/alerts", handlers.GetStockAlerts)
		api.GET("/logs", handlers.GetStockLogs)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s...", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server: ", err)
	}
}
