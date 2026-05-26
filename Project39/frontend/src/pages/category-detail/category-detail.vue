<template>
  <view class="container" v-if="category">
    <image class="detail-image" :src="category.imageUrl" mode="aspectFill"></image>
    <view class="detail-content">
      <view class="detail-header">
        <text class="detail-name">{{ category.name }}</text>
        <text class="detail-price">¥{{ category.price }}/{{ category.unit }}</text>
      </view>

      <view class="info-section">
        <view class="info-item">
          <text class="info-label">Season</text>
          <text class="info-value">{{ category.harvestSeason }}</text>
        </view>
        <view class="info-item" v-if="category.startDate">
          <text class="info-label">Available From</text>
          <text class="info-value">{{ category.startDate }}</text>
        </view>
        <view class="info-item" v-if="category.endDate">
          <text class="info-label">Available To</text>
          <text class="info-value">{{ category.endDate }}</text>
        </view>
      </view>

      <view class="desc-section">
        <text class="desc-title">Description</text>
        <text class="desc-content">{{ category.description }}</text>
      </view>

      <view class="tips-section">
        <text class="tips-title">Picking Tips</text>
        <view class="tip-item">1. Please arrive within the booked time slot</view>
        <view class="tip-item">2. Picking tools and baskets will be provided</view>
        <view class="tip-item">3. Please follow staff instructions for safety</view>
        <view class="tip-item">4. Fruits are priced per pound/unit</view>
      </view>
    </view>

    <view class="footer">
      <button class="primary-btn" @click="goReserve">Book Now</button>
    </view>
  </view>

  <view class="loading" v-else>
    <text>Loading...</text>
  </view>
</template>

<script>
import { getCategoryById } from '../../api/index.js'

export default {
  data() {
    return {
      category: null
    }
  },
  onLoad(options) {
    if (options.id) {
      this.loadCategory(options.id)
    }
  },
  methods: {
    async loadCategory(id) {
      try {
        this.category = await getCategoryById(id)
      } catch (e) {
        uni.showToast({ title: 'Failed to load', icon: 'none' })
      }
    },
    goReserve() {
      uni.switchTab({ url: '/pages/reserve/reserve' })
    }
  }
}
</script>

<style scoped>
.detail-image {
  width: 100%;
  height: 400rpx;
  margin: -20rpx -20rpx 0 -20rpx;
}

.detail-content {
  padding: 30rpx;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.detail-name {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
}

.detail-price {
  font-size: 36rpx;
  color: #4CAF50;
  font-weight: bold;
}

.info-section {
  background: #f9f9f9;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #eee;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 28rpx;
  color: #666;
}

.info-value {
  font-size: 28rpx;
  color: #333;
}

.desc-section {
  margin-bottom: 30rpx;
}

.desc-title {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.desc-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.tips-section {
  background: #FFF8E1;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 120rpx;
}

.tips-title {
  display: block;
  font-size: 30rpx;
  font-weight: bold;
  color: #FF9800;
  margin-bottom: 20rpx;
}

.tip-item {
  font-size: 26rpx;
  color: #795548;
  line-height: 2;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx;
  background: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.1);
}

.loading {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
}
</style>
