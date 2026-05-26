import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Button, usePullDownRefresh } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { mockCourses, categories } from '@/data/mock';
import { Course } from '@/types';
import classnames from 'classnames';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('[CoursesPage] Init courses page');
    loadCourses();
  }, []);

  usePullDownRefresh(() => {
    console.log('[CoursesPage] Pull down refresh');
    setTimeout(() => {
      loadCourses();
      Taro.stopPullDownRefresh();
    }, 1000);
  });

  const loadCourses = () => {
    try {
      setLoading(true);
      setCourses(mockCourses);
      setFilteredCourses(mockCourses);
      console.log('[CoursesPage] Courses loaded:', mockCourses.length);
    } catch (error) {
      console.error('[CoursesPage] Load courses error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    console.log('[CoursesPage] Select category:', category);
    setActiveCategory(category);
    if (category === '全部') {
      setFilteredCourses(courses);
    } else {
      setFilteredCourses(courses.filter(c => c.category === category));
    }
  };

  const handleCourseClick = (course: Course) => {
    console.log('[CoursesPage] Click course:', course.name);
    Taro.navigateTo({
      url: `/pages/course-detail/index?id=${course.id}`
    });
  };

  const handleEnroll = (e: React.MouseEvent, course: Course) => {
    e.stopPropagation();
    console.log('[CoursesPage] Click enroll:', course.name);
    Taro.navigateTo({
      url: `/pages/course-detail/index?id=${course.id}`
    });
  };

  const getDifficultyText = (difficulty: string) => {
    const map = { easy: '入门', medium: '进阶', hard: '高级' };
    return map[difficulty] || difficulty;
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <ScrollView className={styles.categoryScroll} scrollX>
        {categories.map(category => (
          <View
            key={category}
            className={classnames(styles.categoryItem, activeCategory === category && styles.active)}
            onClick={() => handleCategoryChange(category)}
          >
            <Text>{category}</Text>
          </View>
        ))}
      </ScrollView>

      <View className={styles.courseList}>
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <View key={course.id} className={styles.courseCard} onClick={() => handleCourseClick(course)}>
              <View className={styles.courseHeader}>
                <Image
                  className={styles.courseImage}
                  src={course.image}
                  mode="aspectFill"
                  onError={(e) => console.error('[CoursesPage] Course image error:', e)}
                />
                <View className={styles.teacherBadge}>👨‍🏫 {course.teacher}</View>
              </View>
              <View className={styles.courseBody}>
                <Text className={styles.courseTitle}>{course.name}</Text>
                <View className={styles.courseMeta}>
                  <Text className={styles.metaItem}>⏱️ {course.duration}</Text>
                  <Text className={styles.metaItem}>👶 {course.ageRange}</Text>
                  <Text className={styles.metaItem}>📊 {getDifficultyText(course.difficulty)}</Text>
                </View>
                <View className={styles.courseTags}>
                  {course.tags.slice(0, 3).map((tag, index) => (
                    <Text key={index} className={styles.tag}>{tag}</Text>
                  ))}
                </View>
                <View className={styles.courseFooter}>
                  <View className={styles.priceInfo}>
                    <Text className={styles.price}>¥{course.price}</Text>
                    <Text className={styles.originalPrice}>¥{course.originalPrice}</Text>
                  </View>
                  <Button
                    className={styles.enrollBtn}
                    onClick={(e) => handleEnroll(e, course)}
                  >
                    立即报名
                  </Button>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📭</Text>
            <Text className={styles.emptyText}>暂无相关课程</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
