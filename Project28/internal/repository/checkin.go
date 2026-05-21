package repository

import (
	"homestay/internal/database"
	"homestay/internal/model"
	"time"
)

type CheckInRepository struct{}

func NewCheckInRepository() *CheckInRepository {
	return &CheckInRepository{}
}

func (r *CheckInRepository) Create(record *model.CheckInRecord) error {
	return database.DB.Create(record).Error
}

func (r *CheckInRepository) GetByID(id uint) (*model.CheckInRecord, error) {
	var record model.CheckInRecord
	err := database.DB.Preload("Room").First(&record, id).Error
	return &record, err
}

func (r *CheckInRepository) List() ([]model.CheckInRecord, error) {
	var records []model.CheckInRecord
	err := database.DB.Preload("Room").Find(&records).Error
	return records, err
}

func (r *CheckInRepository) ListActive() ([]model.CheckInRecord, error) {
	var records []model.CheckInRecord
	err := database.DB.Preload("Room").Where("check_out_time IS NULL").Find(&records).Error
	return records, err
}

func (r *CheckInRepository) Update(record *model.CheckInRecord) error {
	return database.DB.Save(record).Error
}

func (r *CheckInRepository) CheckOut(id uint) error {
	now := time.Now()
	return database.DB.Model(&model.CheckInRecord{}).Where("id = ?", id).Update("check_out_time", now).Error
}

func (r *CheckInRepository) Delete(id uint) error {
	return database.DB.Delete(&model.CheckInRecord{}, id).Error
}
