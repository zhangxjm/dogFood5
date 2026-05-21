package main

import (
	"farm-sales-backend/config"
	"farm-sales-backend/database"
	"farm-sales-backend/handlers"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()

	if err := database.Connect(cfg); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"*"},
		AllowCredentials: true,
	}))

	r.Use(func(c *gin.Context) {
		c.Header("Content-Type", "application/json; charset=utf-8")
		c.Next()
	})

	api := r.Group("/api")
	{
		products := api.Group("/products")
		{
			products.GET("", handlers.GetProducts)
			products.GET("/categories", handlers.GetProductCategories)
			products.GET("/:id", handlers.GetProduct)
			products.POST("", handlers.CreateProduct)
			products.PUT("/:id", handlers.UpdateProduct)
			products.DELETE("/:id", handlers.DeleteProduct)
		}

		customers := api.Group("/customers")
		{
			customers.GET("", handlers.GetCustomers)
			customers.GET("/:id", handlers.GetCustomer)
			customers.GET("/:id/orders", handlers.GetCustomerOrders)
			customers.POST("", handlers.CreateCustomer)
			customers.PUT("/:id", handlers.UpdateCustomer)
			customers.DELETE("/:id", handlers.DeleteCustomer)
		}

		orders := api.Group("/orders")
		{
			orders.GET("", handlers.GetOrders)
			orders.GET("/statuses", handlers.GetOrderStatuses)
			orders.GET("/:id", handlers.GetOrder)
			orders.GET("/:id/logs", handlers.GetOrderStatusLogs)
			orders.POST("", handlers.CreateOrder)
			orders.PUT("/:id/status", handlers.UpdateOrderStatus)
		}

		stats := api.Group("/statistics")
		{
			stats.GET("/dashboard", handlers.GetDashboardStats)
			stats.GET("/sales-by-category", handlers.GetSalesByCategory)
			stats.GET("/sales-by-date", handlers.GetSalesByDate)
			stats.GET("/top-products", handlers.GetTopProducts)
		}
	}

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	log.Printf("Server starting on port %s", cfg.ServerPort)
	if err := r.Run(":" + cfg.ServerPort); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
