import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Swiper, SwiperItem, usePullDownRefresh } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { mockCourses } from '@/data/mock';
import { Course } from '@/types';

export default function IndexPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [hotCourses, setHotCourses] = useState<Course[]>([]);

  useEffect(() => {
    console.log('[HomePage] Init home page');
    loadCourses();
  }, []);

  usePullDownRefresh(() => {
    console.log('[HomePage] Pull down refresh');
    setTimeout(() => {
      loadCourses();
      Taro.stopPullDownRefresh();
    }, 1000);
  });

  const loadCourses = () => {
    try {
      setCourses(mockCourses);
      setHotCourses(mockCourses.slice(0, 4));
      console.log('[HomePage] Courses loaded:', mockCourses.length);
    } catch (error) {
      console.error('[HomePage] Load courses error:', error);
    }
  };

  const handleCourseClick = (course: Course) => {
    console.log('[HomePage] Click course:', course.name);
    Taro.navigateTo({
      url: `/pages/course-detail/index?id=${course.id}`
    });
  };

  const handleMore = () => {
    console.log('[HomePage] Navigate to courses page');
    Taro.switchTab({
      url: '/pages/courses/index'
    });
  };

  const handleQuickEntry = (type: string) => {
    console.log('[HomePage] Quick entry:', type);
    switch (type) {
      case 'hot':
        Taro.switchTab({ url: '/pages/courses/index' });
        break;
      case 'new':
        Taro.switchTab({ url: '/pages/courses/index' });
        break;
      case 'all':
        Taro.switchTab({ url: '/pages/courses/index' });
        break;
    }
  };

  const banners = [
    { id: 1, image: 'https://picsum.photos/id/312/750/400', title: '暑期亲子手工营火热报名中' },
    { id: 2, image: 'https://picsum.photos/id/431/750/400', title: '新用户首单立减20元' },
    { id: 3, image: 'https://picsum.photos/id/625/750/400', title: '创意彩泥手工坊新课上线' }
  ];

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <Text className={styles.welcome}>欢迎来到亲子手工课</Text>
        <Text className={styles.subtitle}>发现创意，快乐成长</Text>
      </View>

      <Swiper
        className={styles.swiper}
        autoplay
        circular
        indicatorDots
        indicatorColor="rgba(255,255,255,0.5)"
        indicatorActiveColor="#ffffff"
      >
        {banners.map(banner => (
          <SwiperItem key={banner.id}>
            <Image
              src={banner.image}
              mode="aspectFill"
              style="width: 100%; height: 320rpx;"
              onError={(e) => console.error('[HomePage] Banner image error:', e)}
            />
          </SwiperItem>
        ))}
      </Swiper>

      <View className={styles.quickEntry}>
        <View className={styles.entryCard} onClick={() => handleQuickEntry('hot')}>
          <View className={`${styles.entryIcon} ${styles.hot}`}>🔥</View>
          <Text className={styles.entryText}>热门课程</Text>
        </View>
        <View className={styles.entryCard} onClick={() => handleQuickEntry('new')}>
          <View className={`${styles.entryIcon} ${styles.new}`}>✨</View>
          <Text className={styles.entryText}>新课推荐</Text>
        </View>
        <View className={styles.entryCard} onClick={() => handleQuickEntry('all')}>
          <View className={`${styles.entryIcon} ${styles.all}`}>📚</View>
          <Text className={styles.entryText}>全部课程</Text>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>热门推荐</Text>
          <Text className={styles.more} onClick={handleMore}>查看更多 &gt;</Text>
        </View>
      </View>

      <ScrollView className={styles.hotList} scrollX>
        {hotCourses.map(course => (
          <View key={course.id} className={styles.hotItem} onClick={() => handleCourseClick(course)}>
            <Image
              className={styles.hotImage}
              src={course.image}
              mode="aspectFill"
              onError={(e) => console.error('[HomePage] Course image error:', e)}
            />
            <View className={styles.hotInfo}>
              <Text className={styles.hotName}>{course.name}</Text>
              <View className={styles.hotMeta}>
                <View>
                  <Text className={styles.price}>¥{course.price}</Text>
                  <Text className={styles.originalPrice}>¥{course.originalPrice}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>最新课程</Text>
          <Text className={styles.more} onClick={handleMore}>查看更多 &gt;</Text>
        </View>
        <View className={styles.courseList}>
          {courses.slice(0, 3).map(course => (
            <View key={course.id} className={styles.courseCard} onClick={() => handleCourseClick(course)}>
              <Image
                className={styles.courseImage}
                src={course.image}
                mode="aspectFill"
                onError={(e) => console.error('[HomePage] Course image error:', e)}
              />
              <View className={styles.courseInfo}>
                <Text className={styles.courseName}>{course.name}</Text>
                <Text className={styles.courseDesc}>{course.description}</Text>
                <View className={styles.courseTags}>
                  {course.tags.slice(0, 3).map((tag, index) => (
                    <Text key={index} className={styles.tag}>{tag}</Text>
                  ))}
                </View>
                <View className={styles.courseFooter}>
                  <Text className={styles.teacher}>讲师：{course.teacher}</Text>
                  <View className={styles.rating}>
                    <Text>⭐ {course.rating}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
