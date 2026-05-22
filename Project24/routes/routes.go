package routes

import (
	"fishing-store/controllers"
	"net/http"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
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

	r.Static("/static", "./static")

	r.GET("/", func(c *gin.Context) {
		c.File("./static/index.html")
	})

	api := r.Group("/api")
	{
		api.GET("/dashboard/stats", controllers.GetDashboardStats)
		api.GET("/alerts/restock", controllers.GetRestockAlerts)
		api.POST("/products/:id/restock", controllers.RestockProduct)

		categories := api.Group("/categories")
		{
			categories.GET("", controllers.GetCategories)
			categories.GET("/:id", controllers.GetCategory)
			categories.POST("", controllers.CreateCategory)
			categories.PUT("/:id", controllers.UpdateCategory)
			categories.DELETE("/:id", controllers.DeleteCategory)
		}

		products := api.Group("/products")
		{
			products.GET("", controllers.GetProducts)
			products.GET("/:id", controllers.GetProduct)
			products.POST("", controllers.CreateProduct)
			products.PUT("/:id", controllers.UpdateProduct)
			products.DELETE("/:id", controllers.DeleteProduct)
		}

		customers := api.Group("/customers")
		{
			customers.GET("", controllers.GetCustomers)
			customers.GET("/:id", controllers.GetCustomer)
			customers.POST("", controllers.CreateCustomer)
			customers.PUT("/:id", controllers.UpdateCustomer)
			customers.DELETE("/:id", controllers.DeleteCustomer)
		}

		purchases := api.Group("/purchases")
		{
			purchases.GET("", controllers.GetPurchaseRecords)
			purchases.GET("/:id", controllers.GetPurchaseRecord)
			purchases.POST("", controllers.CreatePurchaseRecord)
			purchases.DELETE("/:id", controllers.DeletePurchaseRecord)
		}
	}

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"message": "Fishing Store API is running",
		})
	})

	return r
}
