package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

func Success(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, Response{
		Code:    200,
		Message: "操作成功",
		Data:    data,
	})
}

func SuccessMessage(c *gin.Context, message string) {
	c.JSON(http.StatusOK, Response{
		Code:    200,
		Message: message,
	})
}

func Error(c *gin.Context, code int, message string) {
	c.JSON(http.StatusOK, Response{
		Code:    code,
		Message: message,
	})
}

func BadRequest(c *gin.Context, message string) {
	Error(c, 400, message)
}

func InternalServerError(c *gin.Context, message string) {
	Error(c, 500, message)
}

func NotFound(c *gin.Context, message string) {
	Error(c, 404, message)
}
