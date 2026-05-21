package main

import (
	_ "warehouse/routers"
	"warehouse/utils"

	beego "github.com/beego/beego/v2/server/web"
)

func main() {
	utils.InitDB()
	utils.InitRedis()

	if beego.BConfig.RunMode == "dev" {
		beego.BConfig.WebConfig.DirectoryIndex = true
		beego.BConfig.WebConfig.StaticDir["/swagger"] = "swagger"
	}

	beego.Run()
}
