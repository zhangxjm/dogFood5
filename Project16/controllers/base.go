package controllers

import "github.com/beego/beego/v2/server/web"

type BaseController struct {
	web.Controller
}

func (c *BaseController) Response(code int, msg string, data interface{}) {
	c.Data["json"] = map[string]interface{}{
		"code": code,
		"msg":  msg,
		"data": data,
	}
	c.ServeJSON()
}

func (c *BaseController) Success(data interface{}) {
	c.Response(200, "success", data)
}

func (c *BaseController) Fail(msg string) {
	c.Response(400, msg, nil)
}
