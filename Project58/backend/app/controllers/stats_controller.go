package controllers

import (
	"inspection-system/app/services"
	"inspection-system/pkg/utils"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
)

type StatsController struct {
	service *services.StatsService
}

func NewStatsController() *StatsController {
	return &StatsController{
		service: services.NewStatsService(),
	}
}

func (sc *StatsController) GetSummary(c *fiber.Ctx) error {
	summary, err := sc.service.GetSummary()
	if err != nil {
		return utils.ErrorResponse(c, 500, "Failed to get summary")
	}
	return utils.SuccessResponse(c, summary)
}

func (sc *StatsController) GetStatsByTime(c *fiber.Ctx) error {
	startDate := c.Query("start_date")
	endDate := c.Query("end_date")

	if startDate == "" {
		startDate = time.Now().AddDate(0, 0, -30).Format("2006-01-02")
	}
	if endDate == "" {
		endDate = time.Now().Format("2006-01-02")
	}

	stats, err := sc.service.GetStatsByTime(startDate, endDate)
	if err != nil {
		return utils.ErrorResponse(c, 500, "Failed to get stats by time")
	}
	return utils.SuccessResponse(c, stats)
}

func (sc *StatsController) GetStatsByPoint(c *fiber.Ctx) error {
	stats, err := sc.service.GetStatsByPoint()
	if err != nil {
		return utils.ErrorResponse(c, 500, "Failed to get stats by point")
	}
	return utils.SuccessResponse(c, stats)
}

func (sc *StatsController) GetStatsByType(c *fiber.Ctx) error {
	stats, err := sc.service.GetStatsByType()
	if err != nil {
		return utils.ErrorResponse(c, 500, "Failed to get stats by type")
	}
	return utils.SuccessResponse(c, stats)
}

func (sc *StatsController) GetRectificationStats(c *fiber.Ctx) error {
	stats, err := sc.service.GetRectificationStats()
	if err != nil {
		return utils.ErrorResponse(c, 500, "Failed to get rectification stats")
	}
	return utils.SuccessResponse(c, stats)
}

func (sc *StatsController) ExportRecords(c *fiber.Ctx) error {
	filters := make(map[string]interface{})
	if pointID := c.Query("point_id"); pointID != "" {
		if id, err := strconv.ParseUint(pointID, 10, 32); err == nil {
			filters["point_id"] = uint(id)
		}
	}
	filters["status"] = c.Query("status")
	filters["start_date"] = c.Query("start_date")
	filters["end_date"] = c.Query("end_date")

	data, err := sc.service.ExportRecords(filters)
	if err != nil {
		return utils.ErrorResponse(c, 500, "Failed to export records")
	}

	c.Set("Content-Type", "text/csv; charset=utf-8")
	c.Set("Content-Disposition", "attachment; filename=inspection_records.csv")
	return c.Send(data)
}
