package handlers

import (
	"farm-sales-backend/database"
	"farm-sales-backend/models"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/shopspring/decimal"
)

func GetOrders(c *gin.Context) {
	var orders []models.Order
	status := c.Query("status")

	query := database.DB.Preload("Customer").Preload("OrderItems")
	if status != "" {
		query = query.Where("status = ?", status)
	}

	if err := query.Order("created_at DESC").Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": orders})
}

func GetOrder(c *gin.Context) {
	id := c.Param("id")
	var order models.Order
	if err := database.DB.Preload("Customer").Preload("OrderItems").First(&order, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": order})
}

func CreateOrder(c *gin.Context) {
	var input struct {
		CustomerID   uint64                  `json:"customer_id" binding:"required"`
		Address      string                  `json:"address"`
		Phone        string                  `json:"phone"`
		ReceiverName string                  `json:"receiver_name"`
		Remark       string                  `json:"remark"`
		Items        []models.OrderItem `json:"items" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	orderNo := fmt.Sprintf("ORD%s%06d", time.Now().Format("20060102"), time.Now().Unix()%1000000)

	totalAmount := decimal.Zero
	for i := range input.Items {
		input.Items[i].Subtotal = input.Items[i].Price.Mul(decimal.NewFromInt(int64(input.Items[i].Quantity)))
		totalAmount = totalAmount.Add(input.Items[i].Subtotal)
	}

	tx := database.DB.Begin()

	order := models.Order{
		OrderNo:      orderNo,
		CustomerID:   input.CustomerID,
		TotalAmount:  totalAmount,
		Status:       "pending",
		Address:      input.Address,
		Phone:        input.Phone,
		ReceiverName: input.ReceiverName,
		Remark:       input.Remark,
	}

	if err := tx.Create(&order).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	for i := range input.Items {
		input.Items[i].OrderID = order.ID
		if err := tx.Create(&input.Items[i]).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	statusLog := models.OrderStatusLog{
		OrderID:   order.ID,
		OldStatus: "",
		NewStatus: "pending",
		Remark:    "订单创建",
	}
	if err := tx.Create(&statusLog).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	tx.Commit()

	database.DB.Preload("Customer").Preload("OrderItems").First(&order, order.ID)
	c.JSON(http.StatusCreated, gin.H{"data": order})
}

func UpdateOrderStatus(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		Status string `json:"status" binding:"required"`
		Remark string `json:"remark"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var order models.Order
	if err := database.DB.First(&order, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	oldStatus := order.Status

	tx := database.DB.Begin()

	order.Status = input.Status
	if err := tx.Save(&order).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	statusLog := models.OrderStatusLog{
		OrderID:   order.ID,
		OldStatus: oldStatus,
		NewStatus: input.Status,
		Remark:    input.Remark,
	}
	if err := tx.Create(&statusLog).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if input.Status == "completed" {
		var customer models.Customer
		if err := tx.First(&customer, order.CustomerID).Error; err == nil {
			customer.TotalOrders++
			customer.TotalAmount = customer.TotalAmount.Add(order.TotalAmount)
			tx.Save(&customer)
		}
	}

	tx.Commit()

	database.DB.Preload("Customer").Preload("OrderItems").First(&order, id)
	c.JSON(http.StatusOK, gin.H{"data": order})
}

func GetOrderStatusLogs(c *gin.Context) {
	orderID := c.Param("id")
	var logs []models.OrderStatusLog
	if err := database.DB.Where("order_id = ?", orderID).Order("created_at DESC").Find(&logs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": logs})
}

func GetOrderStatuses(c *gin.Context) {
	statuses := []string{"pending", "confirmed", "shipped", "completed", "cancelled"}
	c.JSON(http.StatusOK, gin.H{"data": statuses})
}
