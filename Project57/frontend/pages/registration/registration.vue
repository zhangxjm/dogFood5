<template>
  <view class="container">
    <view class="header">
      <view class="header-title">我的报名</view>
      <view class="header-subtitle">查看报名记录和缴费状态</view>
    </view>

    <view class="stats-bar">
      <view class="stat-item">
        <text class="stat-number">{{ registrations.length }}</text>
        <text class="stat-label">总报名</text>
      </view>
      <view class="stat-item">
        <text class="stat-number">{{ paidCount }}</text>
        <text class="stat-label">已缴费</text>
      </view>
      <view class="stat-item">
        <text class="stat-number">¥{{ totalAmount }}</text>
        <text class="stat-label">总金额</text>
      </view>
    </view>

    <view v-if="loading" class="loading">加载中...</view>

    <view v-else class="reg-list">
      <view
        v-for="reg in registrations"
        :key="reg.id"
        class="reg-card"
      >
        <view class="reg-header">
          <view class="course-info">
            <text class="course-name">{{ getCourseName(reg.courseId) }}</text>
          </view>
          <view :class="['tag', reg.paymentStatus === 'paid' ? 'tag-active' : 'tag-pending']">
            {{ reg.paymentStatus === 'paid' ? '已缴费' : '待缴费' }}
          </view>
        </view>

        <view class="reg-body">
          <view class="info-row">
            <text class="label">家长：</text>
            <text class="value">{{ reg.parentName }}</text>
          </view>
          <view class="info-row">
            <text class="label">孩子：</text>
            <text class="value">{{ reg.childName }}（{{ reg.childAge }}岁）</text>
          </view>
          <view class="info-row">
            <text class="label">电话：</text>
            <text class="value">{{ reg.parentPhone }}</text>
          </view>
          <view v-if="reg.remark" class="info-row">
            <text class="label">备注：</text>
            <text class="value">{{ reg.remark }}</text>
          </view>
        </view>

        <view class="reg-footer">
          <text class="amount">¥{{ reg.amount }}</text>
          <text class="time">{{ formatTime(reg.createdAt) }}</text>
        </view>

        <view class="reg-actions">
          <button
            v-if="reg.paymentStatus !== 'paid'"
            class="btn-small btn-primary"
            @click="confirmPayment(reg.id)"
          >
            确认缴费
          </button>
          <button class="btn-small btn-secondary" @click="deleteReg(reg.id)">
            删除
          </button>
        </view>
      </view>

      <view v-if="registrations.length === 0" class="empty">
        暂无报名记录
      </view>
    </view>
  </view>
</template>

<script>
import { api } from '../../common/api.js'

export default {
  data() {
    return {
      registrations: [],
      courses: [],
      loading: true
    }
  },
  computed: {
    paidCount() {
      return this.registrations.filter(r => r.paymentStatus === 'paid').length
    },
    totalAmount() {
      return this.registrations
        .filter(r => r.paymentStatus === 'paid')
        .reduce((sum, r) => sum + parseFloat(r.amount), 0)
        .toFixed(2)
    }
  },
  onLoad() {
    this.loadData()
  },
  onShow() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        this.loading = true
        const [registrations, courses] = await Promise.all([
          api.getRegistrations(),
          api.getCourses()
        ])
        this.registrations = registrations
        this.courses = courses
      } catch (error) {
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    getCourseName(courseId) {
      const course = this.courses.find(c => c.id === courseId)
      return course ? course.name : '未知课程'
    },
    formatTime(dateStr) {
      const date = new Date(dateStr)
      return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
    },
    async confirmPayment(id) {
      uni.showModal({
        title: '确认缴费',
        content: '确认已收到缴费？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await api.updateRegistration(id, { paymentStatus: 'paid' })
              uni.showToast({
                title: '缴费成功',
                icon: 'success'
              })
              this.loadData()
            } catch (error) {
              uni.showToast({
                title: '操作失败',
                icon: 'none'
              })
            }
          }
        }
      })
    },
    async deleteReg(id) {
      uni.showModal({
        title: '删除确认',
        content: '确定要删除这条报名记录吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await api.deleteRegistration(id)
              uni.showToast({
                title: '删除成功',
                icon: 'success'
              })
              this.loadData()
            } catch (error) {
              uni.showToast({
                title: '删除失败',
                icon: 'none'
              })
            }
          }
        }
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
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
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

.stats-bar {
  display: flex;
  background: white;
  margin: -30rpx 20rpx 20rpx;
  border-radius: 20rpx;
  padding: 30rpx 0;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.stat-item {
  flex: 1;
  text-align: center;
  border-right: 1rpx solid #eee;
}

.stat-item:last-child {
  border-right: none;
}

.stat-number {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  color: #ff6b6b;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
}

.loading {
  text-align: center;
  padding: 100rpx;
  color: #999;
}

.reg-list {
  padding: 0 20rpx 40rpx;
}

.reg-card {
  background: white;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.reg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.course-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.reg-body {
  margin-bottom: 16rpx;
}

.info-row {
  display: flex;
  margin-bottom: 8rpx;
}

.label {
  font-size: 26rpx;
  color: #999;
  width: 100rpx;
}

.value {
  font-size: 26rpx;
  color: #333;
  flex: 1;
}

.reg-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16rpx;
  border-top: 1rpx solid #f0f0f0;
}

.amount {
  font-size: 32rpx;
  color: #ff6b6b;
  font-weight: bold;
}

.time {
  font-size: 24rpx;
  color: #999;
}

.reg-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 20rpx;
}

.btn-small {
  flex: 1;
  border-radius: 30rpx;
  padding: 16rpx;
  font-size: 26rpx;
  border: none;
}

.btn-small.btn-primary {
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa07a 100%);
  color: white;
}

.btn-small.btn-secondary {
  background: #f0f0f0;
  color: #666;
}

.empty {
  text-align: center;
  padding: 100rpx;
  color: #999;
  font-size: 28rpx;
}

.tag {
  display: inline-block;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
}

.tag-active {
  background: #e8f5e9;
  color: #4caf50;
}

.tag-pending {
  background: #fff3e0;
  color: #ff9800;
}
</style>
