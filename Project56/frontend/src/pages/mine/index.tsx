import React from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

interface Child {
  id: number;
  name: string;
  age: number;
  gender: 'boy' | 'girl';
}

export default function MinePage() {
  const children: Child[] = [
    { id: 1, name: '小明', age: 5, gender: 'boy' },
    { id: 2, name: '小红', age: 7, gender: 'girl' }
  ];

  const menuItems = [
    { icon: '📋', text: '我的订单', key: 'order', color: '#1677FF' },
    { icon: '✅', text: '考勤记录', key: 'attendance', color: '#00B42A' },
    { icon: '❤️', text: '我的收藏', key: 'favorite', color: '#F53F3F' },
    { icon: '❓', text: '帮助中心', key: 'help', color: '#FF7D00' },
    { icon: 'ℹ️', text: '关于我们', key: 'about', color: '#722ED1' },
    { icon: '⚙️', text: '设置', key: 'settings', color: '#4E5969' }
  ];

  const handleMenuClick = (key: string) => {
    console.log('[MinePage] Click menu:', key);
    switch (key) {
      case 'order':
        Taro.switchTab({ url: '/pages/enrollment/index' });
        break;
      case 'attendance':
        Taro.switchTab({ url: '/pages/attendance/index' });
        break;
      case 'favorite':
      case 'help':
      case 'about':
      case 'settings':
        Taro.showToast({ title: '功能开发中', icon: 'none' });
        break;
    }
  };

  const handleAddChild = () => {
    console.log('[MinePage] Add child');
    Taro.showToast({ title: '添加学员', icon: 'none' });
  };

  const handleLogout = () => {
    console.log('[MinePage] Logout');
    Taro.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已退出', icon: 'success' });
        }
      }
    });
  };

  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.header}>
        <View className={styles.userInfo}>
          <View className={styles.avatar}>👤</View>
          <View className={styles.userText}>
            <Text className={styles.userName}>张女士</Text>
            <Text className={styles.userPhone}>138****8888</Text>
          </View>
        </View>
      </View>

      <View className={styles.childrenSection}>
        <Text className={styles.sectionTitle}>我的学员</Text>
        <View className={styles.childrenList}>
          {children.map(child => (
            <View key={child.id} className={styles.childItem}>
              <View className={styles.childAvatar}>
                {child.gender === 'boy' ? '👦' : '👧'}
              </View>
              <View className={styles.childInfo}>
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

      <View className={styles.menuSection}>
        {menuItems.map(item => (
          <View
            key={item.key}
            className={styles.menuItem}
            onClick={() => handleMenuClick(item.key)}
          >
            <View className={`${styles.menuIcon} ${styles[item.key]}`}>
              {item.icon}
            </View>
            <Text className={styles.menuText}>{item.text}</Text>
            <Text className={styles.menuArrow}>&gt;</Text>
          </View>
        ))}
      </View>

      <View className={styles.bottomSection}>
        <Button className={styles.logoutBtn} onClick={handleLogout}>
          退出登录
        </Button>
        <Text className={styles.version}>版本 v1.0.0</Text>
      </View>
    </ScrollView>
  );
}
