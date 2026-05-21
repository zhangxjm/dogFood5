package controllers

import (
	"net/http"
	"strconv"

	"material-manage/config"
	"material-manage/models"

	"github.com/gin-gonic/gin"
)

func GetMaterials(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))
	keyword := c.Query("keyword")

	materials, total, err := models.GetMaterialList(config.DB, page, pageSize, keyword)
	if err != nil {
		logError(err)
		c.JSON(http.StatusOK, Response{Code: 500, Message: "获取失败: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, Response{Code: 200, Message: "成功", Data: materials, Total: total})
}

func GetAllMaterials(c *gin.Context) {
	materials, err := models.GetAllMaterials(config.DB)
	if err != nil {
		logError(err)
		c.JSON(http.StatusOK, Response{Code: 500, Message: "获取失败: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, Response{Code: 200, Message: "成功", Data: materials})
}

func CreateMaterial(c *gin.Context) {
	var material models.Material
	if err := c.ShouldBindJSON(&material); err != nil {
		logError(err)
		c.JSON(http.StatusOK, Response{Code: 400, Message: "参数错误: " + err.Error()})
		return
	}

	if err := models.CreateMaterial(config.DB, &material); err != nil {
		logError(err)
		c.JSON(http.StatusOK, Response{Code: 500, Message: "创建失败: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, Response{Code: 200, Message: "创建成功", Data: material})
}

func UpdateMaterial(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var material models.Material
	if err := c.ShouldBindJSON(&material); err != nil {
		logError(err)
		c.JSON(http.StatusOK, Response{Code: 400, Message: "参数错误: " + err.Error()})
		return
	}

	if err := models.UpdateMaterial(config.DB, uint(id), &material); err != nil {
		logError(err)
		c.JSON(http.StatusOK, Response{Code: 500, Message: "更新失败: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, Response{Code: 200, Message: "更新成功"})
}

func DeleteMaterial(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := models.DeleteMaterial(config.DB, uint(id)); err != nil {
		logError(err)
		c.JSON(http.StatusOK, Response{Code: 500, Message: "删除失败: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, Response{Code: 200, Message: "删除成功"})
}
