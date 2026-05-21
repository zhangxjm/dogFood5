package repository

import (
	"homestay/internal/database"
	"homestay/internal/model"
)

type RoomRepository struct{}

func NewRoomRepository() *RoomRepository {
	return &RoomRepository{}
}

func (r *RoomRepository) Create(room *model.Room) error {
	return database.DB.Create(room).Error
}

func (r *RoomRepository) GetByID(id uint) (*model.Room, error) {
	var room model.Room
	err := database.DB.Preload("RoomType").Preload("Facilities").First(&room, id).Error
	return &room, err
}

func (r *RoomRepository) List() ([]model.Room, error) {
	var rooms []model.Room
	err := database.DB.Preload("RoomType").Preload("Facilities").Find(&rooms).Error
	return rooms, err
}

func (r *RoomRepository) ListByStatus(status string) ([]model.Room, error) {
	var rooms []model.Room
	err := database.DB.Preload("RoomType").Preload("Facilities").Where("status = ?", status).Find(&rooms).Error
	return rooms, err
}

func (r *RoomRepository) Update(room *model.Room) error {
	return database.DB.Save(room).Error
}

func (r *RoomRepository) UpdateStatus(id uint, status string) error {
	return database.DB.Model(&model.Room{}).Where("id = ?", id).Update("status", status).Error
}

func (r *RoomRepository) Delete(id uint) error {
	return database.DB.Delete(&model.Room{}, id).Error
}

func (r *RoomRepository) AddFacility(roomID, facilityID uint) error {
	return database.DB.Create(&model.RoomFacility{RoomID: roomID, FacilityID: facilityID}).Error
}

func (r *RoomRepository) RemoveFacility(roomID, facilityID uint) error {
	return database.DB.Where("room_id = ? AND facility_id = ?", roomID, facilityID).Delete(&model.RoomFacility{}).Error
}
