package controllers

import (
	"net/http"
	"strconv"

	"material-manage/config"
	"material-manage/models"

	"github.com/gin-gonic/gin"
)

func GetTeams(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))

	teams, total, err := models.GetTeamList(config.DB, page, pageSize)
	if err != nil {
		logError(err)
		c.JSON(http.StatusOK, Response{Code: 500, Message: "获取失败: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, Response{Code: 200, Message: "成功", Data: teams, Total: total})
}

func GetAllTeams(c *gin.Context) {
	teams, err := models.GetAllTeams(config.DB)
	if err != nil {
		logError(err)
		c.JSON(http.StatusOK, Response{Code: 500, Message: "获取失败: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, Response{Code: 200, Message: "成功", Data: teams})
}

func CreateTeam(c *gin.Context) {
	var team models.Team
	if err := c.ShouldBindJSON(&team); err != nil {
		logError(err)
		c.JSON(http.StatusOK, Response{Code: 400, Message: "参数错误: " + err.Error()})
		return
	}

	if err := models.CreateTeam(config.DB, &team); err != nil {
		logError(err)
		c.JSON(http.StatusOK, Response{Code: 500, Message: "创建失败: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, Response{Code: 200, Message: "创建成功", Data: team})
}

func UpdateTeam(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var team models.Team
	if err := c.ShouldBindJSON(&team); err != nil {
		logError(err)
		c.JSON(http.StatusOK, Response{Code: 400, Message: "参数错误: " + err.Error()})
		return
	}

	if err := models.UpdateTeam(config.DB, uint(id), &team); err != nil {
		logError(err)
		c.JSON(http.StatusOK, Response{Code: 500, Message: "更新失败: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, Response{Code: 200, Message: "更新成功"})
}

func DeleteTeam(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := models.DeleteTeam(config.DB, uint(id)); err != nil {
		logError(err)
		c.JSON(http.StatusOK, Response{Code: 500, Message: "删除失败: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, Response{Code: 200, Message: "删除成功"})
}
