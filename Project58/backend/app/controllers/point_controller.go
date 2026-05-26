package controllers

import (
	"inspection-system/app/models"
	"inspection-system/app/services"
	"inspection-system/pkg/utils"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type PointController struct {
	service *services.PointService
}

func NewPointController() *PointController {
	return &PointController{
		service: services.NewPointService(),
	}
}

func (pc *PointController) GetPoints(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	pageSize, _ := strconv.Atoi(c.Query("pageSize", "10"))

	filters := make(map[string]interface{})
	filters["river"] = c.Query("river")
	filters["area"] = c.Query("area")
	filters["name"] = c.Query("name")
	if status := c.Query("status"); status != "" {
		if s, err := strconv.Atoi(status); err == nil {
			filters["status"] = s
		}
	}

	points, total, err := pc.service.GetPoints(filters, page, pageSize)
	if err != nil {
		return utils.ErrorResponse(c, 500, "Failed to get points")
	}

	return utils.SuccessResponse(c, fiber.Map{
		"list":     points,
		"total":    total,
		"page":     page,
		"pageSize": pageSize,
	})
}

func (pc *PointController) GetAllPoints(c *fiber.Ctx) error {
	points, err := pc.service.GetAllPoints()
	if err != nil {
		return utils.ErrorResponse(c, 500, "Failed to get points")
	}
	return utils.SuccessResponse(c, points)
}

func (pc *PointController) GetPoint(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, 400, "Invalid ID")
	}

	point, err := pc.service.GetPointByID(uint(id))
	if err != nil {
		return utils.ErrorResponse(c, 404, "Point not found")
	}

	return utils.SuccessResponse(c, point)
}

func (pc *PointController) CreatePoint(c *fiber.Ctx) error {
	var point models.InspectionPoint
	if err := c.BodyParser(&point); err != nil {
		return utils.ErrorResponse(c, 400, "Invalid request body")
	}

	if err := pc.service.CreatePoint(&point); err != nil {
		return utils.ErrorResponse(c, 500, "Failed to create point")
	}

	return utils.SuccessResponse(c, point)
}

func (pc *PointController) UpdatePoint(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, 400, "Invalid ID")
	}

	var point models.InspectionPoint
	if err := c.BodyParser(&point); err != nil {
		return utils.ErrorResponse(c, 400, "Invalid request body")
	}
	point.ID = uint(id)

	if err := pc.service.UpdatePoint(&point); err != nil {
		return utils.ErrorResponse(c, 500, "Failed to update point")
	}

	return utils.SuccessResponse(c, point)
}

func (pc *PointController) DeletePoint(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, 400, "Invalid ID")
	}

	if err := pc.service.DeletePoint(uint(id)); err != nil {
		return utils.ErrorResponse(c, 500, "Failed to delete point")
	}

	return utils.SuccessResponse(c, nil)
}
