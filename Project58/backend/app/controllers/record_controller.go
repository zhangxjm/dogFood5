package controllers

import (
	"inspection-system/app/models"
	"inspection-system/app/services"
	"inspection-system/pkg/utils"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type RecordController struct {
	service             *services.RecordService
	rectificationService *services.RectificationService
}

func NewRecordController() *RecordController {
	return &RecordController{
		service:             services.NewRecordService(),
		rectificationService: services.NewRectificationService(),
	}
}

func (rc *RecordController) GetRecords(c *fiber.Ctx) error {
	page, _ := strconv.Atoi(c.Query("page", "1"))
	pageSize, _ := strconv.Atoi(c.Query("pageSize", "10"))

	filters := make(map[string]interface{})
	if pointID := c.Query("point_id"); pointID != "" {
		if id, err := strconv.ParseUint(pointID, 10, 32); err == nil {
			filters["point_id"] = uint(id)
		}
	}
	filters["status"] = c.Query("status")
	filters["problem_type"] = c.Query("problem_type")
	filters["start_date"] = c.Query("start_date")
	filters["end_date"] = c.Query("end_date")

	records, total, err := rc.service.GetRecords(filters, page, pageSize)
	if err != nil {
		return utils.ErrorResponse(c, 500, "Failed to get records")
	}

	return utils.SuccessResponse(c, fiber.Map{
		"list":     records,
		"total":    total,
		"page":     page,
		"pageSize": pageSize,
	})
}

func (rc *RecordController) GetRecord(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, 400, "Invalid ID")
	}

	record, err := rc.service.GetRecordByID(uint(id))
	if err != nil {
		return utils.ErrorResponse(c, 404, "Record not found")
	}

	return utils.SuccessResponse(c, record)
}

func (rc *RecordController) CreateRecord(c *fiber.Ctx) error {
	var record models.InspectionRecord
	if err := c.BodyParser(&record); err != nil {
		return utils.ErrorResponse(c, 400, "Invalid request body")
	}
	record.Status = "pending"

	if err := rc.service.CreateRecord(&record); err != nil {
		return utils.ErrorResponse(c, 500, "Failed to create record")
	}

	return utils.SuccessResponse(c, record)
}

func (rc *RecordController) UpdateRecord(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, 400, "Invalid ID")
	}

	var record models.InspectionRecord
	if err := c.BodyParser(&record); err != nil {
		return utils.ErrorResponse(c, 400, "Invalid request body")
	}
	record.ID = uint(id)

	if err := rc.service.UpdateRecord(&record); err != nil {
		return utils.ErrorResponse(c, 500, "Failed to update record")
	}

	return utils.SuccessResponse(c, record)
}

func (rc *RecordController) DeleteRecord(c *fiber.Ctx) error {
	id, err := strconv.ParseUint(c.Params("id"), 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, 400, "Invalid ID")
	}

	if err := rc.service.DeleteRecord(uint(id)); err != nil {
		return utils.ErrorResponse(c, 500, "Failed to delete record")
	}

	return utils.SuccessResponse(c, nil)
}

func (rc *RecordController) GetRectifications(c *fiber.Ctx) error {
	recordID, err := strconv.ParseUint(c.Params("recordId"), 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, 400, "Invalid record ID")
	}

	rectifications, err := rc.rectificationService.GetRectificationsByRecordID(uint(recordID))
	if err != nil {
		return utils.ErrorResponse(c, 500, "Failed to get rectifications")
	}

	return utils.SuccessResponse(c, rectifications)
}

func (rc *RecordController) CreateRectification(c *fiber.Ctx) error {
	recordID, err := strconv.ParseUint(c.Params("recordId"), 10, 32)
	if err != nil {
		return utils.ErrorResponse(c, 400, "Invalid record ID")
	}

	var rect models.RectificationRecord
	if err := c.BodyParser(&rect); err != nil {
		return utils.ErrorResponse(c, 400, "Invalid request body")
	}
	rect.RecordID = uint(recordID)

	if err := rc.rectificationService.CreateRectification(&rect); err != nil {
		return utils.ErrorResponse(c, 500, "Failed to create rectification")
	}

	return utils.SuccessResponse(c, rect)
}
