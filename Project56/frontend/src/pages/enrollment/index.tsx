import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Button, usePullDownRefresh } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { mockEnrollments } from '@/data/mock';
import { Enrollment } from '@/types';
import classnames from 'classnames';

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待支付' },
  { key: 'paid', label: '已支付' },
  { key: 'completed', label: '已完成' }
];

export default function EnrollmentPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<Enrollment[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('[EnrollmentPage] Init enrollment page');
    loadEnrollments();
  }, []);

  usePullDownRefresh(() => {
    console.log('[EnrollmentPage] Pull down refresh');
    setTimeout(() => {
      loadEnrollments();
      Taro.stopPullDownRefresh();
    }, 1000);
  });

  const loadEnrollments = () => {
    try {
      setLoading(true);
      setEnrollments(mockEnrollments);
      setFilteredEnrollments(mockEnrollments);
      console.log('[EnrollmentPage] Enrollments loaded:', mockEnrollments.length);
    } catch (error) {
      console.error('[EnrollmentPage] Load enrollments error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key: string) => {
    console.log('[EnrollmentPage] Select tab:', key);
    setActiveTab(key);
    if (key === 'all') {
      setFilteredEnrollments(enrollments);
    } else {
      setFilteredEnrollments(enrollments.filter(e => e.status === key));
    }
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      pending: '待支付',
      paid: '已支付',
      cancelled: '已取消',
      completed: '已完成'
    };
    return map[status] || status;
  };

  const handlePay = (enrollment: Enrollment) => {
    console.log('[EnrollmentPage] Click pay:', enrollment.id);
    Taro.showLoading({ title: '支付中...' });
    setTimeout(() => {
      Taro.hideLoading();
      Taro.showToast({ title: '支付成功', icon: 'success' });
      loadEnrollments();
    }, 1500);
  };

  const handleCancel = (enrollment: Enrollment) => {
    console.log('[EnrollmentPage] Click cancel:', enrollment.id);
    Taro.showModal({
      title: '取消报名',
      content: '确定要取消该课程的报名吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已取消', icon: 'success' });
        }
      }
    });
  };

  const handleGoCourses = () => {
    console.log('[EnrollmentPage] Go to courses page');
    Taro.switchTab({ url: '/pages/courses/index' });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.tabBar}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={classnames(styles.tabItem, activeTab === tab.key && styles.active)}
            onClick={() => handleTabChange(tab.key)}
          >
            <Text>{tab.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.enrollmentList}>
        {filteredEnrollments.length > 0 ? (
          filteredEnrollments.map(enrollment => (
            <View key={enrollment.id} className={styles.enrollmentCard}>
              <View className={styles.cardHeader}>
                <View className={classnames(styles.statusBadge, styles[enrollment.status])}>
                  {getStatusText(enrollment.status)}
                </View>
                <Text className={styles.orderNo}>订单号: {enrollment.id}</Text>
              </View>
              <View className={styles.cardBody}>
                <Image
                  className={styles.courseImage}
                  src={enrollment.courseImage}
                  mode="aspectFill"
                  onError={(e) => console.error('[EnrollmentPage] Course image error:', e)}
                />
                <View className={styles.courseInfo}>
                  <Text className={styles.courseName}>{enrollment.courseName}</Text>
                  <Text className={styles.scheduleInfo}>📅 {enrollment.scheduleDate} {enrollment.scheduleTime}</Text>
                  <Text className={styles.childInfo}>👶 学员：{enrollment.childName}（{enrollment.childAge}岁）</Text>
                </View>
              </View>
              <View className={styles.cardFooter}>
                <Text className={styles.amount}>
                  实付金额
                  <Text className={styles.price}>¥{enrollment.amount}</Text>
                </Text>
                <View className={styles.actionBtns}>
                  {enrollment.status === 'pending' && (
                    <>
                      <Button
                        className={classnames(styles.actionBtn, styles.secondary)}
                        onClick={() => handleCancel(enrollment)}
                      >
                        取消
                      </Button>
                      <Button
                        className={classnames(styles.actionBtn, styles.primary)}
                        onClick={() => handlePay(enrollment)}
                      >
                        去支付
                      </Button>
                    </>
                  )}
                  {enrollment.status === 'paid' && (
                    <Button
                      className={classnames(styles.actionBtn, styles.secondary)}
                    >
                      查看详情
                    </Button>
                  )}
                </View>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📋</Text>
            <Text className={styles.emptyText}>暂无报名记录</Text>
            <Button className={styles.goBtn} onClick={handleGoCourses}>
              去选课程
            </Button>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
