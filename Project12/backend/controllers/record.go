package controllers

import (
	"net/http"
	"strconv"

	"material-manage/config"
	"material-manage/models"

	"github.com/gin-gonic/gin"
)

func GetRecords(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))
	materialID, _ := strconv.Atoi(c.DefaultQuery("material_id", "0"))
	teamID, _ := strconv.Atoi(c.DefaultQuery("team_id", "0"))
	recordType, _ := strconv.Atoi(c.DefaultQuery("type", "0"))
	startDate := c.Query("start_date")
	endDate := c.Query("end_date")

	records, total, err := models.GetRecordList(config.DB, page, pageSize, materialID, teamID, recordType, startDate, endDate)
	if err != nil {
		logError(err)
		c.JSON(http.StatusOK, Response{Code: 500, Message: "获取失败: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, Response{Code: 200, Message: "成功", Data: records, Total: total})
}

func CreateRecord(c *gin.Context) {
	var record models.Record
	if err := c.ShouldBindJSON(&record); err != nil {
		logError(err)
		c.JSON(http.StatusOK, Response{Code: 400, Message: "参数错误: " + err.Error()})
		return
	}

	if err := models.CreateRecord(config.DB, &record); err != nil {
		logError(err)
		c.JSON(http.StatusOK, Response{Code: 500, Message: "创建失败: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, Response{Code: 200, Message: "创建成功", Data: record})
}
