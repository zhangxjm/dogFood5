package controllers

import (
	"dormitory-management/models"
	"dormitory-management/pkg/database"
	"dormitory-management/pkg/response"
	"strconv"

	"github.com/gin-gonic/gin"
)

type WorkerController struct{}

func NewWorkerController() *WorkerController {
	return &WorkerController{}
}

func (wc *WorkerController) GetWorkers(c *gin.Context) {
	var workers []models.Worker
	status := c.Query("status")
	workType := c.Query("work_type")
	teamName := c.Query("team_name")
	keyword := c.Query("keyword")

	query := database.DB.Preload("CurrentBed.Room.Dormitory")
	if status != "" {
		query = query.Where("status = ?", status)
	}
	if workType != "" {
		query = query.Where("work_type = ?", workType)
	}
	if teamName != "" {
		query = query.Where("team_name LIKE ?", "%"+teamName+"%")
	}
	if keyword != "" {
		query = query.Where("name LIKE ? OR phone LIKE ? OR id_card LIKE ?",
			"%"+keyword+"%", "%"+keyword+"%", "%"+keyword+"%")
	}

	result := query.Find(&workers)
	if result.Error != nil {
		response.InternalServerError(c, "获取工人列表失败: "+result.Error.Error())
		return
	}
	response.Success(c, workers)
}

func (wc *WorkerController) GetWorker(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var worker models.Worker
	result := database.DB.Preload("CurrentBed.Room.Dormitory").First(&worker, id)
	if result.Error != nil {
		response.NotFound(c, "工人不存在")
		return
	}
	response.Success(c, worker)
}

func (wc *WorkerController) CreateWorker(c *gin.Context) {
	var worker models.Worker
	if err := c.ShouldBindJSON(&worker); err != nil {
		response.BadRequest(c, "参数错误: "+err.Error())
		return
	}

	if worker.Status == "" {
		worker.Status = models.WorkerStatusCheckedOut
	}

	result := database.DB.Create(&worker)
	if result.Error != nil {
		response.InternalServerError(c, "创建工人信息失败: "+result.Error.Error())
		return
	}
	response.Success(c, worker)
}

func (wc *WorkerController) UpdateWorker(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var worker models.Worker
	if err := database.DB.First(&worker, id).Error; err != nil {
		response.NotFound(c, "工人不存在")
		return
	}

	if err := c.ShouldBindJSON(&worker); err != nil {
		response.BadRequest(c, "参数错误: "+err.Error())
		return
	}

	worker.ID = uint(id)
	database.DB.Save(&worker)
	response.Success(c, worker)
}

func (wc *WorkerController) DeleteWorker(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var worker models.Worker
	if err := database.DB.First(&worker, id).Error; err != nil {
		response.NotFound(c, "工人不存在")
		return
	}

	if worker.CurrentBedID != nil {
		response.BadRequest(c, "该工人当前仍在入住，请先办理退宿")
		return
	}

	result := database.DB.Delete(&worker)
	if result.Error != nil {
		response.InternalServerError(c, "删除工人信息失败: "+result.Error.Error())
		return
	}
	response.SuccessMessage(c, "删除成功")
}
