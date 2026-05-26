package seed

import (
	"dormitory-management/models"
	"dormitory-management/pkg/database"
	"fmt"
	"log"
	"math/rand"
	"time"

	"gorm.io/gorm"
)

func SeedData() error {
	var count int64
	database.DB.Model(&models.Dormitory{}).Count(&count)
	if count > 0 {
		log.Println("Data already seeded, skipping...")
		return nil
	}

	log.Println("Starting data initialization...")

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		dormitoryNames := []string{"1号楼", "2号楼", "3号楼"}
		var allRooms []models.Room
		var allBeds []models.Bed

		for _, name := range dormitoryNames {
			dormitory := models.Dormitory{
				Name:        name,
				FloorCount:  6,
				Description: fmt.Sprintf("%s - 工人宿舍楼", name),
			}
			if err := tx.Create(&dormitory).Error; err != nil {
				return fmt.Errorf("failed to create dormitory: %w", err)
			}
			log.Printf("Created dormitory: %s (ID: %d)", dormitory.Name, dormitory.ID)

			for floor := 1; floor <= 6; floor++ {
				for roomNum := 1; roomNum <= 8; roomNum++ {
					room := models.Room{
						DormitoryID: dormitory.ID,
						RoomNo:      fmt.Sprintf("%d%02d", floor, roomNum),
						Floor:       floor,
						BedCount:    4,
						RoomType:    "标准间",
					}
					allRooms = append(allRooms, room)
				}
			}
		}

		if err := tx.CreateInBatches(allRooms, 50).Error; err != nil {
			return fmt.Errorf("failed to create rooms: %w", err)
		}
		log.Printf("Created %d rooms", len(allRooms))

		for _, room := range allRooms {
			for i := 1; i <= 4; i++ {
				bed := models.Bed{
					RoomID: room.ID,
					BedNo:  fmt.Sprintf("%d号床", i),
					Status: models.BedStatusAvailable,
				}
				allBeds = append(allBeds, bed)
			}
		}

		if err := tx.CreateInBatches(allBeds, 100).Error; err != nil {
			return fmt.Errorf("failed to create beds: %w", err)
		}
		log.Printf("Created %d beds", len(allBeds))

		firstNames := []string{"张", "李", "王", "刘", "陈", "杨", "赵", "黄", "周", "吴", "徐", "孙", "马", "朱", "胡"}
		lastNames := []string{"伟", "芳", "娜", "敏", "静", "强", "磊", "军", "洋", "勇", "艳", "杰", "娟", "涛", "明"}
		workTypes := []string{"钢筋工", "木工", "瓦工", "架子工", "水电工", "焊工", "油漆工", "杂工"}
		teamNames := []string{"第一班组", "第二班组", "第三班组", "第四班组"}
		provinces := []string{"河南省", "四川省", "安徽省", "山东省", "江苏省", "湖北省", "湖南省", "河北省"}
		cities := []string{"郑州市", "成都市", "合肥市", "济南市", "南京市", "武汉市", "长沙市", "石家庄市"}

		r := rand.New(rand.NewSource(time.Now().UnixNano()))
		usedIDCards := make(map[string]bool)

		var allWorkers []models.Worker
		for i := 0; i < 50; i++ {
			name := firstNames[r.Intn(len(firstNames))] + lastNames[r.Intn(len(lastNames))]
			gender := "男"
			if r.Intn(10) < 3 {
				gender = "女"
			}
			age := 20 + r.Intn(40)

			var idCard string
			for {
				idCard = generateIDCard(r)
				if !usedIDCards[idCard] {
					usedIDCards[idCard] = true
					break
				}
			}

			phone := "1" + fmt.Sprintf("%d", 3+r.Intn(6))
			for j := 0; j < 9; j++ {
				phone += fmt.Sprintf("%d", r.Intn(10))
			}

			province := provinces[r.Intn(len(provinces))]
			city := cities[r.Intn(len(cities))]
			workType := workTypes[r.Intn(len(workTypes))]
			teamName := teamNames[r.Intn(len(teamNames))]

			worker := models.Worker{
				Name:             name,
				Gender:           gender,
				Age:              age,
				IDCard:           idCard,
				Phone:            phone,
				WorkType:         workType,
				TeamName:         teamName,
				Hometown:         province + city,
				EmergencyContact: firstNames[r.Intn(len(firstNames))] + lastNames[r.Intn(len(lastNames))],
				EmergencyPhone:   "1" + fmt.Sprintf("%d", 3+r.Intn(6)) + fmt.Sprintf("%d", r.Intn(1000000000)),
				Status:           models.WorkerStatusCheckedOut,
			}
			allWorkers = append(allWorkers, worker)
		}

		if err := tx.CreateInBatches(allWorkers, 20).Error; err != nil {
			return fmt.Errorf("failed to create workers: %w", err)
		}
		log.Printf("Created %d workers", len(allWorkers))

		var allBedsList []models.Bed
		tx.Where("status = ?", models.BedStatusAvailable).Find(&allBedsList)

		occupiedCount := 0

		for i := 0; i < 40 && i < len(allBedsList) && i < len(allWorkers); i++ {
			worker := allWorkers[i]
			bed := allBedsList[i]

			checkInDate := time.Now().AddDate(0, 0, -r.Intn(90))

			checkInRecord := models.CheckInRecord{
				WorkerID:         worker.ID,
				BedID:            bed.ID,
				CheckInDate:      checkInDate,
				ExpectedStayDays: 30 + r.Intn(180),
				Remark:           "",
				HasCheckedOut:    false,
			}
			if err := tx.Create(&checkInRecord).Error; err != nil {
				return fmt.Errorf("failed to create checkin record: %w", err)
			}

			bed.Status = models.BedStatusOccupied
			if err := tx.Save(&bed).Error; err != nil {
				return fmt.Errorf("failed to update bed status: %w", err)
			}

			worker.CurrentBedID = &bed.ID
			worker.Status = models.WorkerStatusLiving
			if err := tx.Save(&worker).Error; err != nil {
				return fmt.Errorf("failed to update worker: %w", err)
			}

			occupiedCount++
		}

		for i := 40; i < 45 && i < len(allBedsList) && i < len(allWorkers); i++ {
			worker := allWorkers[i]
			bed := allBedsList[i]

			checkInDate := time.Now().AddDate(0, 0, -60-r.Intn(60))
			checkOutDate := time.Now().AddDate(0, 0, -10-r.Intn(30))

			checkInRecord := models.CheckInRecord{
				WorkerID:         worker.ID,
				BedID:            bed.ID,
				CheckInDate:      checkInDate,
				ExpectedStayDays: 30 + r.Intn(180),
				Remark:           "",
				HasCheckedOut:    true,
			}
			if err := tx.Create(&checkInRecord).Error; err != nil {
				return fmt.Errorf("failed to create checkin record: %w", err)
			}

			actualStayDays := int(checkOutDate.Sub(checkInDate).Hours() / 24)
			if actualStayDays < 0 {
				actualStayDays = 0
			}

			checkOutRecord := models.CheckOutRecord{
				WorkerID:       worker.ID,
				BedID:          bed.ID,
				CheckInID:      checkInRecord.ID,
				CheckOutDate:   checkOutDate,
				ActualStayDays: actualStayDays,
				Reason:         []string{"工程完工", "返乡", "调往其他工地", "个人原因"}[r.Intn(4)],
				Remark:         "",
			}
			if err := tx.Create(&checkOutRecord).Error; err != nil {
				return fmt.Errorf("failed to create checkout record: %w", err)
			}
		}

		log.Printf("Data initialization completed successfully!")
		log.Printf("Created: %d dormitories, %d rooms, %d beds, %d workers, %d occupied beds",
			3, len(allRooms), len(allBeds), len(allWorkers), occupiedCount)

		return nil
	})

	return err
}

func generateIDCard(r *rand.Rand) string {
	idCard := ""
	for i := 0; i < 17; i++ {
		idCard += fmt.Sprintf("%d", r.Intn(10))
	}
	idCard += fmt.Sprintf("%d", r.Intn(10))
	return idCard
}
