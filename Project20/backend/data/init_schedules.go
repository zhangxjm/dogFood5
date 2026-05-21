//go:build ignore
// +build ignore

package main

import (
	"fmt"
	"log"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Schedule struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	CoachID      uint      `json:"coach_id" gorm:"not null;index"`
	Date         string    `json:"date" gorm:"type:date;not null;index"`
	StartTime    string    `json:"start_time" gorm:"type:time;not null"`
	EndTime      string    `json:"end_time" gorm:"type:time;not null"`
	Status       string    `json:"status" gorm:"size:20;default:'available'"`
	MaxStudents  int       `json:"max_students" gorm:"default:1"`
	BookedCount  int       `json:"booked_count" gorm:"default:0"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

func main() {
	dsn := "driving:driving123@tcp(localhost:3306)/driving_school?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect database:", err)
	}

	// Generate schedules for next 7 days
	today := time.Now()
	timeSlots := []struct {
		start string
		end   string
	}{
		{"08:00:00", "09:00:00"},
		{"09:00:00", "10:00:00"},
		{"10:00:00", "11:00:00"},
		{"11:00:00", "12:00:00"},
		{"14:00:00", "15:00:00"},
		{"15:00:00", "16:00:00"},
		{"16:00:00", "17:00:00"},
		{"17:00:00", "18:00:00"},
	}

	coaches := []uint{1, 2, 3}
	createdCount := 0

	for i := 0; i < 7; i++ {
		date := today.AddDate(0, 0, i).Format("2006-01-02")
		
		for _, coachID := range coaches {
			for _, slot := range timeSlots {
				schedule := Schedule{
					CoachID:     coachID,
					Date:        date,
					StartTime:   slot.start,
					EndTime:     slot.end,
					Status:      "available",
					MaxStudents: 1,
					BookedCount: 0,
				}
				
				result := db.FirstOrCreate(&schedule, Schedule{
					CoachID:   coachID,
					Date:      date,
					StartTime: slot.start,
				})
				
				if result.RowsAffected > 0 {
					createdCount++
				}
			}
		}
	}

	fmt.Printf("✅ 成功生成 %d 个练车时段！\n", createdCount)
	fmt.Println("📅 日期范围: 未来7天")
	fmt.Println("⏰ 时段: 08:00-12:00, 14:00-18:00")
}
