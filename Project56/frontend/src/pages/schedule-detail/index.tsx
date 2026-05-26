import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

export default function ScheduleDetailPage() {
  return (
    <View className={styles.page}>
      <Text className={styles.icon}>📅</Text>
      <Text className={styles.title}>排班详情</Text>
      <Text className={styles.text}>功能正在开发中...</Text>
    </View>
  );
}
