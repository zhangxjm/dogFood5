package controllers

import (
	"dormitory-management/models"
	"dormitory-management/pkg/database"
	"dormitory-management/pkg/response"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CheckInController struct{}

func NewCheckInController() *CheckInController {
	return &CheckInController{}
}

type CheckInRequest struct {
	WorkerID         uint      `json:"worker_id" binding:"required"`
	BedID            uint      `json:"bed_id" binding:"required"`
	CheckInDate      string    `json:"check_in_date" binding:"required"`
	ExpectedStayDays int       `json:"expected_stay_days"`
	Remark           string    `json:"remark"`
}

func (cc *CheckInController) GetCheckInRecords(c *gin.Context) {
	var records []models.CheckInRecord
	workerID := c.Query("worker_id")
	bedID := c.Query("bed_id")
	hasCheckedOut := c.Query("has_checked_out")

	query := database.DB.Preload("Worker").Preload("Bed.Room.Dormitory")
	if workerID != "" {
		query = query.Where("worker_id = ?", workerID)
	}
	if bedID != "" {
		query = query.Where("bed_id = ?", bedID)
	}
	if hasCheckedOut != "" {
		query = query.Where("has_checked_out = ?", hasCheckedOut)
	}

	result := query.Order("check_in_date DESC").Find(&records)
	if result.Error != nil {
		response.InternalServerError(c, "获取入住记录失败: "+result.Error.Error())
		return
	}
	response.Success(c, records)
}

func (cc *CheckInController) GetCheckInRecord(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var record models.CheckInRecord
	result := database.DB.Preload("Worker").Preload("Bed.Room.Dormitory").First(&record, id)
	if result.Error != nil {
		response.NotFound(c, "入住记录不存在")
		return
	}
	response.Success(c, record)
}

func (cc *CheckInController) CheckIn(c *gin.Context) {
	var req CheckInRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "参数错误: "+err.Error())
		return
	}

	checkInDate, err := time.Parse("2006-01-02", req.CheckInDate)
	if err != nil {
		response.BadRequest(c, "日期格式错误，请使用 YYYY-MM-DD 格式")
		return
	}

	result := database.DB.Transaction(func(tx *gorm.DB) error {
		var worker models.Worker
		if err := tx.First(&worker, req.WorkerID).Error; err != nil {
			return err
		}

		if worker.CurrentBedID != nil {
			return &customError{"该工人当前已在入住，请先办理退宿"}
		}

		var bed models.Bed
		if err := tx.First(&bed, req.BedID).Error; err != nil {
			return err
		}

		if bed.Status != models.BedStatusAvailable {
			return &customError{"该床位已被占用，请选择其他床位"}
		}

		record := models.CheckInRecord{
			WorkerID:         req.WorkerID,
			BedID:            req.BedID,
			CheckInDate:      checkInDate,
			ExpectedStayDays: req.ExpectedStayDays,
			Remark:           req.Remark,
			HasCheckedOut:    false,
		}

		if err := tx.Create(&record).Error; err != nil {
			return err
		}

		bed.Status = models.BedStatusOccupied
		if err := tx.Save(&bed).Error; err != nil {
			return err
		}

		worker.CurrentBedID = &bed.ID
		worker.Status = models.WorkerStatusLiving
		if err := tx.Save(&worker).Error; err != nil {
			return err
		}

		return nil
	})

	if result != nil {
		if ce, ok := result.(*customError); ok {
			response.BadRequest(c, ce.message)
		} else {
			response.InternalServerError(c, "入住登记失败: "+result.Error())
		}
		return
	}

	response.SuccessMessage(c, "入住登记成功")
}

type customError struct {
	message string
}

func (e *customError) Error() string {
	return e.message
}
