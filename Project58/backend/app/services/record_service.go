package services

import (
	"inspection-system/app/database"
	"inspection-system/app/models"

	"gorm.io/gorm"
)

type RecordService struct{}

func NewRecordService() *RecordService {
	return &RecordService{}
}

func (s *RecordService) GetRecords(filters map[string]interface{}, page, pageSize int) ([]models.InspectionRecord, int64, error) {
	db := database.GetDB()
	var records []models.InspectionRecord
	var total int64

	query := db.Model(&models.InspectionRecord{}).Preload("Point")

	if pointID, ok := filters["point_id"].(uint); ok && pointID > 0 {
		query = query.Where("point_id = ?", pointID)
	}
	if status, ok := filters["status"].(string); ok && status != "" {
		query = query.Where("status = ?", status)
	}
	if problemType, ok := filters["problem_type"].(string); ok && problemType != "" {
		query = query.Where("problem_type = ?", problemType)
	}
	if startDate, ok := filters["start_date"].(string); ok && startDate != "" {
		query = query.Where("inspection_time >= ?", startDate)
	}
	if endDate, ok := filters["end_date"].(string); ok && endDate != "" {
		query = query.Where("inspection_time <= ?", endDate)
	}

	query.Count(&total)

	offset := (page - 1) * pageSize
	if err := query.Offset(offset).Limit(pageSize).Order("inspection_time DESC").Find(&records).Error; err != nil {
		return nil, 0, err
	}

	return records, total, nil
}

func (s *RecordService) GetRecordByID(id uint) (*models.InspectionRecord, error) {
	db := database.GetDB()
	var record models.InspectionRecord
	if err := db.Preload("Point").Preload("Rectifications").First(&record, id).Error; err != nil {
		return nil, err
	}
	return &record, nil
}

func (s *RecordService) CreateRecord(record *models.InspectionRecord) error {
	db := database.GetDB()
	return db.Create(record).Error
}

func (s *RecordService) UpdateRecord(record *models.InspectionRecord) error {
	db := database.GetDB()
	return db.Save(record).Error
}

func (s *RecordService) DeleteRecord(id uint) error {
	db := database.GetDB()
	return db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("record_id = ?", id).Delete(&models.RectificationRecord{}).Error; err != nil {
			return err
		}
		if err := tx.Delete(&models.InspectionRecord{}, id).Error; err != nil {
			return err
		}
		return nil
	})
}

func (s *RecordService) UpdateRecordStatus(recordID uint, status string) error {
	db := database.GetDB()
	return db.Model(&models.InspectionRecord{}).Where("id = ?", recordID).Update("status", status).Error
}
