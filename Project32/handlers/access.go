package handlers

import (
	"employee-access-system/database"
	"employee-access-system/models"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type EmployeeAccessRequest struct {
	EmployeeNo string `json:"employee_no" binding:"required"`
	Type       string `json:"type" binding:"required"`
	Remark     string `json:"remark"`
}

type VisitorAccessRequest struct {
	VisitorID uint   `json:"visitor_id" binding:"required"`
	Type      string `json:"type" binding:"required"`
	Remark    string `json:"remark"`
}

func EmployeeAccess(c *gin.Context) {
	var req EmployeeAccessRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var employee models.Employee
	if err := database.DB.Where("employee_no = ?", req.EmployeeNo).First(&employee).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	}

	now := time.Now()

	if req.Type == "in" {
		record := models.AccessRecord{
			EmployeeID: &employee.ID,
			Type:       "employee",
			InTime:     &now,
			Remark:     req.Remark,
		}
		if err := database.DB.Create(&record).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create access record"})
			return
		}
		c.JSON(http.StatusCreated, record)
	} else if req.Type == "out" {
		var record models.AccessRecord
		if err := database.DB.Where("employee_id = ? AND out_time IS NULL", employee.ID).
			Order("in_time DESC").First(&record).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "No active entry record found"})
			return
		}
		record.OutTime = &now
		if err := database.DB.Save(&record).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update access record"})
			return
		}
		c.JSON(http.StatusOK, record)
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid type, must be 'in' or 'out'"})
	}
}

func VisitorAccess(c *gin.Context) {
	var req VisitorAccessRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var visitor models.Visitor
	if err := database.DB.First(&visitor, req.VisitorID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Visitor not found"})
		return
	}

	now := time.Now()

	if req.Type == "in" {
		record := models.AccessRecord{
			VisitorID: &visitor.ID,
			Type:      "visitor",
			InTime:    &now,
			Remark:    req.Remark,
		}
		if err := database.DB.Create(&record).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create access record"})
			return
		}
		c.JSON(http.StatusCreated, record)
	} else if req.Type == "out" {
		var record models.AccessRecord
		if err := database.DB.Where("visitor_id = ? AND out_time IS NULL", req.VisitorID).
			Order("in_time DESC").First(&record).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "No active entry record found"})
			return
		}
		record.OutTime = &now
		if err := database.DB.Save(&record).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update access record"})
			return
		}
		c.JSON(http.StatusOK, record)
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid type, must be 'in' or 'out'"})
	}
}

func GetAccessRecords(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))
	recordType := c.Query("type")

	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}

	offset := (page - 1) * pageSize

	var records []models.AccessRecord
	var total int64

	query := database.DB.Model(&models.AccessRecord{})

	if recordType != "" {
		query = query.Where("type = ?", recordType)
	}

	query.Count(&total)

	if err := query.Preload("Employee").Preload("Visitor").
		Order("created_at DESC").
		Limit(pageSize).Offset(offset).
		Find(&records).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch records"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":       records,
		"total":      total,
		"page":       page,
		"page_size":  pageSize,
		"total_page": (total + int64(pageSize) - 1) / int64(pageSize),
	})
}
