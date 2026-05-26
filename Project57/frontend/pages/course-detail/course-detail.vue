<template>
  <view class="container">
    <view v-if="loading" class="loading">加载中...</view>
    <view v-else-if="course" class="detail">
      <image
        v-if="course.imageUrl"
        :src="course.imageUrl"
        class="course-image"
        mode="aspectFill"
      />
      <view v-else class="course-image placeholder">
        <text class="placeholder-text">🎨</text>
      </view>

      <view class="info-card">
        <view class="course-name">{{ course.name }}</view>
        <view class="course-price">¥{{ course.price }}</view>
        <view class="course-desc">{{ course.description }}</view>
        <view class="course-meta">
          <text class="meta-item">👥 限招 {{ course.capacity }} 人</text>
        </view>
      </view>

      <view class="section-title">课程安排</view>
      <view v-if="schedules.length > 0" class="schedule-list">
        <view
          v-for="schedule in schedules"
          :key="schedule.id"
          class="schedule-item"
        >
          <view class="schedule-date">{{ formatDate(schedule.scheduleDate) }}</view>
          <view class="schedule-time">{{ schedule.startTime }} - {{ schedule.endTime }}</view>
          <view class="schedule-location">📍 {{ schedule.location || '待定' }}</view>
          <view class="schedule-teacher">👩‍🏫 {{ schedule.teacher || '待定' }}</view>
        </view>
      </view>
      <view v-else class="empty">暂无课程安排</view>

      <view class="section-title">报名学员</view>
      <view v-if="registrations.length > 0" class="registration-list">
        <view
          v-for="reg in registrations"
          :key="reg.id"
          class="registration-item"
        >
          <view class="reg-info">
            <text class="child-name">{{ reg.childName }}</text>
            <text class="parent-name">({{ reg.parentName }})</text>
          </view>
          <view :class="['tag', reg.paymentStatus === 'paid' ? 'tag-active' : 'tag-pending']">
            {{ reg.paymentStatus === 'paid' ? '已缴费' : '待缴费' }}
          </view>
        </view>
      </view>
      <view v-else class="empty">暂无报名</view>

      <view class="bottom-bar">
        <button class="btn-primary" @click="showRegisterModal = true">立即报名</button>
      </view>
    </view>

    <view v-if="showRegisterModal" class="modal" @click.self="showRegisterModal = false">
      <view class="modal-content">
        <view class="modal-title">报名信息</view>
        <view class="form-item">
          <text class="label">家长姓名</text>
          <input v-model="form.parentName" class="input" placeholder="请输入家长姓名" />
        </view>
        <view class="form-item">
          <text class="label">联系电话</text>
          <input v-model="form.parentPhone" class="input" placeholder="请输入联系电话" type="number" />
        </view>
        <view class="form-item">
          <text class="label">孩子姓名</text>
          <input v-model="form.childName" class="input" placeholder="请输入孩子姓名" />
        </view>
        <view class="form-item">
          <text class="label">孩子年龄</text>
          <input v-model="form.childAge" class="input" placeholder="请输入孩子年龄" type="number" />
        </view>
        <view class="form-item">
          <text class="label">备注</text>
          <textarea v-model="form.remark" class="textarea" placeholder="选填" />
        </view>
        <view class="amount-info">
          <text>应付金额：</text>
          <text class="amount">¥{{ course.price }}</text>
        </view>
        <view class="modal-btns">
          <button class="btn-secondary" @click="showRegisterModal = false">取消</button>
          <button class="btn-primary" @click="submitRegistration">确认报名</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { api } from '../../common/api.js'

export default {
  data() {
    return {
      course: null,
      schedules: [],
      registrations: [],
      loading: true,
      showRegisterModal: false,
      form: {
        parentName: '',
        parentPhone: '',
        childName: '',
        childAge: '',
        remark: ''
      }
    }
  },
  onLoad(options) {
    this.courseId = options.id
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        this.loading = true
        const [course, schedules, registrations] = await Promise.all([
          api.getCourse(this.courseId),
          api.getSchedules({ courseId: this.courseId }),
          api.getRegistrations(this.courseId)
        ])
        this.course = course
        this.schedules = schedules
        this.registrations = registrations
      } catch (error) {
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    formatDate(dateStr) {
      const date = new Date(dateStr)
      const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      return `${date.getMonth() + 1}月${date.getDate()}日 ${weekDays[date.getDay()]}`
    },
    async submitRegistration() {
      if (!this.form.parentName || !this.form.parentPhone || !this.form.childName || !this.form.childAge) {
        uni.showToast({
          title: '请填写完整信息',
          icon: 'none'
        })
        return
      }

      try {
        await api.createRegistration({
          courseId: this.courseId,
          parentName: this.form.parentName,
          parentPhone: this.form.parentPhone,
          childName: this.form.childName,
          childAge: parseInt(this.form.childAge),
          amount: this.course.price,
          remark: this.form.remark
        })
        uni.showToast({
          title: '报名成功',
          icon: 'success'
        })
        this.showRegisterModal = false
        this.form = {
          parentName: '',
          parentPhone: '',
          childName: '',
          childAge: '',
          remark: ''
        }
        this.loadData()
      } catch (error) {
        uni.showToast({
          title: '报名失败',
          icon: 'none'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0;
  padding-bottom: 140rpx;
  min-height: 100vh;
  background-color: #f8f8f8;
}

.loading {
  text-align: center;
  padding: 100rpx;
  color: #999;
}

.course-image {
  width: 100%;
  height: 400rpx;
  background-color: #f5f5f5;
}

.course-image.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.placeholder-text {
  font-size: 100rpx;
}

.info-card {
  background: white;
  margin: -40rpx 20rpx 0;
  border-radius: 20rpx;
  padding: 30rpx;
  position: relative;
  z-index: 1;
}

.course-name {
  font-size: 38rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
}

.course-price {
  font-size: 40rpx;
  color: #ff6b6b;
  font-weight: bold;
  margin-bottom: 16rpx;
}

.course-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 16rpx;
}

.course-meta {
  display: flex;
  gap: 20rpx;
}

.meta-item {
  font-size: 24rpx;
  color: #999;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  padding: 30rpx 20rpx 20rpx;
  border-left: 6rpx solid #ff6b6b;
  margin-left: 20rpx;
}

.schedule-list,
.registration-list {
  padding: 0 20rpx;
}

.schedule-item {
  background: white;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.schedule-date {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.schedule-time,
.schedule-location,
.schedule-teacher {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 6rpx;
}

.registration-item {
  background: white;
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
  margin-bottom: 12rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reg-info {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.child-name {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.parent-name {
  font-size: 24rpx;
  color: #999;
}

.empty {
  text-align: center;
  padding: 60rpx;
  color: #999;
  font-size: 28rpx;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 20rpx;
  box-shadow: 0 -2rpx 20rpx rgba(0, 0, 0, 0.1);
}

.btn-primary {
  width: 100%;
  background: linear-gradient(135deg, #ff6b6b 0%, #ffa07a 100%);
  color: white;
  border-radius: 40rpx;
  padding: 24rpx;
  font-size: 32rpx;
  border: none;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-title {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30rpx;
  color: #333;
}

.form-item {
  margin-bottom: 24rpx;
}

.label {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.input,
.textarea {
  width: 100%;
  padding: 20rpx;
  border: 1rpx solid #ddd;
  border-radius: 12rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.textarea {
  height: 120rpx;
}

.amount-info {
  text-align: center;
  padding: 20rpx;
  font-size: 28rpx;
  color: #666;
}

.amount {
  color: #ff6b6b;
  font-size: 36rpx;
  font-weight: bold;
}

.modal-btns {
  display: flex;
  gap: 20rpx;
  margin-top: 30rpx;
}

.btn-secondary {
  flex: 1;
  background: #f0f0f0;
  color: #333;
  border-radius: 40rpx;
  padding: 20rpx;
  font-size: 28rpx;
  border: none;
}

.tag {
  display: inline-block;
  padding: 6rpx 20rpx;
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
