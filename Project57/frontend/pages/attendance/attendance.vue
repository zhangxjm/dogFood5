<template>
  <view class="container">
    <view class="header">
      <view class="header-title">考勤打卡</view>
      <view class="header-subtitle">记录学员出勤情况</view>
    </view>

    <view v-if="scheduleId" class="schedule-info">
      <view class="info-row">
        <text class="label">日期：</text>
        <text class="value">{{ scheduleInfo.scheduleDate }}</text>
      </view>
      <view class="info-row">
        <text class="label">时间：</text>
        <text class="value">{{ scheduleInfo.startTime }} - {{ scheduleInfo.endTime }}</text>
      </view>
      <view class="info-row">
        <text class="label">课程：</text>
        <text class="value">{{ getCourseName(scheduleInfo.courseId) }}</text>
      </view>
    </view>

    <view v-else class="date-selector">
      <picker mode="date" :value="selectedDate" @change="onDateChange">
        <view class="date-picker">
          <text>选择日期：{{ selectedDate || '点击选择' }}</text>
        </view>
      </picker>
    </view>

    <view v-if="loading" class="loading">加载中...</view>

    <view v-else class="attendance-list">
      <view class="section-header">
        <text class="section-title">学员名单</text>
        <view class="stats">
          <text class="present">出勤: {{ presentCount }}</text>
          <text class="absent">缺席: {{ absentCount }}</text>
        </view>
      </view>

      <view
        v-for="student in students"
        :key="student.id"
        class="student-card"
      >
        <view class="student-info">
          <view class="avatar">{{ student.childName.charAt(0) }}</view>
          <view class="info">
            <text class="name">{{ student.childName }}</text>
            <text class="parent">{{ student.parentName }}</text>
          </view>
        </view>

        <view class="status-btns">
          <view
            :class="['status-btn', student.status === 'present' ? 'active' : '']"
            @click="updateStatus(student, 'present')"
          >
            出勤
          </view>
          <view
            :class="['status-btn absent-btn', student.status === 'absent' ? 'active' : '']"
            @click="updateStatus(student, 'absent')"
          >
            缺席
          </view>
        </view>
      </view>

      <view v-if="students.length === 0" class="empty">
        暂无学员记录
      </view>
    </view>

    <view v-if="students.length > 0" class="bottom-bar">
      <button class="btn-primary" @click="saveAttendance">保存考勤</button>
    </view>
  </view>
</template>

<script>
import { api } from '../../common/api.js'

export default {
  data() {
    return {
      scheduleId: null,
      scheduleInfo: {},
      courses: [],
      registrations: [],
      attendances: [],
      students: [],
      loading: true,
      selectedDate: ''
    }
  },
  computed: {
    presentCount() {
      return this.students.filter(s => s.status === 'present').length
    },
    absentCount() {
      return this.students.filter(s => s.status === 'absent').length
    }
  },
  onLoad(options) {
    if (options.scheduleId) {
      this.scheduleId = parseInt(options.scheduleId)
    }
    const today = new Date()
    this.selectedDate = today.toISOString().split('T')[0]
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        this.loading = true
        const [courses, registrations] = await Promise.all([
          api.getCourses(),
          api.getRegistrations()
        ])
        this.courses = courses
        this.registrations = registrations

        if (this.scheduleId) {
          const schedule = await api.getSchedule(this.scheduleId)
          this.scheduleInfo = schedule

          const courseRegs = registrations.filter(r => r.courseId === schedule.courseId)
          const attendances = await api.getAttendances(this.scheduleId)

          this.students = courseRegs.map(reg => {
            const attendance = attendances.find(a => a.registrationId === reg.id)
            return {
              id: reg.id,
              registrationId: reg.id,
              childName: reg.childName,
              parentName: reg.parentName,
              status: attendance ? attendance.status : 'absent',
              attendanceId: attendance ? attendance.id : null
            }
          })
        } else {
          this.students = []
        }
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
    onDateChange(e) {
      this.selectedDate = e.detail.value
    },
    updateStatus(student, status) {
      student.status = status
    },
    async saveAttendance() {
      try {
        const attendanceRecords = this.students.map(student => ({
          registrationId: student.registrationId,
          childName: student.childName,
          status: student.status
        }))

        await api.createAttendancesBatch({
          scheduleId: this.scheduleId,
          attendances: attendanceRecords
        })

        uni.showToast({
          title: '保存成功',
          icon: 'success'
        })

        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      } catch (error) {
        uni.showToast({
          title: '保存失败',
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
  min-height: 100vh;
  background-color: #f8f8f8;
  padding-bottom: 140rpx;
}

.header {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
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

.schedule-info {
  background: white;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 24rpx;
}

.info-row {
  display: flex;
  margin-bottom: 12rpx;
}

.label {
  font-size: 28rpx;
  color: #999;
  width: 100rpx;
}

.value {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}

.date-selector {
  background: white;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 24rpx;
}

.date-picker {
  font-size: 28rpx;
  color: #333;
}

.loading {
  text-align: center;
  padding: 100rpx;
  color: #999;
}

.attendance-list {
  padding: 0 20rpx;
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

.stats {
  display: flex;
  gap: 20rpx;
}

.present {
  font-size: 26rpx;
  color: #4caf50;
}

.absent {
  font-size: 26rpx;
  color: #f44336;
}

.student-card {
  background: white;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.student-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: bold;
  margin-right: 20rpx;
}

.info {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 6rpx;
}

.parent {
  font-size: 24rpx;
  color: #999;
}

.status-btns {
  display: flex;
  gap: 16rpx;
}

.status-btn {
  padding: 12rpx 24rpx;
  border-radius: 30rpx;
  font-size: 26rpx;
  background: #f0f0f0;
  color: #666;
}

.status-btn.active {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
}

.status-btn.absent-btn.active {
  background: linear-gradient(135deg, #f44336 0%, #e53935 100%);
  color: white;
}

.empty {
  text-align: center;
  padding: 100rpx;
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
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border-radius: 40rpx;
  padding: 24rpx;
  font-size: 32rpx;
  border: none;
}
</style>
