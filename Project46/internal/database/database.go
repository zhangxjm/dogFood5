package database

import (
	"fmt"
	"log"
	"time"

	"agri-tool-management/internal/config"
	"agri-tool-management/internal/model"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB(cfg *config.Config) (*gorm.DB, error) {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		cfg.DBUser, cfg.DBPassword, cfg.DBHost, cfg.DBPort, cfg.DBName)

	var db *gorm.DB
	var err error

	for i := 0; i < 30; i++ {
		db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
		if err == nil {
			break
		}
		log.Printf("Waiting for database connection (attempt %d/30): %v", i+1, err)
		time.Sleep(2 * time.Second)
	}

	if err != nil {
		return nil, fmt.Errorf("failed to connect to database after 30 attempts: %w", err)
	}

	DB = db
	log.Println("Database connection established successfully")

	err = DB.AutoMigrate(
		&model.ToolCategory{},
		&model.Tool{},
		&model.Farmer{},
		&model.PurchaseRecord{},
		&model.RepairRecord{},
		&model.InventoryRecord{},
	)
	if err != nil {
		return nil, fmt.Errorf("failed to migrate database: %w", err)
	}
	log.Println("Database migration completed successfully")

	SeedData(db)

	return db, nil
}

func SeedData(db *gorm.DB) {
	var count int64
	db.Model(&model.ToolCategory{}).Count(&count)
	if count > 0 {
		log.Println("Seed data already exists, skipping seeding")
		return
	}

	log.Println("Seeding initial data...")

	categories := []model.ToolCategory{
		{Name: "耕作农具", Code: "CAT001", Description: "用于耕地、翻土的农具"},
		{Name: "播种农具", Code: "CAT002", Description: "用于播种、育苗的农具"},
		{Name: "收割农具", Code: "CAT003", Description: "用于收割作物的农具"},
		{Name: "灌溉工具", Code: "CAT004", Description: "用于农田灌溉的工具"},
		{Name: "植保工具", Code: "CAT005", Description: "用于病虫害防治的工具"},
	}
	for i := range categories {
		db.Create(&categories[i])
	}

	tools := []model.Tool{
		{CategoryID: 1, Name: "铁犁", Code: "TOOL001", Brand: "东风", Model: "PL-001", Unit: "台", Price: 350.00, Stock: 15, MinStock: 5, Location: "A区-01", Description: "传统铁犁，适合旱地耕作"},
		{CategoryID: 1, Name: "旋耕机", Code: "TOOL002", Brand: "东方红", Model: "XG-151", Unit: "台", Price: 2800.00, Stock: 8, MinStock: 3, Location: "A区-02", Description: "15马力旋耕机，高效翻土"},
		{CategoryID: 1, Name: "锄头", Code: "TOOL003", Brand: "农夫", Model: "HD-100", Unit: "把", Price: 45.00, Stock: 50, MinStock: 10, Location: "A区-03", Description: "多功能锄头，松土除草"},
		{CategoryID: 2, Name: "播种机", Code: "TOOL004", Brand: "久保田", Model: "BZ-8", Unit: "台", Price: 5600.00, Stock: 5, MinStock: 2, Location: "B区-01", Description: "8行精密播种机"},
		{CategoryID: 2, Name: "撒肥机", Code: "TOOL005", Brand: "东风", Model: "SF-500", Unit: "台", Price: 1200.00, Stock: 10, MinStock: 3, Location: "B区-02", Description: "500L大容量撒肥机"},
		{CategoryID: 3, Name: "联合收割机", Code: "TOOL006", Brand: "久保田", Model: "PRO888", Unit: "台", Price: 128000.00, Stock: 3, MinStock: 1, Location: "C区-01", Description: "高性能联合收割机"},
		{CategoryID: 3, Name: "镰刀", Code: "TOOL007", Brand: "农夫", Model: "LD-50", Unit: "把", Price: 28.00, Stock: 80, MinStock: 20, Location: "C区-02", Description: "传统收割镰刀"},
		{CategoryID: 4, Name: "抽水泵", Code: "TOOL008", Brand: "大元", Model: "QB-70", Unit: "台", Price: 680.00, Stock: 20, MinStock: 5, Location: "D区-01", Description: "70米扬程抽水泵"},
		{CategoryID: 4, Name: "喷灌设备", Code: "TOOL009", Brand: "雨鸟", Model: "PG-200", Unit: "套", Price: 1500.00, Stock: 12, MinStock: 3, Location: "D区-02", Description: "200米范围喷灌系统"},
		{CategoryID: 5, Name: "喷雾器", Code: "TOOL010", Brand: "农夫", Model: "PW-16", Unit: "台", Price: 180.00, Stock: 35, MinStock: 8, Location: "E区-01", Description: "16L电动喷雾器"},
		{CategoryID: 5, Name: "杀虫灯", Code: "TOOL011", Brand: "绿控", Model: "SD-20", Unit: "盏", Price: 320.00, Stock: 25, MinStock: 5, Location: "E区-02", Description: "频振式杀虫灯"},
	}
	for i := range tools {
		db.Create(&tools[i])
	}

	farmers := []model.Farmer{
		{Name: "张三", Phone: "13800138001", IDCard: "110101198001011234", Address: "河北省石家庄市正定县", Village: "张家庄村"},
		{Name: "李四", Phone: "13800138002", IDCard: "110101198502022345", Address: "河北省石家庄市正定县", Village: "李家湾村"},
		{Name: "王五", Phone: "13800138003", IDCard: "110101199003033456", Address: "河北省石家庄市正定县", Village: "王家寨村"},
		{Name: "赵六", Phone: "13800138004", IDCard: "110101198804044567", Address: "河北省石家庄市正定县", Village: "赵家庄村"},
		{Name: "钱七", Phone: "13800138005", IDCard: "110101199205055678", Address: "河北省石家庄市正定县", Village: "钱家村"},
	}
	for i := range farmers {
		db.Create(&farmers[i])
	}

	now := time.Now()
	purchaseRecords := []model.PurchaseRecord{
		{FarmerID: 1, ToolID: 3, Quantity: 2, UnitPrice: 45.00, TotalPrice: 90.00, PaymentMethod: "现金", PurchaseDate: now, Remark: "购买两把锄头"},
		{FarmerID: 2, ToolID: 1, Quantity: 1, UnitPrice: 350.00, TotalPrice: 350.00, PaymentMethod: "微信", PurchaseDate: now, Remark: "新买铁犁"},
		{FarmerID: 3, ToolID: 10, Quantity: 1, UnitPrice: 180.00, TotalPrice: 180.00, PaymentMethod: "支付宝", PurchaseDate: now, Remark: ""},
		{FarmerID: 1, ToolID: 7, Quantity: 3, UnitPrice: 28.00, TotalPrice: 84.00, PaymentMethod: "现金", PurchaseDate: now, Remark: "收割季备用"},
	}
	for i := range purchaseRecords {
		db.Create(&purchaseRecords[i])
	}

	repairRecords := []model.RepairRecord{
		{ToolID: 1, FarmerID: 1, Description: "犁铧磨损，需要更换", RepairMan: "陈师傅", Cost: 50.00, Status: "已完成", StartDate: now.AddDate(0, 0, -5), EndDate: &now, Remark: "更换犁铧一副"},
		{ToolID: 4, FarmerID: 2, Description: "播种器堵塞，需要清理", RepairMan: "刘师傅", Cost: 100.00, Status: "维修中", StartDate: now.AddDate(0, 0, -1), Remark: ""},
		{ToolID: 8, FarmerID: 3, Description: "水泵电机故障", RepairMan: "陈师傅", Cost: 280.00, Status: "待维修", StartDate: now, Remark: "需要更换电机"},
	}
	for i := range repairRecords {
		db.Create(&repairRecords[i])
	}

	inventoryRecords := []model.InventoryRecord{
		{ToolID: 3, PrevStock: 52, NewStock: 50, Diff: -2, Reason: "销售出库", Operator: "管理员", CheckDate: now},
		{ToolID: 7, PrevStock: 83, NewStock: 80, Diff: -3, Reason: "销售出库", Operator: "管理员", CheckDate: now},
		{ToolID: 1, PrevStock: 16, NewStock: 15, Diff: -1, Reason: "销售出库", Operator: "管理员", CheckDate: now},
	}
	for i := range inventoryRecords {
		db.Create(&inventoryRecords[i])
	}

	log.Println("Seed data completed successfully")
}
