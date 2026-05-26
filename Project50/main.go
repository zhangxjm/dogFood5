package main

import (
	"campus-express/models"
	"campus-express/routers"
	"log"

	beego "github.com/beego/beego/v2/server/web"
	"github.com/beego/beego/v2/server/web/filter/cors"
)

func main() {
	if beego.BConfig.RunMode == "dev" {
		beego.BConfig.Listen.EnableAdmin = true
	}

	models.InitDB()
	models.SeedData()

	beego.InsertFilter("*", beego.BeforeRouter, cors.Allow(&cors.Options{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	routers.InitRouter()

	beego.BConfig.WebConfig.ViewsPath = "views"
	beego.BConfig.WebConfig.Session.SessionOn = true
	beego.BConfig.WebConfig.Session.SessionProvider = "memory"
	beego.BConfig.WebConfig.Session.SessionName = "campus-express"

	log.Println("Server starting on port 8080...")
	beego.Run()
}
