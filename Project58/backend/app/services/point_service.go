package services

import (
	"inspection-system/app/database"
	"inspection-system/app/models"
)

type PointService struct{}

func NewPointService() *PointService {
	return &PointService{}
}

func (s *PointService) GetPoints(filters map[string]interface{}, page, pageSize int) ([]models.InspectionPoint, int64, error) {
	db := database.GetDB()
	var points []models.InspectionPoint
	var total int64

	query := db.Model(&models.InspectionPoint{})

	if river, ok := filters["river"].(string); ok && river != "" {
		query = query.Where("river = ?", river)
	}
	if area, ok := filters["area"].(string); ok && area != "" {
		query = query.Where("area = ?", area)
	}
	if status, ok := filters["status"].(int); ok {
		query = query.Where("status = ?", status)
	}
	if name, ok := filters["name"].(string); ok && name != "" {
		query = query.Where("name LIKE ?", "%"+name+"%")
	}

	query.Count(&total)

	offset := (page - 1) * pageSize
	if err := query.Offset(offset).Limit(pageSize).Order("id DESC").Find(&points).Error; err != nil {
		return nil, 0, err
	}

	return points, total, nil
}

func (s *PointService) GetPointByID(id uint) (*models.InspectionPoint, error) {
	db := database.GetDB()
	var point models.InspectionPoint
	if err := db.First(&point, id).Error; err != nil {
		return nil, err
	}
	return &point, nil
}

func (s *PointService) CreatePoint(point *models.InspectionPoint) error {
	db := database.GetDB()
	return db.Create(point).Error
}

func (s *PointService) UpdatePoint(point *models.InspectionPoint) error {
	db := database.GetDB()
	return db.Save(point).Error
}

func (s *PointService) DeletePoint(id uint) error {
	db := database.GetDB()
	return db.Delete(&models.InspectionPoint{}, id).Error
}

func (s *PointService) GetAllPoints() ([]models.InspectionPoint, error) {
	db := database.GetDB()
	var points []models.InspectionPoint
	if err := db.Where("status = ?", 1).Order("name ASC").Find(&points).Error; err != nil {
		return nil, err
	}
	return points, nil
}
