package models

import (
	"time"

	"gorm.io/gorm"
)

type Product struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	Name          string         `gorm:"size:200;not null" json:"name"`
	Category      string         `gorm:"size:100" json:"category"`
	Unit          string         `gorm:"size:20" json:"unit"`
	Stock         int            `gorm:"default:0" json:"stock"`
	MinStock      int            `gorm:"default:10" json:"min_stock"`
	PurchasePrice float64        `gorm:"type:decimal(10,2);default:0" json:"purchase_price"`
	SellPrice     float64        `gorm:"type:decimal(10,2);default:0" json:"sell_price"`
	Supplier      string         `gorm:"size:200" json:"supplier"`
	Remark        string         `gorm:"size:500" json:"remark"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}

type StockLog struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	ProductID   uint      `gorm:"index" json:"product_id"`
	Product     Product   `gorm:"foreignKey:ProductID" json:"product"`
	Type        string    `gorm:"size:20" json:"type"`
	Quantity    int       `json:"quantity"`
	UnitPrice   float64   `gorm:"type:decimal(10,2)" json:"unit_price"`
	TotalPrice  float64   `gorm:"type:decimal(10,2)" json:"total_price"`
	Operator    string    `gorm:"size:100" json:"operator"`
	Remark      string    `gorm:"size:500" json:"remark"`
	CreatedAt   time.Time `json:"created_at"`
}

type PriceHistory struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	ProductID     uint      `gorm:"index" json:"product_id"`
	Product       Product   `gorm:"foreignKey:ProductID" json:"product"`
	PurchasePrice float64   `gorm:"type:decimal(10,2)" json:"purchase_price"`
	SellPrice     float64   `gorm:"type:decimal(10,2)" json:"sell_price"`
	ChangedAt     time.Time `json:"changed_at"`
	Remark        string    `gorm:"size:500" json:"remark"`
}

func SeedData(db *gorm.DB) error {
	var count int64
	db.Model(&Product{}).Count(&count)
	if count > 0 {
		return nil
	}

	products := []Product{
		{Name: "扳手12mm", Category: "工具", Unit: "把", Stock: 50, MinStock: 10, PurchasePrice: 15.00, SellPrice: 28.00, Supplier: "永固五金", Remark: "铬钒钢材质"},
		{Name: "螺丝刀十字PH2", Category: "工具", Unit: "把", Stock: 80, MinStock: 15, PurchasePrice: 8.00, SellPrice: 15.00, Supplier: "永固五金", Remark: "磁性头"},
		{Name: "电钻手电", Category: "电动工具", Unit: "台", Stock: 15, MinStock: 5, PurchasePrice: 180.00, SellPrice: 320.00, Supplier: "德力西", Remark: "12V锂电"},
		{Name: "钢钉2.5寸", Category: "耗材", Unit: "盒", Stock: 200, MinStock: 50, PurchasePrice: 5.00, SellPrice: 10.00, Supplier: "本地钢厂", Remark: "镀锌"},
		{Name: "膨胀螺丝M8", Category: "耗材", Unit: "包", Stock: 30, MinStock: 20, PurchasePrice: 12.00, SellPrice: 22.00, Supplier: "永固五金", Remark: "10个/包"},
		{Name: "水管4分", Category: "管材", Unit: "根", Stock: 5, MinStock: 10, PurchasePrice: 25.00, SellPrice: 45.00, Supplier: "联塑", Remark: "PVC"},
		{Name: "生料带", Category: "耗材", Unit: "卷", Stock: 100, MinStock: 30, PurchasePrice: 2.00, SellPrice: 5.00, Supplier: "本地", Remark: "加厚款"},
		{Name: "角磨机", Category: "电动工具", Unit: "台", Stock: 8, MinStock: 3, PurchasePrice: 220.00, SellPrice: 380.00, Supplier: "博世", Remark: "100mm"},
		{Name: "卷尺5米", Category: "工具", Unit: "把", Stock: 45, MinStock: 10, PurchasePrice: 6.00, SellPrice: 12.00, Supplier: "田岛", Remark: "加厚钢带"},
		{Name: "绝缘胶带", Category: "耗材", Unit: "卷", Stock: 60, MinStock: 20, PurchasePrice: 3.00, SellPrice: 6.00, Supplier: "3M", Remark: "耐高温"},
	}

	for _, p := range products {
		if err := db.Create(&p).Error; err != nil {
			return err
		}
	}

	stockLogs := []StockLog{
		{ProductID: 1, Type: "进货", Quantity: 50, UnitPrice: 15.00, TotalPrice: 750.00, Operator: "系统", Remark: "初始库存"},
		{ProductID: 2, Type: "进货", Quantity: 80, UnitPrice: 8.00, TotalPrice: 640.00, Operator: "系统", Remark: "初始库存"},
		{ProductID: 3, Type: "进货", Quantity: 15, UnitPrice: 180.00, TotalPrice: 2700.00, Operator: "系统", Remark: "初始库存"},
		{ProductID: 4, Type: "进货", Quantity: 200, UnitPrice: 5.00, TotalPrice: 1000.00, Operator: "系统", Remark: "初始库存"},
		{ProductID: 5, Type: "进货", Quantity: 30, UnitPrice: 12.00, TotalPrice: 360.00, Operator: "系统", Remark: "初始库存"},
	}

	for _, log := range stockLogs {
		if err := db.Create(&log).Error; err != nil {
			return err
		}
	}

	return nil
}
