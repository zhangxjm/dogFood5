import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Button, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { mockCourses, mockSchedules } from '@/data/mock';
import { Course, Schedule } from '@/types';
import classnames from 'classnames';

interface Child {
  id: number;
  name: string;
  age: number;
  gender: 'boy' | 'girl';
}

export default function EnrollmentConfirmPage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [parentName, setParentName] = useState('张女士');
  const [parentPhone, setParentPhone] = useState('13888888888');

  const children: Child[] = [
    { id: 1, name: '小明', age: 5, gender: 'boy' },
    { id: 2, name: '小红', age: 7, gender: 'girl' }
  ];

  useEffect(() => {
    console.log('[EnrollmentConfirmPage] Init page');
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const courseId = Number(currentPage?.options?.courseId || 1);
    const scheduleId = Number(currentPage?.options?.scheduleId || 0);
    loadData(courseId, scheduleId);
  }, []);

  const loadData = (courseId: number, scheduleId: number) => {
    try {
      const foundCourse = mockCourses.find(c => c.id === courseId);
      if (foundCourse) {
        setCourse(foundCourse);
        console.log('[EnrollmentConfirmPage] Course loaded:', foundCourse.name);
      }

      if (scheduleId > 0) {
        const foundSchedule = mockSchedules.find(s => s.id === scheduleId);
        if (foundSchedule) {
          setSchedule(foundSchedule);
          console.log('[EnrollmentConfirmPage] Schedule loaded:', foundSchedule.date);
        }
      } else {
        const courseSchedules = mockSchedules.filter(s => s.courseId === courseId);
        if (courseSchedules.length > 0) {
          setSchedule(courseSchedules[0]);
        }
      }

      if (children.length > 0) {
        setSelectedChild(children[0]);
      }
    } catch (error) {
      console.error('[EnrollmentConfirmPage] Load data error:', error);
    }
  };

  const handleChildSelect = (child: Child) => {
    console.log('[EnrollmentConfirmPage] Select child:', child.name);
    setSelectedChild(child);
  };

  const handleAddChild = () => {
    console.log('[EnrollmentConfirmPage] Add child');
    Taro.showToast({ title: '添加学员', icon: 'none' });
  };

  const handleSubmit = () => {
    console.log('[EnrollmentConfirmPage] Submit enrollment');
    if (!selectedChild) {
      Taro.showToast({ title: '请选择学员', icon: 'none' });
      return;
    }
    if (!parentName || !parentPhone) {
      Taro.showToast({ title: '请填写家长信息', icon: 'none' });
      return;
    }

    Taro.showLoading({ title: '提交中...' });
    setTimeout(() => {
      Taro.hideLoading();
      Taro.showModal({
        title: '报名成功',
        content: '请在30分钟内完成支付',
        showCancel: false,
        success: () => {
          Taro.switchTab({ url: '/pages/enrollment/index' });
        }
      });
    }, 1500);
  };

  if (!course || !schedule) {
    return (
      <View className={styles.page}>
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>课程信息</Text>
        </View>
        <View className={styles.sectionBody}>
          <View className={styles.courseInfo}>
            <Image
              className={styles.courseImage}
              src={course.image}
              mode="aspectFill"
              onError={(e) => console.error('[EnrollmentConfirmPage] Course image error:', e)}
            />
            <View className={styles.courseText}>
              <Text className={styles.courseName}>{course.name}</Text>
              <Text className={styles.scheduleText}>📅 {schedule.date} {schedule.startTime}-{schedule.endTime}</Text>
              <Text className={styles.teacherText}>👨‍🏫 {schedule.teacher} | 📍 {schedule.classroom}</Text>
            </View>
          </View>
          <View className={styles.priceRow}>
            <Text className={styles.priceLabel}>课程费用</Text>
            <Text className={styles.priceValue}>¥{course.price}</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>班期信息</Text>
        </View>
        <View className={styles.sectionBody}>
          <View className={styles.scheduleCard}>
            <View className={styles.scheduleRow}>
              <Text className={styles.scheduleLabel}>上课日期</Text>
              <Text className={styles.scheduleValue}>{schedule.date}</Text>
            </View>
            <View className={styles.scheduleRow}>
              <Text className={styles.scheduleLabel}>上课时间</Text>
              <Text className={styles.scheduleValue}>{schedule.startTime} - {schedule.endTime}</Text>
            </View>
            <View className={styles.scheduleRow}>
              <Text className={styles.scheduleLabel}>上课地点</Text>
              <Text className={styles.scheduleValue}>{schedule.classroom}</Text>
            </View>
            <View className={styles.scheduleRow}>
              <Text className={styles.scheduleLabel}>剩余名额</Text>
              <Text className={styles.scheduleValue}>{schedule.capacity - schedule.enrolled}个</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>选择学员</Text>
        </View>
        <View className={styles.sectionBody}>
          <View className={styles.childSelector}>
            {children.map(child => (
              <View
                key={child.id}
                className={classnames(
                  styles.childOption,
                  selectedChild?.id === child.id && styles.selected
                )}
                onClick={() => handleChildSelect(child)}
              >
                <Text className={styles.childAvatar}>
                  {child.gender === 'boy' ? '👦' : '👧'}
                </Text>
                <View>
                  <Text className={styles.childName}>{child.name}</Text>
                  <Text className={styles.childAge}>{child.age}岁</Text>
                </View>
              </View>
            ))}
            <Button className={styles.addChildBtn} onClick={handleAddChild}>
              + 添加学员
            </Button>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>家长信息</Text>
        </View>
        <View className={styles.sectionBody}>
          <View className={styles.formGroup}>
            <Text className={styles.formLabel}>家长姓名</Text>
            <Input
              className={styles.formInput}
              placeholder="请输入家长姓名"
              value={parentName}
              onInput={(e) => setParentName(e.detail.value)}
            />
          </View>
          <View className={styles.formGroup}>
            <Text className={styles.formLabel}>联系电话</Text>
            <Input
              className={styles.formInput}
              placeholder="请输入联系电话"
              type="number"
              value={parentPhone}
              onInput={(e) => setParentPhone(e.detail.value)}
            />
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionBody}>
          <View className={styles.noticeBox}>
            <Text className={styles.noticeText}>
              📝 温馨提示：报名成功后请在30分钟内完成支付，逾期订单将自动取消。课程开始前24小时可申请退款，逾期不予退款。
            </Text>
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.totalPrice}>
          应付金额
          <Text className={styles.price}>¥{course.price}</Text>
        </View>
        <Button className={styles.payBtn} onClick={handleSubmit}>
          提交报名
        </Button>
      </View>
    </ScrollView>
  );
}
