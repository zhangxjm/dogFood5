package controllers

import (
	"github.com/beego/beego/v2/server/web"
)

type BaseController struct {
	web.Controller
}

type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func (c *BaseController) Success(data interface{}) {
	c.Data["json"] = Response{
		Code:    200,
		Message: "success",
		Data:    data,
	}
	c.ServeJSON()
}

func (c *BaseController) Error(code int, message string) {
	c.Data["json"] = Response{
		Code:    code,
		Message: message,
		Data:    nil,
	}
	c.ServeJSON()
}
