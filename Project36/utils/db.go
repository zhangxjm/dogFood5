package utils

import (
	"fmt"
	"log"

	beego "github.com/beego/beego/v2/server/web"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
)

var DB *gorm.DB

func InitDB() {
	host, _ := beego.AppConfig.String("db::mysql_host")
	port, _ := beego.AppConfig.String("db::mysql_port")
	user, _ := beego.AppConfig.String("db::mysql_user")
	password, _ := beego.AppConfig.String("db::mysql_password")
	dbname, _ := beego.AppConfig.String("db::mysql_db")
	charset, _ := beego.AppConfig.String("db::mysql_charset")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=%s&parseTime=true&loc=Local",
		user, password, host, port, dbname, charset)

	var err error
	DB, err = gorm.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	DB.DB().SetMaxIdleConns(10)
	DB.DB().SetMaxOpenConns(100)
	DB.LogMode(true)

	log.Println("Database connection established successfully")
}
