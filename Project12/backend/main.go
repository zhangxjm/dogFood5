package main

import (
	"material-manage/config"
	"material-manage/routers"
)

func main() {
	config.InitDB()
	defer config.DB.Close()

	r := routers.SetupRouter()
	r.Run(":8080")
}
