package repository

import (
	"homestay/internal/database"
	"homestay/internal/model"
)

type FacilityRepository struct{}

func NewFacilityRepository() *FacilityRepository {
	return &FacilityRepository{}
}

func (r *FacilityRepository) Create(facility *model.Facility) error {
	return database.DB.Create(facility).Error
}

func (r *FacilityRepository) GetByID(id uint) (*model.Facility, error) {
	var facility model.Facility
	err := database.DB.First(&facility, id).Error
	return &facility, err
}

func (r *FacilityRepository) List() ([]model.Facility, error) {
	var facilities []model.Facility
	err := database.DB.Find(&facilities).Error
	return facilities, err
}

func (r *FacilityRepository) Update(facility *model.Facility) error {
	return database.DB.Save(facility).Error
}

func (r *FacilityRepository) Delete(id uint) error {
	return database.DB.Delete(&model.Facility{}, id).Error
}
