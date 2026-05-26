package routes

import (
	"dormitory-management/controllers"
	"dormitory-management/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	r.Use(middleware.CORS())

	api := r.Group("/api")
	{
		dormitoryController := controllers.NewDormitoryController()
		dormitories := api.Group("/dormitories")
		{
			dormitories.GET("", dormitoryController.GetDormitories)
			dormitories.GET("/:id", dormitoryController.GetDormitory)
			dormitories.POST("", dormitoryController.CreateDormitory)
			dormitories.PUT("/:id", dormitoryController.UpdateDormitory)
			dormitories.DELETE("/:id", dormitoryController.DeleteDormitory)
		}

		rooms := api.Group("/rooms")
		{
			rooms.GET("", dormitoryController.GetRooms)
			rooms.GET("/:id", dormitoryController.GetRoom)
			rooms.POST("", dormitoryController.CreateRoom)
			rooms.PUT("/:id", dormitoryController.UpdateRoom)
			rooms.DELETE("/:id", dormitoryController.DeleteRoom)
		}

		beds := api.Group("/beds")
		{
			beds.GET("", dormitoryController.GetBeds)
			beds.GET("/:id", dormitoryController.GetBed)
		}

		workerController := controllers.NewWorkerController()
		workers := api.Group("/workers")
		{
			workers.GET("", workerController.GetWorkers)
			workers.GET("/:id", workerController.GetWorker)
			workers.POST("", workerController.CreateWorker)
			workers.PUT("/:id", workerController.UpdateWorker)
			workers.DELETE("/:id", workerController.DeleteWorker)
		}

		checkInController := controllers.NewCheckInController()
		checkins := api.Group("/checkins")
		{
			checkins.GET("", checkInController.GetCheckInRecords)
			checkins.GET("/:id", checkInController.GetCheckInRecord)
			checkins.POST("", checkInController.CheckIn)
		}

		checkOutController := controllers.NewCheckOutController()
		checkouts := api.Group("/checkouts")
		{
			checkouts.GET("", checkOutController.GetCheckOutRecords)
			checkouts.GET("/:id", checkOutController.GetCheckOutRecord)
			checkouts.POST("", checkOutController.CheckOut)
		}

		statsController := controllers.NewStatisticsController()
		stats := api.Group("/statistics")
		{
			stats.GET("/overview", statsController.GetOverview)
			stats.GET("/by-dormitory", statsController.GetByDormitory)
			stats.GET("/by-work-type", statsController.GetByWorkType)
			stats.GET("/by-gender", statsController.GetByGender)
			stats.GET("/by-floor", statsController.GetByFloor)
			stats.GET("/recent-checkins", statsController.GetRecentCheckIns)
			stats.GET("/recent-checkouts", statsController.GetRecentCheckOuts)
		}
	}
}
