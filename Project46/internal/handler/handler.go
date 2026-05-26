package handler

import (
	"agri-tool-management/internal/model"
	"agri-tool-management/internal/repository"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type ToolCategoryHandler struct {
	repo *repository.ToolCategoryRepository
}

func NewToolCategoryHandler(repo *repository.ToolCategoryRepository) *ToolCategoryHandler {
	return &ToolCategoryHandler{repo: repo}
}

func (h *ToolCategoryHandler) GetAll(c *gin.Context) {
	categories, err := h.repo.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, categories)
}

func (h *ToolCategoryHandler) GetByID(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	category, err := h.repo.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "category not found"})
		return
	}
	c.JSON(http.StatusOK, category)
}

func (h *ToolCategoryHandler) Create(c *gin.Context) {
	var category model.ToolCategory
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.repo.Create(&category); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, category)
}

func (h *ToolCategoryHandler) Update(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	category, err := h.repo.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "category not found"})
		return
	}
	if err := c.ShouldBindJSON(category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.repo.Update(category); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, category)
}

func (h *ToolCategoryHandler) Delete(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	if err := h.repo.Delete(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "deleted successfully"})
}

type ToolHandler struct {
	repo *repository.ToolRepository
}

func NewToolHandler(repo *repository.ToolRepository) *ToolHandler {
	return &ToolHandler{repo: repo}
}

func (h *ToolHandler) GetAll(c *gin.Context) {
	tools, err := h.repo.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tools)
}

func (h *ToolHandler) GetByID(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	tool, err := h.repo.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "tool not found"})
		return
	}
	c.JSON(http.StatusOK, tool)
}

func (h *ToolHandler) GetByCategoryID(c *gin.Context) {
	categoryID, _ := strconv.ParseUint(c.Param("category_id"), 10, 32)
	tools, err := h.repo.GetByCategoryID(uint(categoryID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tools)
}

func (h *ToolHandler) GetLowStock(c *gin.Context) {
	tools, err := h.repo.GetLowStock()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tools)
}

func (h *ToolHandler) Create(c *gin.Context) {
	var tool model.Tool
	if err := c.ShouldBindJSON(&tool); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.repo.Create(&tool); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, tool)
}

func (h *ToolHandler) Update(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	tool, err := h.repo.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "tool not found"})
		return
	}
	if err := c.ShouldBindJSON(tool); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.repo.Update(tool); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tool)
}

func (h *ToolHandler) Delete(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	if err := h.repo.Delete(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "deleted successfully"})
}

type FarmerHandler struct {
	repo *repository.FarmerRepository
}

func NewFarmerHandler(repo *repository.FarmerRepository) *FarmerHandler {
	return &FarmerHandler{repo: repo}
}

func (h *FarmerHandler) GetAll(c *gin.Context) {
	farmers, err := h.repo.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, farmers)
}

func (h *FarmerHandler) GetByID(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	farmer, err := h.repo.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "farmer not found"})
		return
	}
	c.JSON(http.StatusOK, farmer)
}

func (h *FarmerHandler) SearchByName(c *gin.Context) {
	name := c.Query("name")
	farmers, err := h.repo.SearchByName(name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, farmers)
}

func (h *FarmerHandler) Create(c *gin.Context) {
	var farmer model.Farmer
	if err := c.ShouldBindJSON(&farmer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.repo.Create(&farmer); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, farmer)
}

func (h *FarmerHandler) Update(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	farmer, err := h.repo.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "farmer not found"})
		return
	}
	if err := c.ShouldBindJSON(farmer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.repo.Update(farmer); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, farmer)
}

func (h *FarmerHandler) Delete(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	if err := h.repo.Delete(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "deleted successfully"})
}

type PurchaseHandler struct {
	repo *repository.PurchaseRepository
}

func NewPurchaseHandler(repo *repository.PurchaseRepository) *PurchaseHandler {
	return &PurchaseHandler{repo: repo}
}

func (h *PurchaseHandler) GetAll(c *gin.Context) {
	records, err := h.repo.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, records)
}

func (h *PurchaseHandler) GetByID(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	record, err := h.repo.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "record not found"})
		return
	}
	c.JSON(http.StatusOK, record)
}

func (h *PurchaseHandler) GetByDateRange(c *gin.Context) {
	startStr := c.Query("start")
	endStr := c.Query("end")
	start, err := time.Parse("2006-01-02", startStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid start date"})
		return
	}
	end, err := time.Parse("2006-01-02", endStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid end date"})
		return
	}
	end = end.Add(24 * time.Hour)
	records, err := h.repo.GetByDateRange(start, end)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, records)
}

func (h *PurchaseHandler) GetByFarmerID(c *gin.Context) {
	farmerID, _ := strconv.ParseUint(c.Param("farmer_id"), 10, 32)
	records, err := h.repo.GetByFarmerID(uint(farmerID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, records)
}

func (h *PurchaseHandler) Create(c *gin.Context) {
	var record model.PurchaseRecord
	if err := c.ShouldBindJSON(&record); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if record.PurchaseDate.IsZero() {
		record.PurchaseDate = time.Now()
	}
	if record.TotalPrice == 0 {
		record.TotalPrice = record.UnitPrice * float64(record.Quantity)
	}
	if err := h.repo.Create(&record); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, record)
}

func (h *PurchaseHandler) Update(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	record, err := h.repo.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "record not found"})
		return
	}
	if err := c.ShouldBindJSON(record); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.repo.Update(record); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, record)
}

func (h *PurchaseHandler) Delete(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	if err := h.repo.Delete(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "deleted successfully"})
}

type RepairHandler struct {
	repo *repository.RepairRepository
}

func NewRepairHandler(repo *repository.RepairRepository) *RepairHandler {
	return &RepairHandler{repo: repo}
}

func (h *RepairHandler) GetAll(c *gin.Context) {
	records, err := h.repo.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, records)
}

func (h *RepairHandler) GetByID(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	record, err := h.repo.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "record not found"})
		return
	}
	c.JSON(http.StatusOK, record)
}

func (h *RepairHandler) GetByStatus(c *gin.Context) {
	status := c.Query("status")
	records, err := h.repo.GetByStatus(status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, records)
}

func (h *RepairHandler) Create(c *gin.Context) {
	var record model.RepairRecord
	if err := c.ShouldBindJSON(&record); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if record.StartDate.IsZero() {
		record.StartDate = time.Now()
	}
	if record.Status == "" {
		record.Status = "待维修"
	}
	if err := h.repo.Create(&record); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, record)
}

func (h *RepairHandler) Update(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	record, err := h.repo.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "record not found"})
		return
	}
	if err := c.ShouldBindJSON(record); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.repo.Update(record); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, record)
}

func (h *RepairHandler) Delete(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	if err := h.repo.Delete(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "deleted successfully"})
}

type InventoryHandler struct {
	repo *repository.InventoryRepository
}

func NewInventoryHandler(repo *repository.InventoryRepository) *InventoryHandler {
	return &InventoryHandler{repo: repo}
}

func (h *InventoryHandler) GetAll(c *gin.Context) {
	records, err := h.repo.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, records)
}

func (h *InventoryHandler) GetByID(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	record, err := h.repo.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "record not found"})
		return
	}
	c.JSON(http.StatusOK, record)
}

func (h *InventoryHandler) GetByDateRange(c *gin.Context) {
	startStr := c.Query("start")
	endStr := c.Query("end")
	start, err := time.Parse("2006-01-02", startStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid start date"})
		return
	}
	end, err := time.Parse("2006-01-02", endStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid end date"})
		return
	}
	end = end.Add(24 * time.Hour)
	records, err := h.repo.GetByDateRange(start, end)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, records)
}

func (h *InventoryHandler) Create(c *gin.Context) {
	var record model.InventoryRecord
	if err := c.ShouldBindJSON(&record); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if record.CheckDate.IsZero() {
		record.CheckDate = time.Now()
	}
	record.Diff = record.NewStock - record.PrevStock
	if err := h.repo.Create(&record); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, record)
}

func (h *InventoryHandler) Update(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	record, err := h.repo.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "record not found"})
		return
	}
	if err := c.ShouldBindJSON(record); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.repo.Update(record); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, record)
}

func (h *InventoryHandler) Delete(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 32)
	if err := h.repo.Delete(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "deleted successfully"})
}

type DashboardHandler struct {
	repo *repository.DashboardRepository
}

func NewDashboardHandler(repo *repository.DashboardRepository) *DashboardHandler {
	return &DashboardHandler{repo: repo}
}

func (h *DashboardHandler) GetStats(c *gin.Context) {
	stats, err := h.repo.GetStats()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, stats)
}
