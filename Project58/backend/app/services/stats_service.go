package services

import (
	"bytes"
	"encoding/csv"
	"inspection-system/app/database"
	"inspection-system/app/models"
	"strconv"
	"time"
)

type StatsService struct{}

func NewStatsService() *StatsService {
	return &StatsService{}
}

func (s *StatsService) GetSummary() (map[string]interface{}, error) {
	db := database.GetDB()

	var pointCount int64
	db.Model(&models.InspectionPoint{}).Count(&pointCount)

	var recordCount int64
	db.Model(&models.InspectionRecord{}).Count(&recordCount)

	var pendingCount int64
	db.Model(&models.InspectionRecord{}).Where("status = ?", "pending").Count(&pendingCount)

	var processingCount int64
	db.Model(&models.InspectionRecord{}).Where("status = ?", "processing").Count(&processingCount)

	var completedCount int64
	db.Model(&models.InspectionRecord{}).Where("status = ?", "completed").Count(&completedCount)

	now := time.Now()
	monthStart := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	var monthCount int64
	db.Model(&models.InspectionRecord{}).Where("inspection_time >= ?", monthStart).Count(&monthCount)

	return map[string]interface{}{
		"point_count":      pointCount,
		"record_count":     recordCount,
		"pending_count":    pendingCount,
		"processing_count": processingCount,
		"completed_count":  completedCount,
		"month_count":      monthCount,
	}, nil
}

func (s *StatsService) GetStatsByTime(startDate, endDate string) ([]map[string]interface{}, error) {
	db := database.GetDB()
	type DailyStat struct {
		Date  string
		Count int64
	}

	var stats []DailyStat
	query := db.Model(&models.InspectionRecord{}).
		Select("DATE(inspection_time) as date, COUNT(*) as count")

	if startDate != "" {
		query = query.Where("DATE(inspection_time) >= ?", startDate)
	}
	if endDate != "" {
		query = query.Where("DATE(inspection_time) <= ?", endDate)
	}

	query = query.Group("DATE(inspection_time)").Order("date ASC").Scan(&stats)
	if query.Error != nil {
		return nil, query.Error
	}

	result := make([]map[string]interface{}, len(stats))
	for i, stat := range stats {
		result[i] = map[string]interface{}{
			"date":  stat.Date,
			"count": stat.Count,
		}
	}

	return result, nil
}

func (s *StatsService) GetStatsByPoint() ([]map[string]interface{}, error) {
	db := database.GetDB()
	type PointStat struct {
		PointName string
		Count     int64
	}

	var stats []PointStat
	err := db.Model(&models.InspectionRecord{}).
		Select("inspection_points.name as point_name, COUNT(*) as count").
		Joins("JOIN inspection_points ON inspection_records.point_id = inspection_points.id").
		Group("point_id, inspection_points.name").
		Order("count DESC").
		Scan(&stats).Error
	if err != nil {
		return nil, err
	}

	result := make([]map[string]interface{}, len(stats))
	for i, stat := range stats {
		result[i] = map[string]interface{}{
			"point_name": stat.PointName,
			"count":      stat.Count,
		}
	}

	return result, nil
}

func (s *StatsService) GetStatsByType() ([]map[string]interface{}, error) {
	db := database.GetDB()
	type TypeStat struct {
		ProblemType string
		Count       int64
	}

	var stats []TypeStat
	err := db.Model(&models.InspectionRecord{}).
		Select("problem_type, COUNT(*) as count").
		Group("problem_type").
		Order("count DESC").
		Scan(&stats).Error
	if err != nil {
		return nil, err
	}

	result := make([]map[string]interface{}, len(stats))
	for i, stat := range stats {
		result[i] = map[string]interface{}{
			"problem_type": stat.ProblemType,
			"count":        stat.Count,
		}
	}

	return result, nil
}

func (s *StatsService) GetRectificationStats() (map[string]interface{}, error) {
	db := database.GetDB()

	var total int64
	db.Model(&models.InspectionRecord{}).Count(&total)

	var pending int64
	db.Model(&models.InspectionRecord{}).Where("status = ?", "pending").Count(&pending)

	var processing int64
	db.Model(&models.InspectionRecord{}).Where("status = ?", "processing").Count(&processing)

	var completed int64
	db.Model(&models.InspectionRecord{}).Where("status = ?", "completed").Count(&completed)

	rate := 0.0
	if total > 0 {
		rate = float64(completed) / float64(total) * 100
	}

	return map[string]interface{}{
		"total":           total,
		"pending":         pending,
		"processing":      processing,
		"completed":       completed,
		"completion_rate": rate,
	}, nil
}

func (s *StatsService) ExportRecords(filters map[string]interface{}) ([]byte, error) {
	db := database.GetDB()
	var records []models.InspectionRecord

	query := db.Preload("Point").Preload("Rectifications")

	if pointID, ok := filters["point_id"].(uint); ok && pointID > 0 {
		query = query.Where("point_id = ?", pointID)
	}
	if status, ok := filters["status"].(string); ok && status != "" {
		query = query.Where("status = ?", status)
	}
	if startDate, ok := filters["start_date"].(string); ok && startDate != "" {
		query = query.Where("inspection_time >= ?", startDate)
	}
	if endDate, ok := filters["end_date"].(string); ok && endDate != "" {
		query = query.Where("inspection_time <= ?", endDate)
	}

	if err := query.Order("inspection_time DESC").Find(&records).Error; err != nil {
		return nil, err
	}

	rows := [][]string{
		{"ID", "点位名称", "所属河道", "巡查时间", "巡查人员", "问题类型", "严重程度", "问题描述", "整改状态"},
	}

	for _, record := range records {
		statusText := "待整改"
		if record.Status == "processing" {
			statusText = "整改中"
		} else if record.Status == "completed" {
			statusText = "已完成"
		}

		rows = append(rows, []string{
			strconv.Itoa(int(record.ID)),
			record.Point.Name,
			record.Point.River,
			record.InspectionTime.Format("2006-01-02 15:04:05"),
			record.Inspector,
			record.ProblemType,
			record.Severity,
			record.Description,
			statusText,
		})
	}

	buf := &bytes.Buffer{}
	writer := csv.NewWriter(buf)
	writer.WriteAll(rows)
	writer.Flush()

	return buf.Bytes(), nil
}
