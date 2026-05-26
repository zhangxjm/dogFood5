package repository

import (
	"agri-tool-management/internal/model"
	"time"

	"gorm.io/gorm"
)

type ToolCategoryRepository struct {
	db *gorm.DB
}

func NewToolCategoryRepository(db *gorm.DB) *ToolCategoryRepository {
	return &ToolCategoryRepository{db: db}
}

func (r *ToolCategoryRepository) GetAll() ([]model.ToolCategory, error) {
	var categories []model.ToolCategory
	err := r.db.Preload("Tools").Find(&categories).Error
	return categories, err
}

func (r *ToolCategoryRepository) GetByID(id uint) (*model.ToolCategory, error) {
	var category model.ToolCategory
	err := r.db.Preload("Tools").First(&category, id).Error
	if err != nil {
		return nil, err
	}
	return &category, nil
}

func (r *ToolCategoryRepository) Create(category *model.ToolCategory) error {
	return r.db.Create(category).Error
}

func (r *ToolCategoryRepository) Update(category *model.ToolCategory) error {
	return r.db.Save(category).Error
}

func (r *ToolCategoryRepository) Delete(id uint) error {
	return r.db.Delete(&model.ToolCategory{}, id).Error
}

type ToolRepository struct {
	db *gorm.DB
}

func NewToolRepository(db *gorm.DB) *ToolRepository {
	return &ToolRepository{db: db}
}

func (r *ToolRepository) GetAll() ([]model.Tool, error) {
	var tools []model.Tool
	err := r.db.Preload("Category").Find(&tools).Error
	return tools, err
}

func (r *ToolRepository) GetByID(id uint) (*model.Tool, error) {
	var tool model.Tool
	err := r.db.Preload("Category").First(&tool, id).Error
	if err != nil {
		return nil, err
	}
	return &tool, nil
}

func (r *ToolRepository) GetByCategoryID(categoryID uint) ([]model.Tool, error) {
	var tools []model.Tool
	err := r.db.Where("category_id = ?", categoryID).Preload("Category").Find(&tools).Error
	return tools, err
}

func (r *ToolRepository) GetLowStock() ([]model.Tool, error) {
	var tools []model.Tool
	err := r.db.Where("stock <= min_stock").Preload("Category").Find(&tools).Error
	return tools, err
}

func (r *ToolRepository) Create(tool *model.Tool) error {
	return r.db.Create(tool).Error
}

func (r *ToolRepository) Update(tool *model.Tool) error {
	return r.db.Save(tool).Error
}

func (r *ToolRepository) Delete(id uint) error {
	return r.db.Delete(&model.Tool{}, id).Error
}

func (r *ToolRepository) UpdateStock(id uint, quantity int) error {
	return r.db.Model(&model.Tool{}).Where("id = ?", id).Update("stock", gorm.Expr("stock + ?", quantity)).Error
}

type FarmerRepository struct {
	db *gorm.DB
}

func NewFarmerRepository(db *gorm.DB) *FarmerRepository {
	return &FarmerRepository{db: db}
}

func (r *FarmerRepository) GetAll() ([]model.Farmer, error) {
	var farmers []model.Farmer
	err := r.db.Find(&farmers).Error
	return farmers, err
}

func (r *FarmerRepository) GetByID(id uint) (*model.Farmer, error) {
	var farmer model.Farmer
	err := r.db.First(&farmer, id).Error
	if err != nil {
		return nil, err
	}
	return &farmer, nil
}

func (r *FarmerRepository) SearchByName(name string) ([]model.Farmer, error) {
	var farmers []model.Farmer
	err := r.db.Where("name LIKE ?", "%"+name+"%").Find(&farmers).Error
	return farmers, err
}

func (r *FarmerRepository) Create(farmer *model.Farmer) error {
	return r.db.Create(farmer).Error
}

func (r *FarmerRepository) Update(farmer *model.Farmer) error {
	return r.db.Save(farmer).Error
}

func (r *FarmerRepository) Delete(id uint) error {
	return r.db.Delete(&model.Farmer{}, id).Error
}

type PurchaseRepository struct {
	db *gorm.DB
}

func NewPurchaseRepository(db *gorm.DB) *PurchaseRepository {
	return &PurchaseRepository{db: db}
}

func (r *PurchaseRepository) GetAll() ([]model.PurchaseRecord, error) {
	var records []model.PurchaseRecord
	err := r.db.Preload("Farmer").Preload("Tool.Category").Order("purchase_date DESC").Find(&records).Error
	return records, err
}

func (r *PurchaseRepository) GetByID(id uint) (*model.PurchaseRecord, error) {
	var record model.PurchaseRecord
	err := r.db.Preload("Farmer").Preload("Tool.Category").First(&record, id).Error
	if err != nil {
		return nil, err
	}
	return &record, nil
}

func (r *PurchaseRepository) GetByDateRange(start, end time.Time) ([]model.PurchaseRecord, error) {
	var records []model.PurchaseRecord
	err := r.db.Preload("Farmer").Preload("Tool.Category").
		Where("purchase_date BETWEEN ? AND ?", start, end).
		Order("purchase_date DESC").Find(&records).Error
	return records, err
}

func (r *PurchaseRepository) GetByFarmerID(farmerID uint) ([]model.PurchaseRecord, error) {
	var records []model.PurchaseRecord
	err := r.db.Preload("Farmer").Preload("Tool.Category").
		Where("farmer_id = ?", farmerID).
		Order("purchase_date DESC").Find(&records).Error
	return records, err
}

func (r *PurchaseRepository) Create(record *model.PurchaseRecord) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(record).Error; err != nil {
			return err
		}
		if err := tx.Model(&model.Tool{}).Where("id = ?", record.ToolID).
			Update("stock", gorm.Expr("stock - ?", record.Quantity)).Error; err != nil {
			return err
		}
		return nil
	})
}

func (r *PurchaseRepository) Update(record *model.PurchaseRecord) error {
	return r.db.Save(record).Error
}

func (r *PurchaseRepository) Delete(id uint) error {
	return r.db.Delete(&model.PurchaseRecord{}, id).Error
}

type RepairRepository struct {
	db *gorm.DB
}

func NewRepairRepository(db *gorm.DB) *RepairRepository {
	return &RepairRepository{db: db}
}

func (r *RepairRepository) GetAll() ([]model.RepairRecord, error) {
	var records []model.RepairRecord
	err := r.db.Preload("Farmer").Preload("Tool.Category").Order("start_date DESC").Find(&records).Error
	return records, err
}

func (r *RepairRepository) GetByID(id uint) (*model.RepairRecord, error) {
	var record model.RepairRecord
	err := r.db.Preload("Farmer").Preload("Tool.Category").First(&record, id).Error
	if err != nil {
		return nil, err
	}
	return &record, nil
}

func (r *RepairRepository) GetByStatus(status string) ([]model.RepairRecord, error) {
	var records []model.RepairRecord
	err := r.db.Preload("Farmer").Preload("Tool.Category").
		Where("status = ?", status).Order("start_date DESC").Find(&records).Error
	return records, err
}

func (r *RepairRepository) Create(record *model.RepairRecord) error {
	return r.db.Create(record).Error
}

func (r *RepairRepository) Update(record *model.RepairRecord) error {
	return r.db.Save(record).Error
}

func (r *RepairRepository) Delete(id uint) error {
	return r.db.Delete(&model.RepairRecord{}, id).Error
}

type InventoryRepository struct {
	db *gorm.DB
}

func NewInventoryRepository(db *gorm.DB) *InventoryRepository {
	return &InventoryRepository{db: db}
}

func (r *InventoryRepository) GetAll() ([]model.InventoryRecord, error) {
	var records []model.InventoryRecord
	err := r.db.Preload("Tool.Category").Order("check_date DESC").Find(&records).Error
	return records, err
}

func (r *InventoryRepository) GetByID(id uint) (*model.InventoryRecord, error) {
	var record model.InventoryRecord
	err := r.db.Preload("Tool.Category").First(&record, id).Error
	if err != nil {
		return nil, err
	}
	return &record, nil
}

func (r *InventoryRepository) GetByDateRange(start, end time.Time) ([]model.InventoryRecord, error) {
	var records []model.InventoryRecord
	err := r.db.Preload("Tool.Category").
		Where("check_date BETWEEN ? AND ?", start, end).
		Order("check_date DESC").Find(&records).Error
	return records, err
}

func (r *InventoryRepository) Create(record *model.InventoryRecord) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(record).Error; err != nil {
			return err
		}
		if err := tx.Model(&model.Tool{}).Where("id = ?", record.ToolID).
			Update("stock", record.NewStock).Error; err != nil {
			return err
		}
		return nil
	})
}

func (r *InventoryRepository) Update(record *model.InventoryRecord) error {
	return r.db.Save(record).Error
}

func (r *InventoryRepository) Delete(id uint) error {
	return r.db.Delete(&model.InventoryRecord{}, id).Error
}

type DashboardRepository struct {
	db *gorm.DB
}

func NewDashboardRepository(db *gorm.DB) *DashboardRepository {
	return &DashboardRepository{db: db}
}

func (r *DashboardRepository) GetStats() (*model.DashboardStats, error) {
	var stats model.DashboardStats
	var todayPurchases, todayRepairs int64

	now := time.Now()
	startOfDay := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

	r.db.Model(&model.Tool{}).Count(&stats.ToolCount)
	r.db.Model(&model.ToolCategory{}).Count(&stats.CategoryCount)
	r.db.Model(&model.Farmer{}).Count(&stats.FarmerCount)
	r.db.Model(&model.PurchaseRecord{}).Count(&stats.PurchaseCount)
	r.db.Model(&model.RepairRecord{}).Count(&stats.RepairCount)
	r.db.Model(&model.Tool{}).Where("stock <= min_stock").Count(&stats.LowStockCount)

	r.db.Model(&model.PurchaseRecord{}).Where("DATE(purchase_date) = ?", startOfDay).Count(&todayPurchases)
	r.db.Model(&model.RepairRecord{}).Where("DATE(start_date) = ?", startOfDay).Count(&todayRepairs)

	stats.TodayPurchases = todayPurchases
	stats.TodayRepairs = todayRepairs

	r.db.Model(&model.RepairRecord{}).Where("status = ?", "待维修").Count(&stats.PendingRepairs)

	var totalSales float64
	r.db.Model(&model.PurchaseRecord{}).Select("COALESCE(SUM(total_price), 0)").Scan(&totalSales)
	stats.TotalSales = totalSales

	var totalRepairCost float64
	r.db.Model(&model.RepairRecord{}).Select("COALESCE(SUM(cost), 0)").Scan(&totalRepairCost)
	stats.TotalRepairCost = totalRepairCost

	return &stats, nil
}
