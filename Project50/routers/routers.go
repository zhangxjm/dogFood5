package routers

import (
	"campus-express/controllers"

	beego "github.com/beego/beego/v2/server/web"
)

func InitRouter() {
	beego.Router("/", &controllers.MainController{})
	beego.Router("/stats", &controllers.StatsController{}, "get:Get")

	beego.Router("/couriers", &controllers.CourierController{}, "get:List;post:Add")
	beego.Router("/couriers/:id", &controllers.CourierController{}, "put:Update;delete:Delete")

	beego.Router("/express", &controllers.ExpressController{}, "get:List;post:Add")
	beego.Router("/express/:id", &controllers.ExpressController{}, "get:GetOne;put:Update;delete:Delete")
	beego.Router("/express/:id/assign", &controllers.ExpressController{}, "post:Assign")
	beego.Router("/express/:id/complete", &controllers.ExpressController{}, "post:Complete")

	beego.Router("/records", &controllers.RecordController{}, "get:List")

	beego.SetStaticPath("/static", "static")
}
