package main

import (
	_ "rescue-system/routers"
	"rescue-system/models"

	"github.com/beego/beego/v2/server/web"
)

func main() {
	models.InitDB()
	web.SetStaticPath("/static", "static")
	web.Run()
}
