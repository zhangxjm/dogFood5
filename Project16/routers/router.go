package routers

import (
	"rescue-system/controllers"

	"github.com/beego/beego/v2/server/web"
)

func init() {
	web.Router("/", &controllers.MainController{})
	
	ns := web.NewNamespace("/api",
		web.NSNamespace("/location",
			web.NSRouter("/list", &controllers.LocationController{}, "get:List"),
			web.NSRouter("/add", &controllers.LocationController{}, "post:Add"),
			web.NSRouter("/update", &controllers.LocationController{}, "post:Update"),
			web.NSRouter("/delete", &controllers.LocationController{}, "post:Delete"),
		),
		web.NSNamespace("/volunteer",
			web.NSRouter("/list", &controllers.VolunteerController{}, "get:List"),
			web.NSRouter("/add", &controllers.VolunteerController{}, "post:Add"),
			web.NSRouter("/update", &controllers.VolunteerController{}, "post:Update"),
			web.NSRouter("/delete", &controllers.VolunteerController{}, "post:Delete"),
		),
		web.NSNamespace("/rescue",
			web.NSRouter("/list", &controllers.RescueController{}, "get:List"),
			web.NSRouter("/add", &controllers.RescueController{}, "post:Add"),
			web.NSRouter("/update", &controllers.RescueController{}, "post:Update"),
			web.NSRouter("/delete", &controllers.RescueController{}, "post:Delete"),
		),
		web.NSNamespace("/donation",
			web.NSRouter("/list", &controllers.DonationController{}, "get:List"),
			web.NSRouter("/add", &controllers.DonationController{}, "post:Add"),
			web.NSRouter("/update", &controllers.DonationController{}, "post:Update"),
			web.NSRouter("/delete", &controllers.DonationController{}, "post:Delete"),
		),
	)
	web.AddNamespace(ns)
}
