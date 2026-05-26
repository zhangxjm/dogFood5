package com.nailschedule.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.nailschedule.entity.Appointment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Mapper
public interface AppointmentMapper extends BaseMapper<Appointment> {

    @Select("SELECT a.id, a.customer_name, a.customer_phone, a.technician_id, " +
            "a.appointment_date, a.appointment_time, a.service_type, a.status, a.remark, " +
            "t.name as technician_name " +
            "FROM appointment a LEFT JOIN technician t ON a.technician_id = t.id " +
            "WHERE a.appointment_date = #{date} ORDER BY a.appointment_time")
    List<Map<String, Object>> findByDate(@Param("date") LocalDate date);

    @Select("SELECT a.id, a.customer_name, a.customer_phone, a.technician_id, " +
            "a.appointment_date, a.appointment_time, a.service_type, a.status, a.remark, " +
            "t.name as technician_name " +
            "FROM appointment a LEFT JOIN technician t ON a.technician_id = t.id " +
            "WHERE a.technician_id = #{technicianId} " +
            "AND a.appointment_date BETWEEN #{startDate} AND #{endDate} " +
            "ORDER BY a.appointment_date, a.appointment_time")
    List<Map<String, Object>> findByTechnicianAndDateRange(@Param("technicianId") Long technicianId,
                                                            @Param("startDate") LocalDate startDate,
                                                            @Param("endDate") LocalDate endDate);
}
