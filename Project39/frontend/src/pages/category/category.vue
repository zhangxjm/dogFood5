<template>
  <view class="container">
    <view class="category-list">
      <view 
        class="category-card" 
        v-for="item in categories" 
        :key="item.id"
        @click="goDetail(item.id)">
        <image class="category-image" :src="item.imageUrl" mode="aspectFill"></image>
        <view class="category-info">
          <text class="category-name">{{ item.name }}</text>
          <text class="category-season">{{ item.harvestSeason }}</text>
          <view class="category-bottom">
            <text class="category-price">¥{{ item.price }}/{{ item.unit }}</text>
            <view class="available-tag">In Season</view>
          </view>
        </view>
      </view>
    </view>

    <view class="empty" v-if="categories.length === 0">
      <text>No categories available</text>
    </view>
  </view>
</template>

<script>
import { getAllCategories } from '../../api/index.js'

export default {
  data() {
    return {
      categories: []
    }
  },
  onLoad() {
    this.loadCategories()
  },
  onShow() {
    this.loadCategories()
  },
  methods: {
    async loadCategories() {
      try {
        const res = await getAllCategories()
        this.categories = res
      } catch (e) {
        console.error(e)
      }
    },
    goDetail(id) {
      uni.navigateTo({ url: `/pages/category-detail/category-detail?id=${id}` })
    }
  }
}
</script>

<style scoped>
.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.category-card {
  width: calc(50% - 10rpx);
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}

.category-image {
  width: 100%;
  height: 240rpx;
}

.category-info {
  padding: 20rpx;
}

.category-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
}

.category-season {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-top: 10rpx;
}

.category-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20rpx;
}

.category-price {
  font-size: 32rpx;
  color: #4CAF50;
  font-weight: bold;
}

.available-tag {
  font-size: 20rpx;
  color: #4CAF50;
  background: #E8F5E9;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
}

.empty {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>
