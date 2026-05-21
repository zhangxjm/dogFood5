package routers

import (
	"warehouse/controllers"

	beego "github.com/beego/beego/v2/server/web"
)

func init() {
	ns := beego.NewNamespace("/api",
		beego.NSNamespace("/warehouse-area",
			beego.NSRouter("/list", &controllers.WarehouseAreaController{}, "get:List"),
			beego.NSRouter("/:id", &controllers.WarehouseAreaController{}, "get:Get"),
			beego.NSRouter("/", &controllers.WarehouseAreaController{}, "post:Create"),
			beego.NSRouter("/:id", &controllers.WarehouseAreaController{}, "put:Update"),
			beego.NSRouter("/:id", &controllers.WarehouseAreaController{}, "delete:Delete"),
			beego.NSRouter("/:id/status", &controllers.WarehouseAreaController{}, "put:UpdateStatus"),
		),
		beego.NSNamespace("/material",
			beego.NSRouter("/list", &controllers.MaterialController{}, "get:List"),
			beego.NSRouter("/:id", &controllers.MaterialController{}, "get:Get"),
			beego.NSRouter("/", &controllers.MaterialController{}, "post:Create"),
			beego.NSRouter("/:id", &controllers.MaterialController{}, "put:Update"),
			beego.NSRouter("/:id", &controllers.MaterialController{}, "delete:Delete"),
			beego.NSRouter("/:id/status", &controllers.MaterialController{}, "put:UpdateStatus"),
		),
		beego.NSNamespace("/inventory",
			beego.NSRouter("/list", &controllers.InventoryController{}, "get:List"),
			beego.NSRouter("/:id", &controllers.InventoryController{}, "get:Get"),
			beego.NSRouter("/inbound", &controllers.InventoryController{}, "post:Inbound"),
			beego.NSRouter("/outbound", &controllers.InventoryController{}, "post:Outbound"),
			beego.NSRouter("/statistics", &controllers.InventoryController{}, "get:Statistics"),
		),
	)
	beego.AddNamespace(ns)

	beego.SetStaticPath("/static", "static")
	beego.Router("/", &controllers.MainController{})
}
