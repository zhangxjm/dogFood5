package services

import (
	"inspection-system/app/database"
	"inspection-system/app/models"

	"gorm.io/gorm"
)

type RectificationService struct{}

func NewRectificationService() *RectificationService {
	return &RectificationService{}
}

func (s *RectificationService) GetRectificationsByRecordID(recordID uint) ([]models.RectificationRecord, error) {
	db := database.GetDB()
	var rectifications []models.RectificationRecord
	if err := db.Where("record_id = ?", recordID).Order("created_at DESC").Find(&rectifications).Error; err != nil {
		return nil, err
	}
	return rectifications, nil
}

func (s *RectificationService) CreateRectification(rect *models.RectificationRecord) error {
	db := database.GetDB()
	return db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(rect).Error; err != nil {
			return err
		}
		if err := tx.Model(&models.InspectionRecord{}).Where("id = ?", rect.RecordID).Update("status", rect.Status).Error; err != nil {
			return err
		}
		return nil
	})
}

func (s *RectificationService) UpdateRectification(rect *models.RectificationRecord) error {
	db := database.GetDB()
	return db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Save(rect).Error; err != nil {
			return err
		}
		if err := tx.Model(&models.InspectionRecord{}).Where("id = ?", rect.RecordID).Update("status", rect.Status).Error; err != nil {
			return err
		}
		return nil
	})
}

func (s *RectificationService) GetRectificationByID(id uint) (*models.RectificationRecord, error) {
	db := database.GetDB()
	var rect models.RectificationRecord
	if err := db.First(&rect, id).Error; err != nil {
		return nil, err
	}
	return &rect, nil
}
