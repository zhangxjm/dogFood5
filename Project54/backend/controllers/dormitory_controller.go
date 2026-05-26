package controllers

import (
	"dormitory-management/models"
	"dormitory-management/pkg/database"
	"dormitory-management/pkg/response"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type DormitoryController struct{}

func NewDormitoryController() *DormitoryController {
	return &DormitoryController{}
}

func (dc *DormitoryController) GetDormitories(c *gin.Context) {
	var dormitories []models.Dormitory
	result := database.DB.Preload("Rooms.Beds").Find(&dormitories)
	if result.Error != nil {
		response.InternalServerError(c, "获取宿舍楼列表失败: "+result.Error.Error())
		return
	}
	response.Success(c, dormitories)
}

func (dc *DormitoryController) GetDormitory(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var dormitory models.Dormitory
	result := database.DB.Preload("Rooms.Beds").First(&dormitory, id)
	if result.Error != nil {
		response.NotFound(c, "宿舍楼不存在")
		return
	}
	response.Success(c, dormitory)
}

func (dc *DormitoryController) CreateDormitory(c *gin.Context) {
	var dormitory models.Dormitory
	if err := c.ShouldBindJSON(&dormitory); err != nil {
		response.BadRequest(c, "参数错误: "+err.Error())
		return
	}

	result := database.DB.Create(&dormitory)
	if result.Error != nil {
		response.InternalServerError(c, "创建宿舍楼失败: "+result.Error.Error())
		return
	}
	response.Success(c, dormitory)
}

func (dc *DormitoryController) UpdateDormitory(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var dormitory models.Dormitory
	if err := database.DB.First(&dormitory, id).Error; err != nil {
		response.NotFound(c, "宿舍楼不存在")
		return
	}

	if err := c.ShouldBindJSON(&dormitory); err != nil {
		response.BadRequest(c, "参数错误: "+err.Error())
		return
	}

	database.DB.Save(&dormitory)
	response.Success(c, dormitory)
}

func (dc *DormitoryController) DeleteDormitory(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	result := database.DB.Delete(&models.Dormitory{}, id)
	if result.Error != nil {
		response.InternalServerError(c, "删除宿舍楼失败: "+result.Error.Error())
		return
	}
	response.SuccessMessage(c, "删除成功")
}

func (dc *DormitoryController) GetRooms(c *gin.Context) {
	var rooms []models.Room
	dormitoryID := c.Query("dormitory_id")
	floor := c.Query("floor")

	query := database.DB.Preload("Dormitory").Preload("Beds")
	if dormitoryID != "" {
		query = query.Where("dormitory_id = ?", dormitoryID)
	}
	if floor != "" {
		query = query.Where("floor = ?", floor)
	}

	result := query.Find(&rooms)
	if result.Error != nil {
		response.InternalServerError(c, "获取房间列表失败: "+result.Error.Error())
		return
	}
	response.Success(c, rooms)
}

func (dc *DormitoryController) GetRoom(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var room models.Room
	result := database.DB.Preload("Dormitory").Preload("Beds").First(&room, id)
	if result.Error != nil {
		response.NotFound(c, "房间不存在")
		return
	}

	for i := range room.Beds {
		var worker models.Worker
		database.DB.Where("current_bed_id = ?", room.Beds[i].ID).First(&worker)
		if worker.ID > 0 {
			room.Beds[i].CurrentWorker = &worker
		}
	}

	response.Success(c, room)
}

func (dc *DormitoryController) CreateRoom(c *gin.Context) {
	var room models.Room
	if err := c.ShouldBindJSON(&room); err != nil {
		response.BadRequest(c, "参数错误: "+err.Error())
		return
	}

	result := database.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&room).Error; err != nil {
			return err
		}

		for i := 1; i <= room.BedCount; i++ {
			bed := models.Bed{
				RoomID: room.ID,
				BedNo:  strconv.Itoa(i) + "号床",
				Status: models.BedStatusAvailable,
			}
			if err := tx.Create(&bed).Error; err != nil {
				return err
			}
		}
		return nil
	})

	if result != nil {
		response.InternalServerError(c, "创建房间失败: "+result.Error())
		return
	}
	response.Success(c, room)
}

func (dc *DormitoryController) UpdateRoom(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var room models.Room
	if err := database.DB.First(&room, id).Error; err != nil {
		response.NotFound(c, "房间不存在")
		return
	}

	if err := c.ShouldBindJSON(&room); err != nil {
		response.BadRequest(c, "参数错误: "+err.Error())
		return
	}

	database.DB.Save(&room)
	response.Success(c, room)
}

func (dc *DormitoryController) DeleteRoom(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	result := database.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("room_id = ?", id).Delete(&models.Bed{}).Error; err != nil {
			return err
		}
		if err := tx.Delete(&models.Room{}, id).Error; err != nil {
			return err
		}
		return nil
	})

	if result != nil {
		response.InternalServerError(c, "删除房间失败: "+result.Error())
		return
	}
	response.SuccessMessage(c, "删除成功")
}

func (dc *DormitoryController) GetBeds(c *gin.Context) {
	var beds []models.Bed
	roomID := c.Query("room_id")
	status := c.Query("status")

	query := database.DB.Preload("Room.Dormitory")
	if roomID != "" {
		query = query.Where("room_id = ?", roomID)
	}
	if status != "" {
		query = query.Where("status = ?", status)
	}

	result := query.Find(&beds)
	if result.Error != nil {
		response.InternalServerError(c, "获取床位列表失败: "+result.Error.Error())
		return
	}

	for i := range beds {
		var worker models.Worker
		database.DB.Where("current_bed_id = ?", beds[i].ID).First(&worker)
		if worker.ID > 0 {
			beds[i].CurrentWorker = &worker
		}
	}

	response.Success(c, beds)
}

func (dc *DormitoryController) GetBed(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var bed models.Bed
	result := database.DB.Preload("Room.Dormitory").First(&bed, id)
	if result.Error != nil {
		response.NotFound(c, "床位不存在")
		return
	}

	var worker models.Worker
	database.DB.Where("current_bed_id = ?", bed.ID).First(&worker)
	if worker.ID > 0 {
		bed.CurrentWorker = &worker
	}

	response.Success(c, bed)
}
