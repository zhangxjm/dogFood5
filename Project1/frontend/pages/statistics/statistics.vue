<template>
  <view class="container">
    <view class="card">
      <text class="card-title">总体统计</text>
      <view class="stats-grid">
        <view class="stat-box">
          <text class="stat-value">{{ statistics.totalInbound || 0 }}</text>
          <text class="stat-label">总入库</text>
        </view>
        <view class="stat-box">
          <text class="stat-value picked">{{ statistics.totalPicked || 0 }}</text>
          <text class="stat-label">已取件</text>
        </view>
        <view class="stat-box">
          <text class="stat-value pending">{{ statistics.totalPending || 0 }}</text>
          <text class="stat-label">待取件</text>
        </view>
        <view class="stat-box">
          <text class="stat-value expired">{{ statistics.totalExpired || 0 }}</text>
          <text class="stat-label">已过期</text>
        </view>
      </view>
    </view>
    
    <view class="card">
      <text class="card-title">今日数据</text>
      <view class="today-stats">
        <view class="today-item">
          <text class="today-label">今日入库</text>
          <text class="today-value">{{ statistics.todayInbound || 0 }}</text>
        </view>
        <view class="today-item">
          <text class="today-label">今日取件</text>
          <text class="today-value">{{ statistics.todayPicked || 0 }}</text>
        </view>
      </view>
    </view>
    
    <view class="card">
      <text class="card-title">取件率</text>
      <view class="rate-container">
        <view class="rate-bar">
          <view class="rate-fill" :style="{ width: pickRate + '%' }"></view>
        </view>
        <text class="rate-text">{{ pickRate }}%</text>
      </view>
    </view>
    
    <button class="btn-primary refresh-btn" @click="loadStatistics" :disabled="loading">
      {{ loading ? '刷新中...' : '刷新数据' }}
    </button>
  </view>
</template>

<script>
import { expressApi } from '../../utils/api.js';

export default {
  data() {
    return {
      statistics: {},
      loading: false
    };
  },
  computed: {
    pickRate() {
      const rate = parseFloat(this.statistics.pickupRate || 0);
      return rate.toFixed(1);
    }
  },
  onLoad() {
    this.loadStatistics();
  },
  onShow() {
    this.loadStatistics();
  },
  methods: {
    async loadStatistics() {
      this.loading = true;
      try {
        const res = await expressApi.getStatistics();
        this.statistics = res.data;
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.container {
  padding: 30rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 30rpx;
}

.stats-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.stat-box {
  width: calc(50% - 10rpx);
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 30rpx 20rpx;
  text-align: center;
}

.stat-value {
  font-size: 48rpx;
  font-weight: bold;
  color: #007aff;
  display: block;
}

.stat-value.picked {
  color: #4cd964;
}

.stat-value.pending {
  color: #ff9500;
}

.stat-value.expired {
  color: #ff3b30;
}

.stat-label {
  font-size: 24rpx;
  color: #666;
  margin-top: 8rpx;
}

.today-stats {
  display: flex;
  justify-content: space-around;
}

.today-item {
  text-align: center;
}

.today-label {
  font-size: 26rpx;
  color: #666;
  display: block;
}

.today-value {
  font-size: 48rpx;
  font-weight: bold;
  color: #007aff;
  margin-top: 12rpx;
  display: block;
}

.rate-container {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.rate-bar {
  flex: 1;
  height: 24rpx;
  background: #e0e0e0;
  border-radius: 12rpx;
  overflow: hidden;
}

.rate-fill {
  height: 100%;
  background: linear-gradient(90deg, #007aff, #4cd964);
  border-radius: 12rpx;
  transition: width 0.3s;
}

.rate-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #007aff;
}

.refresh-btn {
  margin-top: 30rpx;
}
</style>
