package database

import (
	"time"

	"inspection-system/app/models"
)

func SeedData() error {
	db := GetDB()

	var pointCount int64
	db.Model(&models.InspectionPoint{}).Count(&pointCount)
	if pointCount > 0 {
		return nil
	}

	points := []models.InspectionPoint{
		{
			Name:        "长江大桥北岸监测点",
			Location:    "江苏省南京市鼓楼区长江大桥北岸",
			River:       "长江",
			Longitude:   118.7345678,
			Latitude:    32.1234567,
			Area:        "鼓楼区",
			Status:      1,
			Description: "长江大桥北岸重点监测区域",
		},
		{
			Name:        "黄河公园东岸监测点",
			Location:    "河南省郑州市中原区黄河公园东岸",
			River:       "黄河",
			Longitude:   113.6234567,
			Latitude:    34.7567890,
			Area:        "中原区",
			Status:      1,
			Description: "黄河公园东岸生态保护区",
		},
		{
			Name:        "珠江入海口监测点",
			Location:    "广东省广州市南沙区珠江入海口",
			River:       "珠江",
			Longitude:   113.5234567,
			Latitude:    22.7890123,
			Area:        "南沙区",
			Status:      1,
			Description: "珠江入海口水质监测点",
		},
		{
			Name:        "淮河生态段监测点",
			Location:    "安徽省蚌埠市禹会区淮河生态段",
			River:       "淮河",
			Longitude:   117.3456789,
			Latitude:    32.9234567,
			Area:        "禹会区",
			Status:      1,
			Description: "淮河生态保护重点区域",
		},
		{
			Name:        "海河湿地公园监测点",
			Location:    "天津市河东区海河湿地公园",
			River:       "海河",
			Longitude:   117.2345678,
			Latitude:    39.1234567,
			Area:        "河东区",
			Status:      1,
			Description: "海河湿地公园环境监测点",
		},
	}

	for _, point := range points {
		if err := db.Create(&point).Error; err != nil {
			return err
		}
	}

	now := time.Now()
	records := []models.InspectionRecord{
		{
			PointID:        1,
			InspectionTime: now.AddDate(0, 0, -5),
			Inspector:      "张三",
			ProblemType:    "水体污染",
			Description:    "发现水体有轻微异味，颜色偏黄，需要进一步检测",
			Severity:       "一般",
			Status:         "completed",
		},
		{
			PointID:        1,
			InspectionTime: now.AddDate(0, 0, -2),
			Inspector:      "李四",
			ProblemType:    "垃圾堆放",
			Description:    "岸边有游客丢弃的塑料垃圾，约5平方米",
			Severity:       "轻微",
			Status:         "pending",
		},
		{
			PointID:        2,
			InspectionTime: now.AddDate(0, 0, -7),
			Inspector:      "王五",
			ProblemType:    "非法采砂",
			Description:    "发现疑似非法采砂船只活动痕迹",
			Severity:       "严重",
			Status:         "processing",
		},
		{
			PointID:        2,
			InspectionTime: now.AddDate(0, 0, -1),
			Inspector:      "张三",
			ProblemType:    "植被破坏",
			Description:    "部分区域植被被人为破坏，约20平方米",
			Severity:       "一般",
			Status:         "pending",
		},
		{
			PointID:        3,
			InspectionTime: now.AddDate(0, 0, -10),
			Inspector:      "赵六",
			ProblemType:    "污水排放",
			Description:    "发现有企业偷偷排放工业废水",
			Severity:       "严重",
			Status:         "completed",
		},
		{
			PointID:        4,
			InspectionTime: now.AddDate(0, 0, -3),
			Inspector:      "李四",
			ProblemType:    "垃圾堆放",
			Description:    "河道内有大量漂浮垃圾",
			Severity:       "一般",
			Status:         "processing",
		},
		{
			PointID:        5,
			InspectionTime: now.AddDate(0, 0, -15),
			Inspector:      "王五",
			ProblemType:    "水体富营养化",
			Description:    "水面出现大量绿藻，水体富营养化",
			Severity:       "一般",
			Status:         "completed",
		},
		{
			PointID:        5,
			InspectionTime: now.AddDate(0, 0, -1),
			Inspector:      "赵六",
			ProblemType:    "违章建筑",
			Description:    "发现一处未经审批的临时建筑",
			Severity:       "严重",
			Status:         "pending",
		},
	}

	for _, record := range records {
		if err := db.Create(&record).Error; err != nil {
			return err
		}
	}

	rectTime := now.AddDate(0, 0, -3)
	rectifications := []models.RectificationRecord{
		{
			RecordID:          1,
			Measures:          "联系环保部门进行水质检测，加强周边企业排污监管",
			RectificationTime: &rectTime,
			PersonInCharge:    "张三",
			Status:            "completed",
			Remarks:           "已完成整改，水质恢复正常",
		},
		{
			RecordID:       3,
			Measures:       "已联系水务执法部门，正在调查取证",
			PersonInCharge: "李四",
			Status:         "processing",
			Remarks:        "调查中",
		},
		{
			RecordID:          5,
			Measures:          "联合执法查封排污企业，处以罚款并限期整改",
			RectificationTime: &rectTime,
			PersonInCharge:    "王五",
			Status:            "completed",
			Remarks:           "企业已停产整改，污水排放已停止",
		},
		{
			RecordID:       6,
			Measures:       "安排清洁人员进行河道垃圾清理",
			PersonInCharge: "赵六",
			Status:         "processing",
			Remarks:        "清理工作进行中",
		},
		{
			RecordID:          7,
			Measures:          "进行生态修复，投放微生物制剂，加强水体流动",
			RectificationTime: &rectTime,
			PersonInCharge:    "张三",
			Status:            "completed",
			Remarks:           "绿藻已清除，水体恢复正常",
		},
	}

	for _, rect := range rectifications {
		if err := db.Create(&rect).Error; err != nil {
			return err
		}
	}

	return nil
}
