package routers

import (
	"material-manage/controllers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"*"},
		AllowCredentials: true,
	}))

	api := r.Group("/api")
	{
		materials := api.Group("/materials")
		{
			materials.GET("", controllers.GetMaterials)
			materials.GET("/all", controllers.GetAllMaterials)
			materials.POST("", controllers.CreateMaterial)
			materials.PUT("/:id", controllers.UpdateMaterial)
			materials.DELETE("/:id", controllers.DeleteMaterial)
		}

		teams := api.Group("/teams")
		{
			teams.GET("", controllers.GetTeams)
			teams.GET("/all", controllers.GetAllTeams)
			teams.POST("", controllers.CreateTeam)
			teams.PUT("/:id", controllers.UpdateTeam)
			teams.DELETE("/:id", controllers.DeleteTeam)
		}

		records := api.Group("/records")
		{
			records.GET("", controllers.GetRecords)
			records.POST("", controllers.CreateRecord)
		}
	}

	return r
}
