package main

import (
	"database/sql"
	"fmt"
	"os"
	"time"

	_ "github.com/go-sql-driver/mysql"

	"github.com/beego/beego/v2/client/orm"
	"github.com/beego/beego/v2/core/logs"
	beego "github.com/beego/beego/v2/server/web"

	"warehouse-system/models"
	_ "warehouse-system/routers"
)

func init() {
	dbUser := getEnv("DB_USER", "root")
	dbPass := getEnv("DB_PASS", "warehouse123")
	dbHost := getEnv("DB_HOST", "127.0.0.1")
	dbPort := getEnv("DB_PORT", "3306")
	dbName := getEnv("DB_NAME", "warehouse_db")

	dataSource := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&loc=Local&parseTime=true",
		dbUser, dbPass, dbHost, dbPort, dbName)

	orm.RegisterDataBase("default", "mysql", dataSource)

	orm.RegisterModel(new(models.WarehouseArea), new(models.Material), new(models.MaterialRecord))

	go waitForDB(dbUser, dbPass, dbHost, dbPort, dbName)
}

func waitForDB(user, pass, host, port, name string) {
	dataSource := fmt.Sprintf("%s:%s@tcp(%s:%s)/", user, pass, host, port)
	maxAttempts := 30
	for i := 0; i < maxAttempts; i++ {
		db, err := sql.Open("mysql", dataSource)
		if err == nil {
			err = db.Ping()
			if err == nil {
				createDB(db, name)
				db.Close()
				runMigrations()
				seedData()
				logs.Info("Database initialization complete")
				return
			}
			db.Close()
		}
		logs.Info(fmt.Sprintf("Waiting for database... attempt %d/%d", i+1, maxAttempts))
		time.Sleep(2 * time.Second)
	}
	logs.Error("Failed to connect to database after maximum attempts")
}

func createDB(db *sql.DB, name string) {
	query := fmt.Sprintf("CREATE DATABASE IF NOT EXISTS %s DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci", name)
	_, err := db.Exec(query)
	if err != nil {
		logs.Error("Failed to create database:", err)
	}
}

func runMigrations() {
	o := orm.NewOrm()
	migrations := []string{
		`CREATE TABLE IF NOT EXISTS warehouse_area (
			id INT AUTO_INCREMENT PRIMARY KEY,
			name VARCHAR(100) NOT NULL,
			code VARCHAR(50) NOT NULL UNIQUE,
			description VARCHAR(500),
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
		`CREATE TABLE IF NOT EXISTS material (
			id INT AUTO_INCREMENT PRIMARY KEY,
			code VARCHAR(50) NOT NULL UNIQUE,
			name VARCHAR(100) NOT NULL,
			category VARCHAR(100),
			unit VARCHAR(20),
			warehouse_area_id INT,
			stock INT DEFAULT 0,
			description VARCHAR(500),
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			INDEX idx_warehouse_area_id (warehouse_area_id),
			INDEX idx_code (code)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
		`CREATE TABLE IF NOT EXISTS material_record (
			id INT AUTO_INCREMENT PRIMARY KEY,
			material_id INT NOT NULL,
			material_code VARCHAR(50),
			material_name VARCHAR(100),
			type VARCHAR(20) NOT NULL,
			quantity INT NOT NULL,
			operator VARCHAR(100),
			remark VARCHAR(500),
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			INDEX idx_material_id (material_id),
			INDEX idx_type (type),
			INDEX idx_created_at (created_at)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
	}
	for _, m := range migrations {
		_, err := o.Raw(m).Exec()
		if err != nil {
			logs.Error("Migration error:", err)
		}
	}
}

func seedData() {
	o := orm.NewOrm()

	var count int64
	count, _ = o.QueryTable("warehouse_area").Count()
	if count > 0 {
		return
	}

	areas := []models.WarehouseArea{
		{Name: "Main Warehouse Area A", Code: "A001", Description: "Main storage area for general materials"},
		{Name: "Main Warehouse Area B", Code: "A002", Description: "Storage area for large items"},
		{Name: "Climate Controlled Area", Code: "A003", Description: "Temperature and humidity controlled area"},
		{Name: "Hazardous Materials Area", Code: "A004", Description: "Storage for hazardous and flammable materials"},
		{Name: "Temporary Storage Area", Code: "A005", Description: "Temporary storage for incoming materials"},
	}
	for _, a := range areas {
		o.Insert(&a)
	}

	materials := []models.Material{
		{Code: "MAT001", Name: "Carbon Steel Pipe", Category: "Metal Materials", Unit: "meter", WarehouseAreaId: 1, Stock: 500, Description: "Standard carbon steel pipe for structural use"},
		{Code: "MAT002", Name: "Aluminum Alloy Sheet", Category: "Metal Materials", Unit: "sheet", WarehouseAreaId: 1, Stock: 200, Description: "5mm thick aluminum alloy sheet"},
		{Code: "MAT003", Name: "Rubber Gasket", Category: "Sealing Materials", Unit: "piece", WarehouseAreaId: 2, Stock: 1000, Description: "Industrial rubber sealing gasket"},
		{Code: "MAT004", Name: "Copper Wire", Category: "Electrical Materials", Unit: "meter", WarehouseAreaId: 1, Stock: 300, Description: "2.5mm copper electrical wire"},
		{Code: "MAT005", Name: "LED Light Strip", Category: "Electrical Materials", Unit: "meter", WarehouseAreaId: 2, Stock: 150, Description: "Waterproof LED light strip"},
		{Code: "MAT006", Name: "Chemical Solvent", Category: "Chemical Materials", Unit: "liter", WarehouseAreaId: 4, Stock: 50, Description: "Industrial cleaning solvent"},
		{Code: "MAT007", Name: "Precision Bearing", Category: "Mechanical Parts", Unit: "piece", WarehouseAreaId: 3, Stock: 80, Description: "High precision industrial bearing"},
		{Code: "MAT008", Name: "Hydraulic Oil", Category: "Lubricants", Unit: "liter", WarehouseAreaId: 4, Stock: 120, Description: "Industrial grade hydraulic oil"},
	}
	for _, m := range materials {
		o.Insert(&m)
	}

	records := []models.MaterialRecord{
		{MaterialId: 1, MaterialCode: "MAT001", MaterialName: "Carbon Steel Pipe", Type: "in", Quantity: 500, Operator: "System", Remark: "Initial stock entry"},
		{MaterialId: 2, MaterialCode: "MAT002", MaterialName: "Aluminum Alloy Sheet", Type: "in", Quantity: 200, Operator: "System", Remark: "Initial stock entry"},
		{MaterialId: 3, MaterialCode: "MAT003", MaterialName: "Rubber Gasket", Type: "in", Quantity: 1000, Operator: "System", Remark: "Initial stock entry"},
		{MaterialId: 4, MaterialCode: "MAT004", MaterialName: "Copper Wire", Type: "in", Quantity: 300, Operator: "System", Remark: "Initial stock entry"},
		{MaterialId: 5, MaterialCode: "MAT005", MaterialName: "LED Light Strip", Type: "in", Quantity: 150, Operator: "System", Remark: "Initial stock entry"},
		{MaterialId: 6, MaterialCode: "MAT006", MaterialName: "Chemical Solvent", Type: "in", Quantity: 50, Operator: "System", Remark: "Initial stock entry"},
		{MaterialId: 7, MaterialCode: "MAT007", MaterialName: "Precision Bearing", Type: "in", Quantity: 80, Operator: "System", Remark: "Initial stock entry"},
		{MaterialId: 8, MaterialCode: "MAT008", MaterialName: "Hydraulic Oil", Type: "in", Quantity: 120, Operator: "System", Remark: "Initial stock entry"},
	}
	for _, r := range records {
		o.Insert(&r)
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func main() {
	beego.Run()
}
