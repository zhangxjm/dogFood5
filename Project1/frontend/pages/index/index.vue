<template>
  <view class="container">
    <view class="header">
      <text class="title">快递驿站管理系统</text>
    </view>
    
    <view class="menu-grid">
      <view class="menu-item" @click="goToInbound">
        <view class="menu-icon inbound-icon">📦</view>
        <text class="menu-text">快递入库</text>
      </view>
      
      <view class="menu-item" @click="goToPickup">
        <view class="menu-icon pickup-icon">✅</view>
        <text class="menu-text">取件核销</text>
      </view>
      
      <view class="menu-item" @click="goToList">
        <view class="menu-icon list-icon">📋</view>
        <text class="menu-text">快递列表</text>
      </view>
      
      <view class="menu-item" @click="goToStatistics">
        <view class="menu-icon stats-icon">📊</view>
        <text class="menu-text">数据统计</text>
      </view>
      
      <view class="menu-item" @click="goToExpired">
        <view class="menu-icon expired-icon">🔔</view>
        <text class="menu-text">滞留提醒</text>
      </view>
    </view>
    
    <view class="card stats-card">
      <text class="card-title">今日概览</text>
      <view class="stats-row">
        <view class="stat-item">
          <text class="stat-number">{{ statistics.todayInbound || 0 }}</text>
          <text class="stat-label">今日入库</text>
        </view>
        <view class="stat-item">
          <text class="stat-number">{{ statistics.todayPicked || 0 }}</text>
          <text class="stat-label">今日取件</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { expressApi } from '../../utils/api.js';

export default {
  data() {
    return {
      statistics: {}
    };
  },
  onLoad() {
    this.loadStatistics();
  },
  onShow() {
    this.loadStatistics();
  },
  methods: {
    async loadStatistics() {
      try {
        const res = await expressApi.getStatistics();
        this.statistics = res.data;
      } catch (e) {
        console.error(e);
      }
    },
    goToInbound() {
      uni.navigateTo({ url: '/pages/inbound/inbound' });
    },
    goToPickup() {
      uni.navigateTo({ url: '/pages/pickup/pickup' });
    },
    goToList() {
      uni.switchTab({ url: '/pages/list/list' });
    },
    goToStatistics() {
      uni.switchTab({ url: '/pages/statistics/statistics' });
    },
    goToExpired() {
      uni.switchTab({ url: '/pages/expired/expired' });
    }
  }
};
</script>

<style scoped>
.container {
  padding: 30rpx;
}

.header {
  text-align: center;
  padding: 40rpx 0;
}

.title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
}

.menu-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.menu-item {
  width: calc(50% - 10rpx);
  background: #fff;
  border-radius: 16rpx;
  padding: 40rpx 20rpx;
  text-align: center;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.menu-icon {
  font-size: 60rpx;
  margin-bottom: 16rpx;
}

.menu-text {
  font-size: 28rpx;
  color: #333;
}

.stats-card {
  margin-top: 20rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 30rpx;
}

.stats-row {
  display: flex;
  justify-content: space-around;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 48rpx;
  font-weight: bold;
  color: #007aff;
  display: block;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}
</style>
