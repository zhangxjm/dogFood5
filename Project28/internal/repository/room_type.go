package repository

import (
	"homestay/internal/database"
	"homestay/internal/model"
)

type RoomTypeRepository struct{}

func NewRoomTypeRepository() *RoomTypeRepository {
	return &RoomTypeRepository{}
}

func (r *RoomTypeRepository) Create(roomType *model.RoomType) error {
	return database.DB.Create(roomType).Error
}

func (r *RoomTypeRepository) GetByID(id uint) (*model.RoomType, error) {
	var roomType model.RoomType
	err := database.DB.First(&roomType, id).Error
	return &roomType, err
}

func (r *RoomTypeRepository) List() ([]model.RoomType, error) {
	var roomTypes []model.RoomType
	err := database.DB.Find(&roomTypes).Error
	return roomTypes, err
}

func (r *RoomTypeRepository) Update(roomType *model.RoomType) error {
	return database.DB.Save(roomType).Error
}

func (r *RoomTypeRepository) Delete(id uint) error {
	return database.DB.Delete(&model.RoomType{}, id).Error
}
