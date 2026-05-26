package handlers

import (
	"door-window-system/database"
	"door-window-system/models"
	"time"

	"github.com/gofiber/fiber/v2"
)

func GetIndex(c *fiber.Ctx) error {
	return c.Render("index", fiber.Map{
		"Title": "门窗安装工单管理系统",
	}, "layouts/main")
}

func GetWorkOrders(c *fiber.Ctx) error {
	var orders []models.WorkOrder
	status := c.Query("status")
	keyword := c.Query("keyword")

	query := database.DB

	if status != "" && status != "all" {
		query = query.Where("status = ?", status)
	}

	if keyword != "" {
		query = query.Where("order_no LIKE ? OR customer_name LIKE ? OR address LIKE ?",
			"%"+keyword+"%", "%"+keyword+"%", "%"+keyword+"%")
	}

	result := query.Order("created_at DESC").Find(&orders)
	if result.Error != nil {
		return c.Status(500).JSON(fiber.Map{"error": result.Error.Error()})
	}

	return c.JSON(orders)
}

func GetWorkOrder(c *fiber.Ctx) error {
	id := c.Params("id")
	var order models.WorkOrder

	result := database.DB.First(&order, id)
	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Order not found"})
	}

	return c.JSON(order)
}

func CreateWorkOrder(c *fiber.Ctx) error {
	var order models.WorkOrder

	if err := c.BodyParser(&order); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	if order.OrderNo == "" {
		order.OrderNo = generateOrderNo()
	}

	if order.Status == "" {
		order.Status = "pending"
	}

	result := database.DB.Create(&order)
	if result.Error != nil {
		return c.Status(500).JSON(fiber.Map{"error": result.Error.Error()})
	}

	return c.JSON(order)
}

func UpdateWorkOrder(c *fiber.Ctx) error {
	id := c.Params("id")
	var order models.WorkOrder

	result := database.DB.First(&order, id)
	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Order not found"})
	}

	var updateData models.WorkOrder
	if err := c.BodyParser(&updateData); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	updates := map[string]interface{}{
		"customer_name": updateData.CustomerName,
		"phone":         updateData.Phone,
		"address":        updateData.Address,
		"product_type":   updateData.ProductType,
		"quantity":       updateData.Quantity,
		"status":         updateData.Status,
		"feedback":       updateData.Feedback,
		"install_date":    updateData.InstallDate,
	}

	if updateData.Status == "completed" && order.CompleteDate == nil {
		now := time.Now()
		updates["complete_date"] = &now
	}

	database.DB.Model(&order).Updates(updates)

	database.DB.First(&order, id)
	return c.JSON(order)
}

func DeleteWorkOrder(c *fiber.Ctx) error {
	id := c.Params("id")
	var order models.WorkOrder

	result := database.DB.First(&order, id)
	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Order not found"})
	}

	database.DB.Delete(&order)
	return c.JSON(fiber.Map{"message": "Order deleted successfully"})
}

func UpdateStatus(c *fiber.Ctx) error {
	id := c.Params("id")
	var order models.WorkOrder

	result := database.DB.First(&order, id)
	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Order not found"})
	}

	var data struct {
		Status string `json:"status"`
	}
	if err := c.BodyParser(&data); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	updates := map[string]interface{}{
		"status": data.Status,
	}

	if data.Status == "completed" {
		now := time.Now()
		updates["complete_date"] = &now
	}

	database.DB.Model(&order).Updates(updates)

	database.DB.First(&order, id)
	return c.JSON(order)
}

func generateOrderNo() string {
	now := time.Now()
	return "WO" + now.Format("20060102150405")
}
