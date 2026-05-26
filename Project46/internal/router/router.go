package router

import (
	"agri-tool-management/internal/handler"
	"agri-tool-management/internal/repository"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRouter(db *gorm.DB) *gin.Engine {
	r := gin.Default()

	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})

	r.Static("/static", "./web/static")
	r.LoadHTMLGlob("web/templates/*.html")

	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})
	r.GET("/tools", func(c *gin.Context) {
		c.HTML(http.StatusOK, "tools.html", nil)
	})
	r.GET("/purchases", func(c *gin.Context) {
		c.HTML(http.StatusOK, "purchases.html", nil)
	})
	r.GET("/repairs", func(c *gin.Context) {
		c.HTML(http.StatusOK, "repairs.html", nil)
	})
	r.GET("/inventory", func(c *gin.Context) {
		c.HTML(http.StatusOK, "inventory.html", nil)
	})

	api := r.Group("/api")
	{
		dashboardRepo := repository.NewDashboardRepository(db)
		dashboardHandler := handler.NewDashboardHandler(dashboardRepo)
		api.GET("/dashboard/stats", dashboardHandler.GetStats)

		categoryRepo := repository.NewToolCategoryRepository(db)
		categoryHandler := handler.NewToolCategoryHandler(categoryRepo)
		categoryAPI := api.Group("/categories")
		{
			categoryAPI.GET("", categoryHandler.GetAll)
			categoryAPI.GET("/:id", categoryHandler.GetByID)
			categoryAPI.POST("", categoryHandler.Create)
			categoryAPI.PUT("/:id", categoryHandler.Update)
			categoryAPI.DELETE("/:id", categoryHandler.Delete)
		}

		toolRepo := repository.NewToolRepository(db)
		toolHandler := handler.NewToolHandler(toolRepo)
		toolAPI := api.Group("/tools")
		{
			toolAPI.GET("", toolHandler.GetAll)
			toolAPI.GET("/:id", toolHandler.GetByID)
			toolAPI.GET("/category/:category_id", toolHandler.GetByCategoryID)
			toolAPI.GET("/stock/low", toolHandler.GetLowStock)
			toolAPI.POST("", toolHandler.Create)
			toolAPI.PUT("/:id", toolHandler.Update)
			toolAPI.DELETE("/:id", toolHandler.Delete)
		}

		farmerRepo := repository.NewFarmerRepository(db)
		farmerHandler := handler.NewFarmerHandler(farmerRepo)
		farmerAPI := api.Group("/farmers")
		{
			farmerAPI.GET("", farmerHandler.GetAll)
			farmerAPI.GET("/search", farmerHandler.SearchByName)
			farmerAPI.GET("/:id", farmerHandler.GetByID)
			farmerAPI.POST("", farmerHandler.Create)
			farmerAPI.PUT("/:id", farmerHandler.Update)
			farmerAPI.DELETE("/:id", farmerHandler.Delete)
		}

		purchaseRepo := repository.NewPurchaseRepository(db)
		purchaseHandler := handler.NewPurchaseHandler(purchaseRepo)
		purchaseAPI := api.Group("/purchases")
		{
			purchaseAPI.GET("", purchaseHandler.GetAll)
			purchaseAPI.GET("/filter", purchaseHandler.GetByDateRange)
			purchaseAPI.GET("/farmer/:farmer_id", purchaseHandler.GetByFarmerID)
			purchaseAPI.GET("/:id", purchaseHandler.GetByID)
			purchaseAPI.POST("", purchaseHandler.Create)
			purchaseAPI.PUT("/:id", purchaseHandler.Update)
			purchaseAPI.DELETE("/:id", purchaseHandler.Delete)
		}

		repairRepo := repository.NewRepairRepository(db)
		repairHandler := handler.NewRepairHandler(repairRepo)
		repairAPI := api.Group("/repairs")
		{
			repairAPI.GET("", repairHandler.GetAll)
			repairAPI.GET("/status", repairHandler.GetByStatus)
			repairAPI.GET("/:id", repairHandler.GetByID)
			repairAPI.POST("", repairHandler.Create)
			repairAPI.PUT("/:id", repairHandler.Update)
			repairAPI.DELETE("/:id", repairHandler.Delete)
		}

		inventoryRepo := repository.NewInventoryRepository(db)
		inventoryHandler := handler.NewInventoryHandler(inventoryRepo)
		inventoryAPI := api.Group("/inventory")
		{
			inventoryAPI.GET("", inventoryHandler.GetAll)
			inventoryAPI.GET("/filter", inventoryHandler.GetByDateRange)
			inventoryAPI.GET("/:id", inventoryHandler.GetByID)
			inventoryAPI.POST("", inventoryHandler.Create)
			inventoryAPI.PUT("/:id", inventoryHandler.Update)
			inventoryAPI.DELETE("/:id", inventoryHandler.Delete)
		}
	}

	return r
}
