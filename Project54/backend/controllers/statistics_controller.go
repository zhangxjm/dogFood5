package controllers

import (
	"dormitory-management/models"
	"dormitory-management/pkg/database"
	"dormitory-management/pkg/response"

	"github.com/gin-gonic/gin"
)

type StatisticsController struct{}

func NewStatisticsController() *StatisticsController {
	return &StatisticsController{}
}

type StatisticsData struct {
	TotalDormitories int64 `json:"total_dormitories"`
	TotalRooms       int64 `json:"total_rooms"`
	TotalBeds        int64 `json:"total_beds"`
	OccupiedBeds     int64 `json:"occupied_beds"`
	AvailableBeds    int64 `json:"available_beds"`
	TotalWorkers     int64 `json:"total_workers"`
	LivingWorkers    int64 `json:"living_workers"`
	CheckedOutWorkers int64 `json:"checked_out_workers"`
	OccupancyRate    float64 `json:"occupancy_rate"`
}

type DormitoryStats struct {
	ID            uint   `json:"id"`
	Name          string `json:"name"`
	TotalRooms    int64  `json:"total_rooms"`
	TotalBeds     int64  `json:"total_beds"`
	OccupiedBeds  int64  `json:"occupied_beds"`
	AvailableBeds int64  `json:"available_beds"`
	OccupancyRate float64 `json:"occupancy_rate"`
}

type WorkTypeStats struct {
	WorkType string `json:"work_type"`
	Count    int64  `json:"count"`
}

type GenderStats struct {
	Gender string `json:"gender"`
	Count  int64  `json:"count"`
}

type FloorStats struct {
	Floor         int   `json:"floor"`
	TotalRooms    int64 `json:"total_rooms"`
	TotalBeds     int64 `json:"total_beds"`
	OccupiedBeds  int64 `json:"occupied_beds"`
	AvailableBeds int64 `json:"available_beds"`
}

func (sc *StatisticsController) GetOverview(c *gin.Context) {
	var stats StatisticsData

	database.DB.Model(&models.Dormitory{}).Count(&stats.TotalDormitories)
	database.DB.Model(&models.Room{}).Count(&stats.TotalRooms)
	database.DB.Model(&models.Bed{}).Count(&stats.TotalBeds)
	database.DB.Model(&models.Bed{}).Where("status = ?", models.BedStatusOccupied).Count(&stats.OccupiedBeds)
	database.DB.Model(&models.Bed{}).Where("status = ?", models.BedStatusAvailable).Count(&stats.AvailableBeds)
	database.DB.Model(&models.Worker{}).Count(&stats.TotalWorkers)
	database.DB.Model(&models.Worker{}).Where("status = ?", models.WorkerStatusLiving).Count(&stats.LivingWorkers)
	database.DB.Model(&models.Worker{}).Where("status = ?", models.WorkerStatusCheckedOut).Count(&stats.CheckedOutWorkers)

	if stats.TotalBeds > 0 {
		stats.OccupancyRate = float64(stats.OccupiedBeds) / float64(stats.TotalBeds) * 100
	}

	response.Success(c, stats)
}

func (sc *StatisticsController) GetByDormitory(c *gin.Context) {
	var dormitories []models.Dormitory
	database.DB.Find(&dormitories)

	var stats []DormitoryStats
	for _, d := range dormitories {
		var ds DormitoryStats
		ds.ID = d.ID
		ds.Name = d.Name

		database.DB.Model(&models.Room{}).Where("dormitory_id = ?", d.ID).Count(&ds.TotalRooms)
		database.DB.Model(&models.Bed{}).Joins("JOIN rooms ON beds.room_id = rooms.id").
			Where("rooms.dormitory_id = ?", d.ID).Count(&ds.TotalBeds)
		database.DB.Model(&models.Bed{}).Joins("JOIN rooms ON beds.room_id = rooms.id").
			Where("rooms.dormitory_id = ? AND beds.status = ?", d.ID, models.BedStatusOccupied).Count(&ds.OccupiedBeds)
		database.DB.Model(&models.Bed{}).Joins("JOIN rooms ON beds.room_id = rooms.id").
			Where("rooms.dormitory_id = ? AND beds.status = ?", d.ID, models.BedStatusAvailable).Count(&ds.AvailableBeds)

		if ds.TotalBeds > 0 {
			ds.OccupancyRate = float64(ds.OccupiedBeds) / float64(ds.TotalBeds) * 100
		}

		stats = append(stats, ds)
	}

	response.Success(c, stats)
}

func (sc *StatisticsController) GetByWorkType(c *gin.Context) {
	var stats []WorkTypeStats
	database.DB.Model(&models.Worker{}).Where("status = ?", models.WorkerStatusLiving).
		Select("work_type, COUNT(*) as count").Group("work_type").Scan(&stats)
	response.Success(c, stats)
}

func (sc *StatisticsController) GetByGender(c *gin.Context) {
	var stats []GenderStats
	database.DB.Model(&models.Worker{}).Where("status = ?", models.WorkerStatusLiving).
		Select("gender, COUNT(*) as count").Group("gender").Scan(&stats)
	response.Success(c, stats)
}

func (sc *StatisticsController) GetByFloor(c *gin.Context) {
	dormitoryID := c.Query("dormitory_id")

	var floors []int
	query := database.DB.Model(&models.Room{}).Select("DISTINCT floor")
	if dormitoryID != "" {
		query = query.Where("dormitory_id = ?", dormitoryID)
	}
	query.Order("floor ASC").Pluck("floor", &floors)

	var stats []FloorStats
	for _, floor := range floors {
		var fs FloorStats
		fs.Floor = floor

		roomQuery := database.DB.Model(&models.Room{}).Where("floor = ?", floor)
		if dormitoryID != "" {
			roomQuery = roomQuery.Where("dormitory_id = ?", dormitoryID)
		}
		roomQuery.Count(&fs.TotalRooms)

		bedQuery := database.DB.Model(&models.Bed{}).Joins("JOIN rooms ON beds.room_id = rooms.id").
			Where("rooms.floor = ?", floor)
		if dormitoryID != "" {
			bedQuery = bedQuery.Where("rooms.dormitory_id = ?", dormitoryID)
		}
		bedQuery.Count(&fs.TotalBeds)

		occupiedQuery := database.DB.Model(&models.Bed{}).Joins("JOIN rooms ON beds.room_id = rooms.id").
			Where("rooms.floor = ? AND beds.status = ?", floor, models.BedStatusOccupied)
		if dormitoryID != "" {
			occupiedQuery = occupiedQuery.Where("rooms.dormitory_id = ?", dormitoryID)
		}
		occupiedQuery.Count(&fs.OccupiedBeds)

		fs.AvailableBeds = fs.TotalBeds - fs.OccupiedBeds
		stats = append(stats, fs)
	}

	response.Success(c, stats)
}

func (sc *StatisticsController) GetRecentCheckIns(c *gin.Context) {
	var records []models.CheckInRecord
	database.DB.Preload("Worker").Preload("Bed.Room.Dormitory").
		Order("check_in_date DESC").Limit(10).Find(&records)
	response.Success(c, records)
}

func (sc *StatisticsController) GetRecentCheckOuts(c *gin.Context) {
	var records []models.CheckOutRecord
	database.DB.Preload("Worker").Preload("Bed.Room.Dormitory").
		Order("check_out_date DESC").Limit(10).Find(&records)
	response.Success(c, records)
}
