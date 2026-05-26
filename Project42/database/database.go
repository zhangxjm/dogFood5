package database

import (
	"door-window-system/models"
	"log"
	"time"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Init() {
	var err error
	DB, err = gorm.Open(sqlite.Open("door_window.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect database:", err)
	}

	err = DB.AutoMigrate(&models.WorkOrder{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	seedData()
}

func seedData() {
	var count int64
	DB.Model(&models.WorkOrder{}).Count(&count)
	if count > 0 {
		return
	}

	installDate1 := time.Date(2025, 5, 10, 9, 0, 0, 0, time.Local)
	completeDate1 := time.Date(2025, 5, 12, 15, 0, 0, 0, time.Local)
	installDate2 := time.Date(2025, 5, 18, 10, 0, 0, 0, time.Local)

	seedOrders := []models.WorkOrder{
		{
			OrderNo:      "WO20250510001",
			CustomerName: "张三",
			Phone:        "13800138001",
			Address:      "北京市朝阳区建国路88号SOHO现代城A座1201",
			ProductType:  "铝合金门窗",
			Quantity:     4,
			Status:       "completed",
			Feedback:     "安装质量很好，师傅很专业，门窗密封性能不错，满意！",
			InstallDate:  &installDate1,
			CompleteDate: &completeDate1,
		},
		{
			OrderNo:      "WO20250515002",
			CustomerName: "李四",
			Phone:        "13800138002",
			Address:      "上海市浦东新区陆家嘴环路1000号恒生银行大厦2503",
			ProductType:  "塑钢门窗",
			Quantity:     6,
			Status:       "in_progress",
			Feedback:     "",
			InstallDate:  &installDate2,
			CompleteDate: nil,
		},
		{
			OrderNo:      "WO20250520003",
			CustomerName: "王五",
			Phone:        "13800138003",
			Address:      "广州市天河区珠江新城花城大道85号2205",
			ProductType:  "断桥铝门窗",
			Quantity:     3,
			Status:       "pending",
			Feedback:     "",
			InstallDate:  nil,
			CompleteDate: nil,
		},
		{
			OrderNo:      "WO20250522004",
			CustomerName: "赵六",
			Phone:        "13800138004",
			Address:      "深圳市南山区科技园南区高新南一道9号1802",
			ProductType:  "阳光房",
			Quantity:     1,
			Status:       "pending",
			Feedback:     "",
			InstallDate:  nil,
			CompleteDate: nil,
		},
		{
			OrderNo:      "WO20250518005",
			CustomerName: "孙七",
			Phone:        "13800138005",
			Address:      "成都市锦江区春熙路88号IFS国际金融中心3座2201",
			ProductType:  "铝合金门窗",
			Quantity:     5,
			Status:       "completed",
			Feedback:     "整体不错，有个小问题已经联系师傅处理了，服务态度很好。",
			InstallDate:  &installDate2,
			CompleteDate: &completeDate1,
		},
	}

	for _, order := range seedOrders {
		DB.Create(&order)
	}

	log.Println("Database seeded with sample work orders")
}
