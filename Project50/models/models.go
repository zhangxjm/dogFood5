package models

import (
	"fmt"
	"log"
	"time"

	beego "github.com/beego/beego/v2/server/web"
	_ "github.com/go-sql-driver/mysql"
	"xorm.io/xorm"
)

var (
	Engine *xorm.Engine
)

type Courier struct {
	Id          int64     `xorm:"pk autoincr" json:"id"`
	Name        string    `xorm:"varchar(50) notnull" json:"name"`
	Phone       string    `xorm:"varchar(20) notnull" json:"phone"`
	StudentId   string    `xorm:"varchar(20) notnull" json:"student_id"`
	College     string    `xorm:"varchar(100)" json:"college"`
	CreateTime  time.Time `xorm:"datetime created" json:"create_time"`
	UpdateTime  time.Time `xorm:"datetime updated" json:"update_time"`
}

type Express struct {
	Id           int64     `xorm:"pk autoincr" json:"id"`
	ExpressNo    string    `xorm:"varchar(50) notnull unique" json:"express_no"`
	SenderName   string    `xorm:"varchar(50)" json:"sender_name"`
	SenderPhone  string    `xorm:"varchar(20)" json:"sender_phone"`
	ReceiverName string    `xorm:"varchar(50) notnull" json:"receiver_name"`
	ReceiverPhone string   `xorm:"varchar(20) notnull" json:"receiver_phone"`
	CourierId    int64     `xorm:"index" json:"courier_id"`
	CourierName  string    `xorm:"varchar(50)" json:"courier_name"`
	PickupPoint  string    `xorm:"varchar(200)" json:"pickup_point"`
	GoodsType    string    `xorm:"varchar(50)" json:"goods_type"`
	Weight       float64   `xorm:"decimal(10,2)" json:"weight"`
	Status       int       `xorm:"default 0" json:"status"`
	Remark       string    `xorm:"text" json:"remark"`
	CreateTime   time.Time `xorm:"datetime created" json:"create_time"`
	UpdateTime   time.Time `xorm:"datetime updated" json:"update_time"`
}

type PickupRecord struct {
	Id           int64     `xorm:"pk autoincr" json:"id"`
	ExpressId    int64     `xorm:"index notnull" json:"express_id"`
	ExpressNo    string    `xorm:"varchar(50)" json:"express_no"`
	CourierId    int64     `xorm:"index" json:"courier_id"`
	CourierName  string    `xorm:"varchar(50)" json:"courier_name"`
	PickupTime   time.Time `xorm:"datetime" json:"pickup_time"`
	Remark       string    `xorm:"text" json:"remark"`
	CreateTime   time.Time `xorm:"datetime created" json:"create_time"`
}

func InitDB() {
	host, _ := beego.AppConfig.String("db_host")
	port, _ := beego.AppConfig.String("db_port")
	user, _ := beego.AppConfig.String("db_user")
	pass, _ := beego.AppConfig.String("db_pass")
	name, _ := beego.AppConfig.String("db_name")

	connStr := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=true&loc=Local", user, pass, host, port, name)

	var err error
	Engine, err = xorm.NewEngine("mysql", connStr)
	if err != nil {
		log.Printf("Database connection error: %v", err)
		log.Println("Trying to create database...")
		connStr2 := fmt.Sprintf("%s:%s@tcp(%s:%s)/?charset=utf8mb4&parseTime=true&loc=Local", user, pass, host, port)
		Engine, err = xorm.NewEngine("mysql", connStr2)
		if err != nil {
			log.Fatalf("Failed to connect to MySQL: %v", err)
		}
		_, err = Engine.Exec("CREATE DATABASE IF NOT EXISTS " + name + " DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
		if err != nil {
			log.Fatalf("Failed to create database: %v", err)
		}
		Engine.Close()
		connStr = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=true&loc=Local", user, pass, host, port, name)
		Engine, err = xorm.NewEngine("mysql", connStr)
		if err != nil {
			log.Fatalf("Failed to reconnect to database: %v", err)
		}
	}

	Engine.ShowSQL(true)
	Engine.SetMaxIdleConns(10)
	Engine.SetMaxOpenConns(100)

	err = Engine.Sync2(new(Courier), new(Express), new(PickupRecord))
	if err != nil {
		log.Fatalf("Failed to sync database schema: %v", err)
	}

	log.Println("Database initialized successfully")
}

func SeedData() {
	count, err := Engine.Count(&Courier{})
	if err != nil || count > 0 {
		return
	}

	couriers := []Courier{
		{Name: "张三", Phone: "13800138001", StudentId: "2021001", College: "计算机学院"},
		{Name: "李四", Phone: "13800138002", StudentId: "2021002", College: "经济管理学院"},
		{Name: "王五", Phone: "13800138003", StudentId: "2021003", College: "外国语学院"},
		{Name: "赵六", Phone: "13800138004", StudentId: "2021004", College: "机械工程学院"},
	}

	for _, c := range couriers {
		Engine.Insert(&c)
	}

	expressList := []Express{
		{ExpressNo: "SF1000001", SenderName: "商家A", SenderPhone: "01011111", ReceiverName: "陈同学", ReceiverPhone: "13900139001", CourierId: 1, CourierName: "张三", PickupPoint: "菜鸟驿站1号柜", GoodsType: "服装", Weight: 0.5, Status: 0},
		{ExpressNo: "SF1000002", SenderName: "商家B", SenderPhone: "01022222", ReceiverName: "刘同学", ReceiverPhone: "13900139002", CourierId: 2, CourierName: "李四", PickupPoint: "顺丰快递点", GoodsType: "电子产品", Weight: 1.2, Status: 1},
		{ExpressNo: "YD1000003", SenderName: "商家C", SenderPhone: "01033333", ReceiverName: "王同学", ReceiverPhone: "13900139003", CourierId: 1, CourierName: "张三", PickupPoint: "韵达快递点", GoodsType: "食品", Weight: 2.0, Status: 2},
		{ExpressNo: "JD1000004", SenderName: "商家D", SenderPhone: "01044444", ReceiverName: "孙同学", ReceiverPhone: "13900139004", CourierId: 3, CourierName: "王五", PickupPoint: "京东自提点", GoodsType: "图书", Weight: 0.8, Status: 0},
	}

	for _, e := range expressList {
		Engine.Insert(&e)
	}

	records := []PickupRecord{
		{ExpressId: 2, ExpressNo: "SF1000002", CourierId: 2, CourierName: "李四", PickupTime: time.Now().AddDate(0, 0, -1), Remark: "已送达"},
		{ExpressId: 3, ExpressNo: "YD1000003", CourierId: 1, CourierName: "张三", PickupTime: time.Now().AddDate(0, 0, -2), Remark: "客户已签收"},
	}

	for _, r := range records {
		Engine.Insert(&r)
	}

	log.Println("Seed data inserted successfully")
}
