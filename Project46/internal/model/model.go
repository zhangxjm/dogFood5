package model

import (
	"time"
)

type ToolCategory struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	Name        string         `json:"name" gorm:"size:100;not null;comment:品类名称"`
	Code        string         `json:"code" gorm:"size:50;uniqueIndex;comment:品类编码"`
	Description string         `json:"description" gorm:"size:500;comment:品类描述"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	Tools       []Tool         `json:"tools,omitempty" gorm:"foreignKey:CategoryID"`
}

type Tool struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	CategoryID  uint           `json:"category_id" gorm:"index;comment:所属品类ID"`
	Name        string         `json:"name" gorm:"size:100;not null;comment:农具名称"`
	Code        string         `json:"code" gorm:"size:50;uniqueIndex;comment:农具编码"`
	Brand       string         `json:"brand" gorm:"size:100;comment:品牌"`
	Model       string         `json:"model" gorm:"size:100;comment:型号"`
	Unit        string         `json:"unit" gorm:"size:20;default:件;comment:单位"`
	Price       float64        `json:"price" gorm:"default:0;comment:单价"`
	Stock       int            `json:"stock" gorm:"default:0;comment:库存数量"`
	MinStock    int            `json:"min_stock" gorm:"default:0;comment:最低库存预警"`
	Location    string         `json:"location" gorm:"size:100;comment:存放位置"`
	Description string         `json:"description" gorm:"size:500;comment:描述"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	Category    *ToolCategory  `json:"category,omitempty" gorm:"foreignKey:CategoryID"`
}

type Farmer struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	Name      string         `json:"name" gorm:"size:100;not null;comment:农户姓名"`
	Phone     string         `json:"phone" gorm:"size:20;comment:联系电话"`
	IDCard    string         `json:"id_card" gorm:"size:20;comment:身份证号"`
	Address   string         `json:"address" gorm:"size:200;comment:住址"`
	Village   string         `json:"village" gorm:"size:100;comment:所在村庄"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
}

type PurchaseRecord struct {
	ID           uint           `json:"id" gorm:"primaryKey"`
	FarmerID     uint           `json:"farmer_id" gorm:"index;comment:农户ID"`
	ToolID       uint           `json:"tool_id" gorm:"index;comment:农具ID"`
	Quantity     int            `json:"quantity" gorm:"default:1;comment:购买数量"`
	UnitPrice    float64        `json:"unit_price" gorm:"comment:单价"`
	TotalPrice   float64        `json:"total_price" gorm:"comment:总价"`
	Discount     float64        `json:"discount" gorm:"default:0;comment:折扣"`
	PaymentMethod string        `json:"payment_method" gorm:"size:50;comment:支付方式"`
	Remark       string         `json:"remark" gorm:"size:500;comment:备注"`
	PurchaseDate time.Time      `json:"purchase_date" gorm:"index;comment:购买日期"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	Farmer       *Farmer        `json:"farmer,omitempty" gorm:"foreignKey:FarmerID"`
	Tool         *Tool          `json:"tool,omitempty" gorm:"foreignKey:ToolID"`
}

type RepairRecord struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	ToolID      uint           `json:"tool_id" gorm:"index;comment:农具ID"`
	FarmerID    uint           `json:"farmer_id" gorm:"index;comment:送修农户ID"`
	Description string         `json:"description" gorm:"size:500;comment:故障描述"`
	RepairMan   string         `json:"repair_man" gorm:"size:50;comment:维修人员"`
	Cost        float64        `json:"cost" gorm:"default:0;comment:维修费用"`
	Status      string         `json:"status" gorm:"size:20;default:待维修;comment:维修状态"`
	StartDate   time.Time      `json:"start_date" gorm:"comment:送修日期"`
	EndDate     *time.Time     `json:"end_date" gorm:"comment:完成日期"`
	Remark      string         `json:"remark" gorm:"size:500;comment:备注"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	Tool        *Tool          `json:"tool,omitempty" gorm:"foreignKey:ToolID"`
	Farmer      *Farmer        `json:"farmer,omitempty" gorm:"foreignKey:FarmerID"`
}

type InventoryRecord struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	ToolID    uint           `json:"tool_id" gorm:"index;comment:农具ID"`
	PrevStock int            `json:"prev_stock" gorm:"comment:盘点前库存"`
	NewStock  int            `json:"new_stock" gorm:"comment:盘点后库存"`
	Diff      int            `json:"diff" gorm:"comment:差额"`
	Reason    string         `json:"reason" gorm:"size:500;comment:差异原因"`
	Operator  string         `json:"operator" gorm:"size:50;comment:盘点人"`
	CheckDate time.Time      `json:"check_date" gorm:"index;comment:盘点日期"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	Tool      *Tool          `json:"tool,omitempty" gorm:"foreignKey:ToolID"`
}

type DashboardStats struct {
	ToolCount         int64   `json:"tool_count"`
	CategoryCount     int64   `json:"category_count"`
	FarmerCount       int64   `json:"farmer_count"`
	PurchaseCount     int64   `json:"purchase_count"`
	RepairCount       int64   `json:"repair_count"`
	LowStockCount     int64   `json:"low_stock_count"`
	TotalSales        float64 `json:"total_sales"`
	TotalRepairCost   float64 `json:"total_repair_cost"`
	TodayPurchases    int64   `json:"today_purchases"`
	TodayRepairs      int64   `json:"today_repairs"`
	PendingRepairs    int64   `json:"pending_repairs"`
}
