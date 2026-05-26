package com.nailschedule.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.nailschedule.entity.Schedule;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Mapper
public interface ScheduleMapper extends BaseMapper<Schedule> {

    @Select("SELECT s.id, s.technician_id, s.schedule_date, s.start_time, s.end_time, s.shift_type, " +
            "t.name as technician_name " +
            "FROM schedule s LEFT JOIN technician t ON s.technician_id = t.id " +
            "WHERE s.schedule_date BETWEEN #{startDate} AND #{endDate} " +
            "ORDER BY s.schedule_date, s.start_time")
    List<Map<String, Object>> findByDateRange(@Param("startDate") LocalDate startDate,
                                               @Param("endDate") LocalDate endDate);
}
