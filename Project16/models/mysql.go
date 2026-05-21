package models

import (
	"log"

	"github.com/beego/beego/v2/client/orm"
	_ "github.com/go-sql-driver/mysql"
	_ "github.com/mattn/go-sqlite3"
)

func InitDB() {
	err := orm.RegisterDataBase("default", "sqlite3", "rescue.db")
	if err != nil {
		log.Println("Database connection error:", err)
	}

	orm.RegisterModel(new(RescueLocation), new(Volunteer), new(RescueInfo), new(Donation))

	err = orm.RunSyncdb("default", false, true)
	if err != nil {
		log.Println("Database sync error:", err)
	}
}
