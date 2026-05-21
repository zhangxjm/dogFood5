package handlers

import (
	"employee-access-system/database"
	"employee-access-system/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CreateVisitorRequest struct {
	Name          string `json:"name" binding:"required"`
	Phone         string `json:"phone"`
	IDCard        string `json:"id_card"`
	Company       string `json:"company"`
	Purpose       string `json:"purpose"`
	ContactPerson string `json:"contact_person"`
}

func CreateVisitor(c *gin.Context) {
	var req CreateVisitorRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	visitor := models.Visitor{
		Name:          req.Name,
		Phone:         req.Phone,
		IDCard:        req.IDCard,
		Company:       req.Company,
		Purpose:       req.Purpose,
		ContactPerson: req.ContactPerson,
	}

	if err := database.DB.Create(&visitor).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create visitor"})
		return
	}

	c.JSON(http.StatusCreated, visitor)
}

func GetVisitor(c *gin.Context) {
	id := c.Param("id")
	var visitor models.Visitor
	if err := database.DB.First(&visitor, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Visitor not found"})
		return
	}
	c.JSON(http.StatusOK, visitor)
}

func GetAllVisitors(c *gin.Context) {
	var visitors []models.Visitor
	database.DB.Find(&visitors)
	c.JSON(http.StatusOK, visitors)
}

func UpdateVisitor(c *gin.Context) {
	id := c.Param("id")
	var visitor models.Visitor
	if err := database.DB.First(&visitor, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Visitor not found"})
		return
	}

	var req CreateVisitorRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	visitor.Name = req.Name
	visitor.Phone = req.Phone
	visitor.IDCard = req.IDCard
	visitor.Company = req.Company
	visitor.Purpose = req.Purpose
	visitor.ContactPerson = req.ContactPerson

	if err := database.DB.Save(&visitor).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update visitor"})
		return
	}

	c.JSON(http.StatusOK, visitor)
}

func DeleteVisitor(c *gin.Context) {
	id := c.Param("id")
	if err := database.DB.Delete(&models.Visitor{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete visitor"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Visitor deleted successfully"})
}
