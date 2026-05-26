<template>
  <view class="container">
    <view class="header">
      <view class="header-title">亲子手工课</view>
      <view class="header-subtitle">发现孩子的创造力</view>
    </view>

    <view v-if="loading" class="loading">加载中...</view>

    <view v-else class="course-list">
      <view
        v-for="course in courses"
        :key="course.id"
        class="course-card"
        @click="goToDetail(course.id)"
      >
        <image
          v-if="course.imageUrl"
          :src="course.imageUrl"
          class="course-image"
          mode="aspectFill"
        />
        <view v-else class="course-image placeholder">
          <text class="placeholder-text">🎨</text>
        </view>
        <view class="course-info">
          <view class="course-name">{{ course.name }}</view>
          <view class="course-desc">{{ course.description }}</view>
          <view class="course-footer">
            <text class="price">¥{{ course.price }}</text>
            <text class="capacity">名额: {{ course.capacity }}人</text>
          </view>
        </view>
      </view>

      <view v-if="courses.length === 0" class="empty">
        暂无课程
      </view>
    </view>
  </view>
</template>

<script>
import { api } from '../../common/api.js'

export default {
  data() {
    return {
      courses: [],
      loading: true
    }
  },
  onLoad() {
    this.loadCourses()
  },
  onPullDownRefresh() {
    this.loadCourses()
  },
  methods: {
    async loadCourses() {
      try {
        this.loading = true
        const data = await api.getCourses()
        this.courses = data
      } catch (error) {
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
        uni.stopPullDownRefresh()
      }
    },
    goToDetail(id) {
      uni.navigateTo({
        url: `/pages/course-detail/course-detail?id=${id}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0;
  min-height: 100vh;
  background-color: #f8f8f8;
}

.header {
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa07a 100%);
  padding: 60rpx 30rpx 40rpx;
  color: white;
}

.header-title {
  font-size: 44rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.header-subtitle {
  font-size: 28rpx;
  opacity: 0.9;
}

.loading {
  text-align: center;
  padding: 100rpx;
  color: #999;
}

.course-list {
  padding: 20rpx;
}

.course-card {
  background: white;
  border-radius: 20rpx;
  overflow: hidden;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.course-image {
  width: 100%;
  height: 320rpx;
  background-color: #f5f5f5;
}

.course-image.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.placeholder-text {
  font-size: 80rpx;
}

.course-info {
  padding: 24rpx;
}

.course-name {
  font-size: 34rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
}

.course-desc {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 16rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.course-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 36rpx;
  color: #ff6b6b;
  font-weight: bold;
}

.capacity {
  font-size: 24rpx;
  color: #999;
}

.empty {
  text-align: center;
  padding: 100rpx;
  color: #999;
  font-size: 28rpx;
}
</style>
