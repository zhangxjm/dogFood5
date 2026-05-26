package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

type Employee struct {
	ID        uint   `gorm:"primaryKey" json:"id"`
	Name      string `gorm:"size:100;not null" json:"name"`
	Dept      string `gorm:"size:100" json:"dept"`
	EmployeeNo string `gorm:"size:50;uniqueIndex" json:"employee_no"`
	Phone     string `gorm:"size:50" json:"phone"`
	CreatedAt time.Time `json:"created_at"`
}

type EmployeeAccess struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	EmployeeID uint      `gorm:"index" json:"employee_id"`
	Employee   *Employee `gorm:"foreignKey:EmployeeID" json:"employee,omitempty"`
	Direction  string    `gorm:"size:10;not null" json:"direction"`
	Reason     string    `gorm:"size:200" json:"reason"`
	RecordTime time.Time `gorm:"index" json:"record_time"`
	CreatedAt  time.Time `json:"created_at"`
}

type Visitor struct {
	ID        uint   `gorm:"primaryKey" json:"id"`
	Name      string `gorm:"size:100;not null" json:"name"`
	IDCard    string `gorm:"size:50" json:"id_card"`
	Company   string `gorm:"size:100" json:"company"`
	Phone     string `gorm:"size:50" json:"phone"`
	Purpose   string `gorm:"size:200" json:"purpose"`
	Contact   string `gorm:"size:100" json:"contact"`
	Status    string `gorm:"size:20;default:visiting" json:"status"`
	VisitTime time.Time `json:"visit_time"`
	LeaveTime *time.Time `json:"leave_time"`
	CreatedAt time.Time `json:"created_at"`
}

var db *gorm.DB

func initDB() {
	var err error
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "./access.db"
	}
	db, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}
	_ = db.AutoMigrate(&Employee{}, &EmployeeAccess{}, &Visitor{})
	seedData()
}

func seedData() {
	var count int64
	db.Model(&Employee{}).Count(&count)
	if count > 0 {
		return
	}
	employees := []Employee{
		{Name: "Zhang Wei", Dept: "Production", EmployeeNo: "E001", Phone: "13800000001"},
		{Name: "Li Na", Dept: "Quality", EmployeeNo: "E002", Phone: "13800000002"},
		{Name: "Wang Qiang", Dept: "Logistics", EmployeeNo: "E003", Phone: "13800000003"},
		{Name: "Zhao Min", Dept: "Security", EmployeeNo: "E004", Phone: "13800000004"},
		{Name: "Chen Jie", Dept: "Engineering", EmployeeNo: "E005", Phone: "13800000005"},
	}
	for _, e := range employees {
		db.Create(&e)
	}

	now := time.Now()
	accesses := []EmployeeAccess{
		{EmployeeID: 1, Direction: "in", Reason: "work", RecordTime: now.Add(-8 * time.Hour)},
		{EmployeeID: 1, Direction: "out", Reason: "off work", RecordTime: now.Add(-1 * time.Hour)},
		{EmployeeID: 2, Direction: "in", Reason: "work", RecordTime: now.Add(-7 * time.Hour)},
		{EmployeeID: 3, Direction: "in", Reason: "work", RecordTime: now.Add(-6 * time.Hour)},
	}
	for _, a := range accesses {
		db.Create(&a)
	}

	visitors := []Visitor{
		{Name: "Sun Wu", IDCard: "110101199001010001", Company: "ABC Corp", Phone: "13900000001",
			Purpose: "Business negotiation", Contact: "Zhang Wei", Status: "left",
			VisitTime: now.Add(-3 * time.Hour), LeaveTime: ptr(now.Add(-1 * time.Hour))},
		{Name: "Zhou Liu", IDCard: "110101199203030002", Company: "XYZ Ltd", Phone: "13900000002",
			Purpose: "Equipment maintenance", Contact: "Wang Qiang", Status: "visiting",
			VisitTime: now.Add(-2 * time.Hour)},
	}
	for _, v := range visitors {
		db.Create(&v)
	}
}

func ptr(t time.Time) *time.Time { return &t }

func main() {
	initDB()

	r := gin.Default()
	r.Use(cors.Default())
	r.Static("/static", "./static")
	r.LoadHTMLGlob("templates/*")

	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})

	api := r.Group("/api")
	{
		api.GET("/employees", listEmployees)
		api.POST("/employees", createEmployee)
		api.DELETE("/employees/:id", deleteEmployee)

		api.GET("/access", listAccess)
		api.POST("/access", createAccess)

		api.GET("/visitors", listVisitors)
		api.POST("/visitors", createVisitor)
		api.POST("/visitors/:id/leave", leaveVisitor)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Server starting on :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}

func listEmployees(c *gin.Context) {
	var employees []Employee
	if err := db.Order("id desc").Find(&employees).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, employees)
}

func createEmployee(c *gin.Context) {
	var e Employee
	if err := c.ShouldBindJSON(&e); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if e.EmployeeNo == "" {
		e.EmployeeNo = fmt.Sprintf("E%03d", time.Now().Unix()%10000)
	}
	if err := db.Create(&e).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, e)
}

func deleteEmployee(c *gin.Context) {
	id := c.Param("id")
	var emp Employee
	if err := db.First(&emp, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "employee not found"})
		return
	}
	db.Where("employee_id = ?", emp.ID).Delete(&EmployeeAccess{})
	result := db.Delete(&emp)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

func listAccess(c *gin.Context) {
	var records []EmployeeAccess
	q := db.Preload("Employee").Order("record_time desc")
	if emp := c.Query("employee_id"); emp != "" {
		q = q.Where("employee_id = ?", emp)
	}
	if dir := c.Query("direction"); dir != "" {
		q = q.Where("direction = ?", dir)
	}
	if start := c.Query("start"); start != "" {
		q = q.Where("record_time >= ?", start)
	}
	if end := c.Query("end"); end != "" {
		q = q.Where("record_time <= ?", end)
	}
	if err := q.Find(&records).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, records)
}

func createAccess(c *gin.Context) {
	var a EmployeeAccess
	if err := c.ShouldBindJSON(&a); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if a.RecordTime.IsZero() {
		a.RecordTime = time.Now()
	}
	if err := db.Create(&a).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, a)
}

func listVisitors(c *gin.Context) {
	var visitors []Visitor
	q := db.Order("visit_time desc")
	if status := c.Query("status"); status != "" {
		q = q.Where("status = ?", status)
	}
	if err := q.Find(&visitors).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, visitors)
}

func createVisitor(c *gin.Context) {
	var v Visitor
	if err := c.ShouldBindJSON(&v); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if v.VisitTime.IsZero() {
		v.VisitTime = time.Now()
	}
	if v.Status == "" {
		v.Status = "visiting"
	}
	if err := db.Create(&v).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, v)
}

func leaveVisitor(c *gin.Context) {
	id := c.Param("id")
	now := time.Now()
	db.Model(&Visitor{}).Where("id = ?", id).Updates(map[string]interface{}{
		"status":     "left",
		"leave_time": now,
	})
	c.JSON(http.StatusOK, gin.H{"ok": true})
}
