<template>
  <view class="container">
    <view class="header">
      <view class="header-title">课程表</view>
      <view class="header-subtitle">查看所有课程安排</view>
    </view>

    <view class="date-filter">
      <scroll-view scroll-x class="date-scroll">
        <view
          v-for="date in dateList"
          :key="date.dateStr"
          :class="['date-item', selectedDate === date.dateStr ? 'active' : '']"
          @click="selectedDate = date.dateStr"
        >
          <text class="day">{{ date.day }}</text>
          <text class="date">{{ date.date }}</text>
        </view>
      </scroll-view>
    </view>

    <view v-if="loading" class="loading">加载中...</view>

    <view v-else class="schedule-list">
      <view
        v-for="schedule in filteredSchedules"
        :key="schedule.id"
        class="schedule-card"
      >
        <view class="schedule-header">
          <view class="time-badge">
            <text class="start-time">{{ schedule.startTime }}</text>
            <text class="time-line">-</text>
            <text class="end-time">{{ schedule.endTime }}</text>
          </view>
          <view class="course-badge">{{ getCourseName(schedule.courseId) }}</view>
        </view>

        <view class="schedule-body">
          <view class="info-item">
            <text class="icon">📍</text>
            <text class="text">{{ schedule.location || '待定' }}</text>
          </view>
          <view class="info-item">
            <text class="icon">👩‍🏫</text>
            <text class="text">{{ schedule.teacher || '待定' }}</text>
          </view>
          <view class="info-item">
            <text class="icon">👥</text>
            <text class="text">限{{ schedule.maxStudents }}人</text>
          </view>
        </view>

        <view class="schedule-footer">
          <button class="btn-small" @click="viewAttendance(schedule.id)">查看考勤</button>
        </view>
      </view>

      <view v-if="filteredSchedules.length === 0" class="empty">
        该日期暂无课程安排
      </view>
    </view>

    <view class="fab" @click="showAddModal = true">
      <text class="fab-text">+</text>
    </view>

    <view v-if="showAddModal" class="modal" @click.self="showAddModal = false">
      <view class="modal-content">
        <view class="modal-title">添加课程安排</view>

        <view class="form-item">
          <text class="label">选择课程</text>
          <picker :range="courseNames" :value="selectedCourseIndex" @change="onCourseChange">
            <view class="picker">{{ courseNames[selectedCourseIndex] || '请选择课程' }}</view>
          </picker>
        </view>

        <view class="form-item">
          <text class="label">日期</text>
          <picker mode="date" :value="form.scheduleDate" @change="onDateChange">
            <view class="picker">{{ form.scheduleDate || '请选择日期' }}</view>
          </picker>
        </view>

        <view class="form-item">
          <text class="label">开始时间</text>
          <picker mode="time" :value="form.startTime" @change="onStartTimeChange">
            <view class="picker">{{ form.startTime || '请选择开始时间' }}</view>
          </picker>
        </view>

        <view class="form-item">
          <text class="label">结束时间</text>
          <picker mode="time" :value="form.endTime" @change="onEndTimeChange">
            <view class="picker">{{ form.endTime || '请选择结束时间' }}</view>
          </picker>
        </view>

        <view class="form-item">
          <text class="label">地点</text>
          <input v-model="form.location" class="input" placeholder="请输入上课地点" />
        </view>

        <view class="form-item">
          <text class="label">老师</text>
          <input v-model="form.teacher" class="input" placeholder="请输入老师姓名" />
        </view>

        <view class="modal-btns">
          <button class="btn-secondary" @click="showAddModal = false">取消</button>
          <button class="btn-primary" @click="submitSchedule">确认添加</button>
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
      schedules: [],
      courses: [],
      loading: true,
      selectedDate: '',
      dateList: [],
      showAddModal: false,
      selectedCourseIndex: 0,
      form: {
        scheduleDate: '',
        startTime: '',
        endTime: '',
        location: '',
        teacher: ''
      }
    }
  },
  computed: {
    courseNames() {
      return this.courses.map(c => c.name)
    },
    filteredSchedules() {
      if (!this.selectedDate) return this.schedules
      return this.schedules.filter(s => s.scheduleDate === this.selectedDate)
    }
  },
  onLoad() {
    this.initDateList()
    this.loadData()
  },
  methods: {
    initDateList() {
      const dates = []
      const today = new Date()
      const weekDays = ['日', '一', '二', '三', '四', '五', '六']
      for (let i = 0; i < 14; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        dates.push({
          dateStr: date.toISOString().split('T')[0],
          day: weekDays[date.getDay()],
          date: date.getDate()
        })
      }
      this.dateList = dates
      this.selectedDate = dates[0].dateStr
    },
    async loadData() {
      try {
        this.loading = true
        const [schedules, courses] = await Promise.all([
          api.getSchedules(),
          api.getCourses()
        ])
        this.schedules = schedules
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
    viewAttendance(scheduleId) {
      uni.navigateTo({
        url: `/pages/attendance/attendance?scheduleId=${scheduleId}`
      })
    },
    onCourseChange(e) {
      this.selectedCourseIndex = e.detail.value
    },
    onDateChange(e) {
      this.form.scheduleDate = e.detail.value
    },
    onStartTimeChange(e) {
      this.form.startTime = e.detail.value
    },
    onEndTimeChange(e) {
      this.form.endTime = e.detail.value
    },
    async submitSchedule() {
      if (!this.courses[this.selectedCourseIndex]) {
        uni.showToast({
          title: '请选择课程',
          icon: 'none'
        })
        return
      }
      if (!this.form.scheduleDate || !this.form.startTime || !this.form.endTime) {
        uni.showToast({
          title: '请填写完整信息',
          icon: 'none'
        })
        return
      }

      try {
        const course = this.courses[this.selectedCourseIndex]
        await api.createSchedule({
          courseId: course.id,
          scheduleDate: this.form.scheduleDate,
          startTime: this.form.startTime,
          endTime: this.form.endTime,
          location: this.form.location,
          teacher: this.form.teacher,
          maxStudents: course.capacity
        })
        uni.showToast({
          title: '添加成功',
          icon: 'success'
        })
        this.showAddModal = false
        this.resetForm()
        this.loadData()
      } catch (error) {
        uni.showToast({
          title: '添加失败',
          icon: 'none'
        })
      }
    },
    resetForm() {
      this.form = {
        scheduleDate: '',
        startTime: '',
        endTime: '',
        location: '',
        teacher: ''
      }
      this.selectedCourseIndex = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0;
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 120rpx;
}

.header {
  background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
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

.date-filter {
  background: white;
  padding: 20rpx 0;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.date-scroll {
  white-space: nowrap;
}

.date-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 28rpx;
  margin: 0 10rpx;
  border-radius: 16rpx;
  background: #f5f5f5;
}

.date-item.active {
  background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
  color: white;
}

.day {
  font-size: 24rpx;
  margin-bottom: 6rpx;
}

.date {
  font-size: 32rpx;
  font-weight: bold;
}

.loading {
  text-align: center;
  padding: 100rpx;
  color: #999;
}

.schedule-list {
  padding: 20rpx;
}

.schedule-card {
  background: white;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.time-badge {
  display: flex;
  align-items: center;
  gap: 10rpx;
  background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
  color: white;
  padding: 10rpx 20rpx;
  border-radius: 30rpx;
}

.start-time,
.end-time {
  font-size: 26rpx;
  font-weight: bold;
}

.time-line {
  font-size: 26rpx;
}

.course-badge {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.schedule-body {
  margin-bottom: 16rpx;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.icon {
  font-size: 28rpx;
  margin-right: 10rpx;
}

.text {
  font-size: 26rpx;
  color: #666;
}

.schedule-footer {
  display: flex;
  justify-content: flex-end;
}

.btn-small {
  background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
  color: white;
  border-radius: 30rpx;
  padding: 12rpx 30rpx;
  font-size: 24rpx;
  border: none;
}

.empty {
  text-align: center;
  padding: 100rpx;
  color: #999;
  font-size: 28rpx;
}

.fab {
  position: fixed;
  bottom: 40rpx;
  right: 40rpx;
  width: 100rpx;
  height: 100rpx;
  background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(168, 85, 247, 0.4);
}

.fab-text {
  font-size: 60rpx;
  color: white;
  line-height: 1;
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
.picker {
  width: 100%;
  padding: 20rpx;
  border: 1rpx solid #ddd;
  border-radius: 12rpx;
  font-size: 28rpx;
  box-sizing: border-box;
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

.btn-primary {
  flex: 1;
  background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
  color: white;
  border-radius: 40rpx;
  padding: 20rpx;
  font-size: 28rpx;
  border: none;
}
</style>
