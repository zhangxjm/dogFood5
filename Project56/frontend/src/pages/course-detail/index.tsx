import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { mockCourses, mockSchedules } from '@/data/mock';
import { Course, Schedule } from '@/types';

export default function CourseDetailPage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    console.log('[CourseDetailPage] Init course detail page');
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const id = currentPage?.options?.id || '1';
    loadCourse(Number(id));
  }, []);

  const loadCourse = (id: number) => {
    try {
      const foundCourse = mockCourses.find(c => c.id === id);
      if (foundCourse) {
        setCourse(foundCourse);
        const courseSchedules = mockSchedules.filter(s => s.courseId === id);
        setSchedules(courseSchedules);
        console.log('[CourseDetailPage] Course loaded:', foundCourse.name);
      }
    } catch (error) {
      console.error('[CourseDetailPage] Load course error:', error);
    }
  };

  const handleFavorite = () => {
    console.log('[CourseDetailPage] Toggle favorite');
    setIsFavorite(!isFavorite);
    Taro.showToast({
      title: isFavorite ? '已取消收藏' : '已收藏',
      icon: 'success'
    });
  };

  const handleEnroll = () => {
    console.log('[CourseDetailPage] Click enroll');
    if (!course) return;
    Taro.navigateTo({
      url: `/pages/enrollment-confirm/index?courseId=${course.id}`
    });
  };

  const handleScheduleClick = (schedule: Schedule) => {
    console.log('[CourseDetailPage] Click schedule:', schedule.date);
    Taro.navigateTo({
      url: `/pages/enrollment-confirm/index?courseId=${course?.id}&scheduleId=${schedule.id}`
    });
  };

  const getDifficultyText = (difficulty: string) => {
    const map = { easy: '入门级', medium: '进阶级', hard: '高级' };
    return map[difficulty] || difficulty;
  };

  if (!course) {
    return (
      <View className={styles.page}>
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <Image
        className={styles.courseImage}
        src={course.image}
        mode="aspectFill"
        onError={(e) => console.error('[CourseDetailPage] Course image error:', e)}
      />

      <View className={styles.courseInfo}>
        <View className={styles.priceRow}>
          <Text className={styles.price}>¥{course.price}</Text>
          <Text className={styles.originalPrice}>¥{course.originalPrice}</Text>
        </View>
        <Text className={styles.courseName}>{course.name}</Text>
        <View className={styles.tags}>
          {course.tags.map((tag, index) => (
            <Text key={index} className={styles.tag}>{tag}</Text>
          ))}
        </View>
        <View className={styles.metaRow}>
          <Text className={styles.metaItem}>⏱️ {course.duration}</Text>
          <Text className={styles.metaItem}>👶 {course.ageRange}</Text>
          <Text className={styles.metaItem}>📊 {getDifficultyText(course.difficulty)}</Text>
          <Text className={styles.metaItem}>⭐ {course.rating}分</Text>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>授课老师</Text>
        </View>
        <View className={styles.sectionBody}>
          <View className={styles.teacherInfo}>
            <View className={styles.teacherAvatar}>👨‍🏫</View>
            <View className={styles.teacherDetail}>
              <Text className={styles.teacherName}>{course.teacher}</Text>
              <Text className={styles.teacherIntro}>资深手工课教师，10年教学经验</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>课程材料</Text>
        </View>
        <View className={styles.sectionBody}>
          <View className={styles.materialsList}>
            {course.materials.map((material, index) => (
              <Text key={index} className={styles.materialItem}>📦 {material}</Text>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>课程介绍</Text>
        </View>
        <View className={styles.sectionBody}>
          <Text className={styles.descText}>{course.description}</Text>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>可选班期（{schedules.length}个）</Text>
        </View>
        <View className={styles.sectionBody}>
          <View className={styles.scheduleList}>
            {schedules.map(schedule => (
              <View
                key={schedule.id}
                className={styles.scheduleItem}
                onClick={() => handleScheduleClick(schedule)}
              >
                <View className={styles.scheduleLeft}>
                  <Text className={styles.scheduleDate}>📅 {schedule.date}</Text>
                  <View className={styles.scheduleMeta}>
                    <Text>⏰ {schedule.startTime}-{schedule.endTime}</Text>
                    <Text>📍 {schedule.classroom}</Text>
                  </View>
                </View>
                <Text className={styles.capacity}>
                  {schedule.enrolled}/{schedule.capacity}人
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.priceBox}>
          <Text className={styles.price}>¥{course.price}</Text>
          <Text className={styles.originalPrice}>¥{course.originalPrice}</Text>
        </View>
        <Button className={styles.favBtn} onClick={handleFavorite}>
          {isFavorite ? '❤️' : '🤍'}
        </Button>
        <Button className={styles.enrollBtn} onClick={handleEnroll}>
          立即报名
        </Button>
      </View>
    </ScrollView>
  );
}
