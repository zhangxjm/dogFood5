package main

import (
	"fmt"
	"homestay/internal/config"
	"homestay/internal/database"
	"homestay/internal/handler"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		panic(fmt.Sprintf("failed to load config: %v", err))
	}

	if err := database.Init(&cfg.Database); err != nil {
		panic(fmt.Sprintf("failed to init database: %v", err))
	}

	r := gin.Default()

	setupRoutes(r)

	fmt.Printf("Server starting on port %d...\n", cfg.Server.Port)
	if err := r.Run(fmt.Sprintf(":%d", cfg.Server.Port)); err != nil {
		panic(fmt.Sprintf("failed to start server: %v", err))
	}
}

func setupRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		roomTypeHandler := handler.NewRoomTypeHandler()
		roomTypeGroup := api.Group("/room-types")
		{
			roomTypeGroup.POST("", roomTypeHandler.Create)
			roomTypeGroup.GET("", roomTypeHandler.List)
			roomTypeGroup.GET("/:id", roomTypeHandler.GetByID)
			roomTypeGroup.PUT("/:id", roomTypeHandler.Update)
			roomTypeGroup.DELETE("/:id", roomTypeHandler.Delete)
		}

		facilityHandler := handler.NewFacilityHandler()
		facilityGroup := api.Group("/facilities")
		{
			facilityGroup.POST("", facilityHandler.Create)
			facilityGroup.GET("", facilityHandler.List)
			facilityGroup.GET("/:id", facilityHandler.GetByID)
			facilityGroup.PUT("/:id", facilityHandler.Update)
			facilityGroup.DELETE("/:id", facilityHandler.Delete)
		}

		roomHandler := handler.NewRoomHandler()
		roomGroup := api.Group("/rooms")
		{
			roomGroup.POST("", roomHandler.Create)
			roomGroup.GET("", roomHandler.List)
			roomGroup.GET("/:id", roomHandler.GetByID)
			roomGroup.PUT("/:id", roomHandler.Update)
			roomGroup.PATCH("/:id/status", roomHandler.UpdateStatus)
			roomGroup.DELETE("/:id", roomHandler.Delete)
			roomGroup.POST("/:id/facilities", roomHandler.AddFacility)
			roomGroup.DELETE("/:id/facilities/:facility_id", roomHandler.RemoveFacility)
		}

		checkInHandler := handler.NewCheckInHandler()
		checkInGroup := api.Group("/checkins")
		{
			checkInGroup.POST("", checkInHandler.Create)
			checkInGroup.GET("", checkInHandler.List)
			checkInGroup.GET("/:id", checkInHandler.GetByID)
			checkInGroup.PUT("/:id", checkInHandler.Update)
			checkInGroup.POST("/:id/checkout", checkInHandler.CheckOut)
			checkInGroup.DELETE("/:id", checkInHandler.Delete)
		}
	}
}
