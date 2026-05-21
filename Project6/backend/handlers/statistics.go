package handlers

import (
	"farm-sales-backend/database"
	"farm-sales-backend/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/shopspring/decimal"
)

type DashboardStats struct {
	TotalOrders      int64           `json:"total_orders"`
	TotalRevenue     decimal.Decimal `json:"total_revenue"`
	TotalProducts    int64           `json:"total_products"`
	TotalCustomers   int64           `json:"total_customers"`
	PendingOrders    int64           `json:"pending_orders"`
	TodayOrders      int64           `json:"today_orders"`
	TodayRevenue     decimal.Decimal `json:"today_revenue"`
}

type SalesByCategory struct {
	Category string          `json:"category"`
	Total    decimal.Decimal `json:"total"`
	Count    int64           `json:"count"`
}

type SalesByDate struct {
	Date  string          `json:"date"`
	Total decimal.Decimal `json:"total"`
	Count int64           `json:"count"`
}

type TopProduct struct {
	ID       uint64          `json:"id"`
	Name     string          `json:"name"`
	Total    decimal.Decimal `json:"total"`
	Quantity int64           `json:"quantity"`
}

func GetDashboardStats(c *gin.Context) {
	var stats DashboardStats

	database.DB.Model(&models.Order{}).Where("status != ?", "cancelled").Count(&stats.TotalOrders)

	var totalRevenue decimal.Decimal
	rows, _ := database.DB.Model(&models.Order{}).Where("status = ?", "completed").Select("IFNULL(SUM(total_amount), 0)").Rows()
	if rows.Next() {
		rows.Scan(&totalRevenue)
	}
	stats.TotalRevenue = totalRevenue

	database.DB.Model(&models.Product{}).Count(&stats.TotalProducts)
	database.DB.Model(&models.Customer{}).Count(&stats.TotalCustomers)
	database.DB.Model(&models.Order{}).Where("status = ?", "pending").Count(&stats.PendingOrders)

	today := time.Now().Format("2006-01-02")
	database.DB.Model(&models.Order{}).Where("DATE(created_at) = ? AND status != ?", today, "cancelled").Count(&stats.TodayOrders)

	var todayRevenue decimal.Decimal
	rows2, _ := database.DB.Model(&models.Order{}).Where("DATE(created_at) = ? AND status = ?", today, "completed").Select("IFNULL(SUM(total_amount), 0)").Rows()
	if rows2.Next() {
		rows2.Scan(&todayRevenue)
	}
	stats.TodayRevenue = todayRevenue

	c.JSON(http.StatusOK, gin.H{"data": stats})
}

func GetSalesByCategory(c *gin.Context) {
	var results []SalesByCategory

	rows, err := database.DB.Raw(`
		SELECT p.category, IFNULL(SUM(oi.subtotal), 0) as total, IFNULL(SUM(oi.quantity), 0) as count
		FROM order_items oi
		JOIN orders o ON oi.order_id = o.id
		JOIN products p ON oi.product_id = p.id
		WHERE o.status = 'completed'
		GROUP BY p.category
		ORDER BY total DESC
	`).Rows()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var item SalesByCategory
		rows.Scan(&item.Category, &item.Total, &item.Count)
		results = append(results, item)
	}

	c.JSON(http.StatusOK, gin.H{"data": results})
}

func GetSalesByDate(c *gin.Context) {
	days := c.DefaultQuery("days", "7")
	var results []SalesByDate

	rows, err := database.DB.Raw(`
		SELECT DATE(o.created_at) as date, IFNULL(SUM(o.total_amount), 0) as total, COUNT(*) as count
		FROM orders o
		WHERE o.status = 'completed' AND o.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
		GROUP BY DATE(o.created_at)
		ORDER BY date DESC
	`, days).Rows()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var item SalesByDate
		rows.Scan(&item.Date, &item.Total, &item.Count)
		results = append(results, item)
	}

	c.JSON(http.StatusOK, gin.H{"data": results})
}

func GetTopProducts(c *gin.Context) {
	limit := c.DefaultQuery("limit", "10")
	var results []TopProduct

	rows, err := database.DB.Raw(`
		SELECT p.id, p.name, IFNULL(SUM(oi.subtotal), 0) as total, IFNULL(SUM(oi.quantity), 0) as quantity
		FROM order_items oi
		JOIN orders o ON oi.order_id = o.id
		JOIN products p ON oi.product_id = p.id
		WHERE o.status = 'completed'
		GROUP BY p.id, p.name
		ORDER BY total DESC
		LIMIT ?
	`, limit).Rows()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var item TopProduct
		rows.Scan(&item.ID, &item.Name, &item.Total, &item.Quantity)
		results = append(results, item)
	}

	c.JSON(http.StatusOK, gin.H{"data": results})
}
