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

type CheckOutController struct{}

func NewCheckOutController() *CheckOutController {
	return &CheckOutController{}
}

type CheckOutRequest struct {
	WorkerID uint   `json:"worker_id" binding:"required"`
	Reason   string `json:"reason"`
	Remark   string `json:"remark"`
}

func (cc *CheckOutController) GetCheckOutRecords(c *gin.Context) {
	var records []models.CheckOutRecord
	workerID := c.Query("worker_id")
	startDate := c.Query("start_date")
	endDate := c.Query("end_date")

	query := database.DB.Preload("Worker").Preload("Bed.Room.Dormitory").Preload("CheckInRecord")
	if workerID != "" {
		query = query.Where("worker_id = ?", workerID)
	}
	if startDate != "" {
		query = query.Where("check_out_date >= ?", startDate)
	}
	if endDate != "" {
		query = query.Where("check_out_date <= ?", endDate)
	}

	result := query.Order("check_out_date DESC").Find(&records)
	if result.Error != nil {
		response.InternalServerError(c, "获取退宿记录失败: "+result.Error.Error())
		return
	}
	response.Success(c, records)
}

func (cc *CheckOutController) GetCheckOutRecord(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var record models.CheckOutRecord
	result := database.DB.Preload("Worker").Preload("Bed.Room.Dormitory").Preload("CheckInRecord").First(&record, id)
	if result.Error != nil {
		response.NotFound(c, "退宿记录不存在")
		return
	}
	response.Success(c, record)
}

func (cc *CheckOutController) CheckOut(c *gin.Context) {
	var req CheckOutRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "参数错误: "+err.Error())
		return
	}

	checkOutDate := time.Now()

	result := database.DB.Transaction(func(tx *gorm.DB) error {
		var worker models.Worker
		if err := tx.First(&worker, req.WorkerID).Error; err != nil {
			return err
		}

		if worker.CurrentBedID == nil {
			return &customError{"该工人当前没有入住，无法办理退宿"}
		}

		bedID := *worker.CurrentBedID
		var bed models.Bed
		if err := tx.First(&bed, bedID).Error; err != nil {
			return err
		}

		var checkInRecord models.CheckInRecord
		if err := tx.Where("worker_id = ? AND bed_id = ? AND has_checked_out = ?",
			req.WorkerID, bedID, false).First(&checkInRecord).Error; err != nil {
			return err
		}

		actualStayDays := int(checkOutDate.Sub(checkInRecord.CheckInDate).Hours() / 24)
		if actualStayDays < 0 {
			actualStayDays = 0
		}

		checkOutRecord := models.CheckOutRecord{
			WorkerID:       req.WorkerID,
			BedID:          bedID,
			CheckInID:      checkInRecord.ID,
			CheckOutDate:   checkOutDate,
			ActualStayDays: actualStayDays,
			Reason:         req.Reason,
			Remark:         req.Remark,
		}

		if err := tx.Create(&checkOutRecord).Error; err != nil {
			return err
		}

		checkInRecord.HasCheckedOut = true
		if err := tx.Save(&checkInRecord).Error; err != nil {
			return err
		}

		bed.Status = models.BedStatusAvailable
		if err := tx.Save(&bed).Error; err != nil {
			return err
		}

		worker.CurrentBedID = nil
		worker.Status = models.WorkerStatusCheckedOut
		if err := tx.Save(&worker).Error; err != nil {
			return err
		}

		return nil
	})

	if result != nil {
		if ce, ok := result.(*customError); ok {
			response.BadRequest(c, ce.message)
		} else {
			response.InternalServerError(c, "退宿登记失败: "+result.Error())
		}
		return
	}

	response.SuccessMessage(c, "退宿登记成功")
}
