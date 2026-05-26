<template>
  <view class="container">
    <view class="header">
      <image class="banner" src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800" mode="aspectFill"></image>
      <view class="header-content">
        <text class="title">Fresh Orchard</text>
        <text class="subtitle">Experience the joy of picking fresh fruits and vegetables</text>
      </view>
    </view>

    <view class="quick-actions">
      <view class="action-card" @click="goReserve">
        <view class="action-icon">📅</view>
        <text class="action-text">Book Now</text>
      </view>
      <view class="action-card" @click="goVerify">
        <view class="action-icon">✅</view>
        <text class="action-text">Verify Entry</text>
      </view>
      <view class="action-card" @click="goMyReservation">
        <view class="action-icon">📋</view>
        <text class="action-text">My Orders</text>
      </view>
      <view class="action-card" @click="goCategory">
        <view class="action-icon">🍓</view>
        <text class="action-text">Categories</text>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">Available Categories</text>
        <text class="section-more" @click="goCategory">View All ></text>
      </view>
      <view class="category-list">
        <view class="category-item" v-for="item in categories" :key="item.id" @click="goCategoryDetail(item.id)">
          <image class="category-image" :src="item.imageUrl" mode="aspectFill"></image>
          <view class="category-info">
            <text class="category-name">{{ item.name }}</text>
            <text class="category-price">¥{{ item.price }}/{{ item.unit }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">Today's Time Slots</text>
      </view>
      <view class="time-slots">
        <view class="time-slot" v-for="slot in todaySlots" :key="slot.id">
          <view class="slot-time">{{ slot.startTime }} - {{ slot.endTime }}</view>
          <view class="slot-info">
            <text class="slot-capacity">{{ slot.bookedCount }}/{{ slot.maxCapacity }} booked</text>
            <text :class="slot.bookedCount >= slot.maxCapacity ? 'slot-full' : 'slot-available'">
              {{ slot.bookedCount >= slot.maxCapacity ? 'Full' : 'Available' }}
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getAllCategories, getTimeSlotsByDate } from '../../api/index.js'

export default {
  data() {
    return {
      categories: [],
      todaySlots: []
    }
  },
  onLoad() {
    this.loadCategories()
    this.loadTodaySlots()
  },
  methods: {
    async loadCategories() {
      try {
        const res = await getAllCategories()
        this.categories = res.slice(0, 4)
      } catch (e) {
        console.error(e)
      }
    },
    async loadTodaySlots() {
      try {
        const today = this.formatDate(new Date())
        const res = await getTimeSlotsByDate(today)
        this.todaySlots = res
      } catch (e) {
        console.error(e)
      }
    },
    formatDate(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    goReserve() {
      uni.switchTab({ url: '/pages/reserve/reserve' })
    },
    goVerify() {
      uni.switchTab({ url: '/pages/verify/verify' })
    },
    goMyReservation() {
      uni.navigateTo({ url: '/pages/my-reservation/my-reservation' })
    },
    goCategory() {
      uni.switchTab({ url: '/pages/category/category' })
    },
    goCategoryDetail(id) {
      uni.navigateTo({ url: `/pages/category-detail/category-detail?id=${id}` })
    }
  }
}
</script>

<style scoped>
.header {
  position: relative;
  margin: -20rpx -20rpx 20rpx -20rpx;
}

.banner {
  width: 100%;
  height: 400rpx;
}

.header-content {
  position: absolute;
  bottom: 40rpx;
  left: 40rpx;
  color: #fff;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  display: block;
  text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.5);
}

.subtitle {
  font-size: 28rpx;
  margin-top: 10rpx;
  display: block;
  text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.5);
}

.quick-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30rpx;
}

.action-card {
  flex: 1;
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx 10rpx;
  margin: 0 10rpx;
  text-align: center;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}

.action-icon {
  font-size: 48rpx;
  margin-bottom: 10rpx;
}

.action-text {
  font-size: 24rpx;
  color: #333;
}

.section {
  margin-bottom: 30rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.section-more {
  font-size: 26rpx;
  color: #4CAF50;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.category-item {
  width: calc(50% - 10rpx);
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}

.category-image {
  width: 100%;
  height: 200rpx;
}

.category-info {
  padding: 20rpx;
}

.category-name {
  font-size: 28rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
}

.category-price {
  font-size: 24rpx;
  color: #4CAF50;
}

.time-slots {
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
}

.time-slot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1rpx solid #eee;
}

.time-slot:last-child {
  border-bottom: none;
}

.slot-time {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.slot-info {
  text-align: right;
}

.slot-capacity {
  font-size: 24rpx;
  color: #666;
  display: block;
}

.slot-available {
  font-size: 24rpx;
  color: #4CAF50;
}

.slot-full {
  font-size: 24rpx;
  color: #f44336;
}
</style>
