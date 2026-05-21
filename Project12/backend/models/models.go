package models

import (
	"time"

	"github.com/jinzhu/gorm"
)

type Material struct {
	ID            uint       `gorm:"primary_key" json:"id"`
	Name          string     `gorm:"size:100;not null" json:"name"`
	Specification string     `gorm:"size:100" json:"specification"`
	Unit          string     `gorm:"size:20;not null" json:"unit"`
	Quantity      int        `gorm:"default:0" json:"quantity"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
}

type Team struct {
	ID        uint      `gorm:"primary_key" json:"id"`
	Name      string    `gorm:"size:100;not null;unique" json:"name"`
	Leader    string    `gorm:"size:50" json:"leader"`
	Phone     string    `gorm:"size:20" json:"phone"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Record struct {
	ID         uint      `gorm:"primary_key" json:"id"`
	MaterialID uint      `gorm:"not null" json:"material_id"`
	TeamID     uint      `gorm:"not null" json:"team_id"`
	Quantity   int       `gorm:"not null" json:"quantity"`
	Type       int       `gorm:"not null;default:1" json:"type"`
	Operator   string    `gorm:"size:50" json:"operator"`
	Remark     string    `gorm:"size:255" json:"remark"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`

	Material Material `gorm:"foreignkey:MaterialID" json:"-"`
	Team     Team     `gorm:"foreignkey:TeamID" json:"-"`
}

type RecordDetail struct {
	ID         uint      `gorm:"primary_key" json:"id"`
	MaterialID uint      `json:"material_id"`
	TeamID     uint      `json:"team_id"`
	Quantity   int       `json:"quantity"`
	Type       int       `json:"type"`
	Operator   string    `json:"operator"`
	Remark     string    `json:"remark"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
	MaterialName string `json:"material_name"`
	TeamName     string `json:"team_name"`
	TypeName     string `json:"type_name"`
}

func GetMaterialList(db *gorm.DB, page, pageSize int, keyword string) ([]Material, int, error) {
	var materials []Material
	var total int

	query := db.Model(&Material{})
	if keyword != "" {
		query = query.Where("name LIKE ?", "%"+keyword+"%")
	}

	query.Count(&total)
	offset := (page - 1) * pageSize
	err := query.Offset(offset).Limit(pageSize).Order("id desc").Find(&materials).Error
	return materials, total, err
}

func CreateMaterial(db *gorm.DB, material *Material) error {
	return db.Create(material).Error
}

func UpdateMaterial(db *gorm.DB, id uint, material *Material) error {
	return db.Model(&Material{}).Where("id = ?", id).Updates(material).Error
}

func DeleteMaterial(db *gorm.DB, id uint) error {
	return db.Delete(&Material{}, id).Error
}

func GetTeamList(db *gorm.DB, page, pageSize int) ([]Team, int, error) {
	var teams []Team
	var total int

	db.Model(&Team{}).Count(&total)
	offset := (page - 1) * pageSize
	err := db.Offset(offset).Limit(pageSize).Order("id desc").Find(&teams).Error
	return teams, total, err
}

func GetAllTeams(db *gorm.DB) ([]Team, error) {
	var teams []Team
	err := db.Find(&teams).Error
	return teams, err
}

func GetAllMaterials(db *gorm.DB) ([]Material, error) {
	var materials []Material
	err := db.Find(&materials).Error
	return materials, err
}

func CreateTeam(db *gorm.DB, team *Team) error {
	return db.Create(team).Error
}

func UpdateTeam(db *gorm.DB, id uint, team *Team) error {
	return db.Model(&Team{}).Where("id = ?", id).Updates(team).Error
}

func DeleteTeam(db *gorm.DB, id uint) error {
	return db.Delete(&Team{}, id).Error
}

func CreateRecord(db *gorm.DB, record *Record) error {
	tx := db.Begin()

	if err := tx.Create(record).Error; err != nil {
		tx.Rollback()
		return err
	}

	var material Material
	if err := tx.First(&material, record.MaterialID).Error; err != nil {
		tx.Rollback()
		return err
	}

	if record.Type == 1 {
		material.Quantity -= record.Quantity
	} else {
		material.Quantity += record.Quantity
	}

	if err := tx.Save(&material).Error; err != nil {
		tx.Rollback()
		return err
	}

	tx.Commit()
	return nil
}

func GetRecordList(db *gorm.DB, page, pageSize int, materialID, teamID, recordType int, startDate, endDate string) ([]RecordDetail, int, error) {
	var records []RecordDetail
	var total int

	query := db.Table("records").
		Select("records.*, materials.name as material_name, teams.name as team_name").
		Joins("LEFT JOIN materials ON records.material_id = materials.id").
		Joins("LEFT JOIN teams ON records.team_id = teams.id")

	if materialID > 0 {
		query = query.Where("records.material_id = ?", materialID)
	}
	if teamID > 0 {
		query = query.Where("records.team_id = ?", teamID)
	}
	if recordType > 0 {
		query = query.Where("records.type = ?", recordType)
	}
	if startDate != "" {
		query = query.Where("DATE(records.created_at) >= ?", startDate)
	}
	if endDate != "" {
		query = query.Where("DATE(records.created_at) <= ?", endDate)
	}

	query.Count(&total)
	offset := (page - 1) * pageSize
	err := query.Offset(offset).Limit(pageSize).Order("records.id desc").Find(&records).Error

	for i := range records {
		if records[i].Type == 1 {
			records[i].TypeName = "领用"
		} else {
			records[i].TypeName = "归还"
		}
	}

	return records, total, err
}
