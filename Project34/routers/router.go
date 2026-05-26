package routers

import (
	beego "github.com/beego/beego/v2/server/web"
	"warehouse-system/controllers"
)

func init() {
	beego.Router("/", &controllers.MainController{})

	beego.Router("/warehouse-areas", &controllers.WarehouseAreaController{}, "get:List")
	beego.Router("/warehouse-areas/add", &controllers.WarehouseAreaController{}, "post:Add")
	beego.Router("/warehouse-areas/delete/:id", &controllers.WarehouseAreaController{}, "get:Delete")

	beego.Router("/materials", &controllers.MaterialController{}, "get:List")
	beego.Router("/materials/add", &controllers.MaterialController{}, "post:Add")
	beego.Router("/materials/delete/:id", &controllers.MaterialController{}, "get:Delete")

	beego.Router("/records", &controllers.MaterialRecordController{}, "get:List")
	beego.Router("/records/in", &controllers.MaterialRecordController{}, "post:In")
	beego.Router("/records/out", &controllers.MaterialRecordController{}, "post:Out")

	beego.SetStaticPath("/static", "static")
}
