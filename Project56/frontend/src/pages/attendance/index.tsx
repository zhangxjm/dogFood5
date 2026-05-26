import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button, usePullDownRefresh } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { mockAttendanceRecords } from '@/data/mock';
import { AttendanceRecord } from '@/types';
import classnames from 'classnames';

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [canCheckIn, setCanCheckIn] = useState(false);

  useEffect(() => {
    console.log('[AttendancePage] Init attendance page');
    loadRecords();
    checkCanCheckIn();
  }, []);

  usePullDownRefresh(() => {
    console.log('[AttendancePage] Pull down refresh');
    setTimeout(() => {
      loadRecords();
      Taro.stopPullDownRefresh();
    }, 1000);
  });

  const loadRecords = () => {
    try {
      setRecords(mockAttendanceRecords);
      console.log('[AttendancePage] Records loaded:', mockAttendanceRecords.length);
    } catch (error) {
      console.error('[AttendancePage] Load records error:', error);
    }
  };

  const checkCanCheckIn = () => {
    const now = new Date();
    const hour = now.getHours();
    setCanCheckIn(hour >= 8 && hour <= 18);
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      present: '已出勤',
      absent: '缺勤',
      leave: '请假',
      late: '迟到'
    };
    return map[status] || status;
  };

  const getStats = () => {
    const total = records.length;
    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const leave = records.filter(r => r.status === 'leave').length;
    return { total, present, absent, leave };
  };

  const stats = getStats();

  const handlePrevMonth = () => {
    console.log('[AttendancePage] Prev month');
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    console.log('[AttendancePage] Next month');
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleCheckIn = () => {
    console.log('[AttendancePage] Check in');
    if (!canCheckIn) {
      Taro.showToast({ title: '非签到时间', icon: 'none' });
      return;
    }
    Taro.showLoading({ title: '签到中...' });
    setTimeout(() => {
      Taro.hideLoading();
      Taro.showToast({ title: '签到成功', icon: 'success' });
    }, 1500);
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    const days: Array<{ day: number; isToday: boolean; hasRecord: boolean }> = [];
    const emptyDays: number[] = [];

    for (let i = 0; i < firstDay; i++) {
      emptyDays.push(i);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = isCurrentMonth && today.getDate() === day;
      const hasRecord = records.some(r => r.scheduleDate === dateStr);
      days.push({ day, isToday, hasRecord });
    }

    return { emptyDays, days };
  };

  const { emptyDays, days } = generateCalendarDays();
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const monthText = `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月`;

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.statsSection}>
        <Text className={styles.statsTitle}>本月考勤统计</Text>
        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.total}</Text>
            <Text className={styles.statLabel}>总课时</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.present}</Text>
            <Text className={styles.statLabel}>已出勤</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.absent}</Text>
            <Text className={styles.statLabel}>缺勤</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.leave}</Text>
            <Text className={styles.statLabel}>请假</Text>
          </View>
        </View>
      </View>

      <Button className={styles.checkInBtn} onClick={handleCheckIn} disabled={!canCheckIn}>
        {canCheckIn ? '立即签到' : '非签到时间'}
      </Button>

      <View className={styles.calendarSection}>
        <View className={styles.calendarHeader}>
          <Button className={styles.navBtn} onClick={handlePrevMonth}>&lt;</Button>
          <Text className={styles.monthText}>{monthText}</Text>
          <Button className={styles.navBtn} onClick={handleNextMonth}>&gt;</Button>
        </View>
        <View className={styles.weekRow}>
          {weekDays.map(day => (
            <View key={day} className={styles.weekDay}>{day}</View>
          ))}
        </View>
        <View className={styles.daysGrid}>
          {emptyDays.map((_, index) => (
            <View key={`empty-${index}`} className={styles.emptyCell} />
          ))}
          {days.map(({ day, isToday, hasRecord }) => (
            <View key={day} className={styles.dayCell}>
              <View className={classnames(
                styles.dayContent,
                isToday && styles.today,
                hasRecord && styles.hasRecord
              )}>
                {day}
              </View>
            </View>
          ))}
        </View>
        <View className={styles.legend}>
          <View className={styles.legendItem}>
            <View className={`${styles.legendDot} ${styles.present}`} />
            <Text>出勤</Text>
          </View>
          <View className={styles.legendItem}>
            <View className={`${styles.legendDot} ${styles.absent}`} />
            <Text>缺勤</Text>
          </View>
          <View className={styles.legendItem}>
            <View className={`${styles.legendDot} ${styles.leave}`} />
            <Text>请假</Text>
          </View>
          <View className={styles.legendItem}>
            <View className={`${styles.legendDot} ${styles.late}`} />
            <Text>迟到</Text>
          </View>
        </View>
      </View>

      <View className={styles.recordSection}>
        <Text className={styles.sectionTitle}>考勤记录</Text>
        {records.length > 0 ? (
          <View className={styles.recordList}>
            {records.map(record => (
              <View key={record.id} className={styles.recordCard}>
                <View className={styles.recordInfo}>
                  <Text className={styles.courseName}>{record.courseName}</Text>
                  <Text className={styles.recordMeta}>
                    📅 {record.scheduleDate} | 👶 {record.childName}
                    {record.checkInTime && ` | ⏰ ${record.checkInTime}`}
                  </Text>
                </View>
                <View className={classnames(styles.recordStatus, styles[record.status])}>
                  {getStatusText(record.status)}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📊</Text>
            <Text className={styles.emptyText}>暂无考勤记录</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
