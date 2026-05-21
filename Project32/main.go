package main

import (
	"employee-access-system/database"
	"employee-access-system/handlers"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	if err := database.InitDB(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	r := gin.Default()

	r.Static("/static", "./static")
	r.LoadHTMLGlob("static/*.html")

	r.GET("/", func(c *gin.Context) {
		c.HTML(200, "index.html", nil)
	})

	api := r.Group("/api")
	{
		employees := api.Group("/employees")
		{
			employees.POST("", handlers.CreateEmployee)
			employees.GET("", handlers.GetAllEmployees)
			employees.GET("/:id", handlers.GetEmployee)
			employees.PUT("/:id", handlers.UpdateEmployee)
			employees.DELETE("/:id", handlers.DeleteEmployee)
		}

		visitors := api.Group("/visitors")
		{
			visitors.POST("", handlers.CreateVisitor)
			visitors.GET("", handlers.GetAllVisitors)
			visitors.GET("/:id", handlers.GetVisitor)
			visitors.PUT("/:id", handlers.UpdateVisitor)
			visitors.DELETE("/:id", handlers.DeleteVisitor)
		}

		access := api.Group("/access")
		{
			access.POST("/employee", handlers.EmployeeAccess)
			access.POST("/visitor", handlers.VisitorAccess)
			access.GET("/records", handlers.GetAccessRecords)
		}
	}

	log.Println("Server starting on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
