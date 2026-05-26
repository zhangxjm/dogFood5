package com.afternoontea.controller;

import com.afternoontea.dto.CategoryStatsDTO;
import com.afternoontea.dto.DepartmentStatsDTO;
import com.afternoontea.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/statistics")
@CrossOrigin(origins = "*")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/department")
    public ResponseEntity<List<DepartmentStatsDTO>> getDepartmentStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        return ResponseEntity.ok(statisticsService.getDepartmentStats(startTime, endTime));
    }

    @GetMapping("/category")
    public ResponseEntity<List<CategoryStatsDTO>> getCategoryStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        return ResponseEntity.ok(statisticsService.getCategoryStats(startTime, endTime));
    }

    @GetMapping("/overall")
    public ResponseEntity<Map<String, Object>> getOverallStats() {
        return ResponseEntity.ok(statisticsService.getOverallStats());
    }
}
