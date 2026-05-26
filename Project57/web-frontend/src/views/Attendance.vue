<template>
  <div>
    <div class="page-header">
      <h2 class="page-title">考勤登记</h2>
      <el-button @click="goBack">返回</el-button>
    </div>

    <div v-if="schedule" class="schedule-info-bar">
      <div class="info-row">
        <span class="label">课程：</span>
        <span class="value">{{ getCourseName(schedule.courseId) }}</span>
      </div>
      <div class="info-row">
        <span class="label">日期：</span>
        <span class="value">{{ schedule.scheduleDate }}</span>
      </div>
      <div class="info-row">
        <span class="label">时间：</span>
        <span class="value">{{ schedule.startTime }} - {{ schedule.endTime }}</span>
      </div>
    </div>

    <div v-if="loading" class="loading-center">
      <el-icon class="is-loading" size="32"><Loading /></el-icon>
      <p>加载中...</p>
    </div>

    <div v-else>
      <div class="attendance-stats">
        <span class="attendance-stat present">出勤: {{ presentCount }} 人</span>
        <span class="attendance-stat absent">缺席: {{ absentCount }} 人</span>
      </div>

      <div v-if="students.length > 0">
        <div class="student-list">
          <div v-for="student in students" :key="student.id" class="student-card">
            <div class="student-info">
              <div class="student-avatar">{{ student.childName.charAt(0) }}</div>
              <div>
                <div class="student-name">{{ student.childName }}</div>
                <div class="student-parent">{{ student.parentName }}</div>
              </div>
            </div>
            <div class="status-buttons">
              <button
                :class="['status-btn', student.status === 'present' ? 'active-present' : '']"
                @click="updateStatus(student, 'present')"
              >
                出勤
              </button>
              <button
                :class="['status-btn absent-btn', student.status === 'absent' ? 'active-absent' : '']"
                @click="updateStatus(student, 'absent')"
              >
                缺席
              </button>
            </div>
          </div>
        </div>

        <div class="bottom-action-bar">
          <el-button type="primary" size="large" @click="saveAttendance">
            保存考勤
          </el-button>
        </div>
      </div>

      <div v-else class="empty-state">
        暂无学员记录
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import { api } from '../api'

const route = useRoute()
const router = useRouter()
const scheduleId = route.params.scheduleId

const loading = ref(true)
const schedule = ref(null)
const courses = ref([])
const registrations = ref([])
const students = ref([])

const presentCount = computed(() => {
  return students.value.filter(s => s.status === 'present').length
})

const absentCount = computed(() => {
  return students.value.filter(s => s.status === 'absent').length
})

const loadData = async () => {
  try {
    loading.value = true
    const [scheduleData, courseData, regData] = await Promise.all([
      api.getSchedule(scheduleId),
      api.getCourses(),
      api.getRegistrations()
    ])
    schedule.value = scheduleData
    courses.value = courseData

    const courseRegs = regData.filter(r => r.courseId === scheduleData.courseId)
    const attendanceData = await api.getAttendances(scheduleId)

    students.value = courseRegs.map(reg => {
      const attendance = attendanceData.find(a => a.registrationId === reg.id)
      return {
        id: reg.id,
        registrationId: reg.id,
        childName: reg.childName,
        parentName: reg.parentName,
        status: attendance ? attendance.status : 'absent',
        attendanceId: attendance ? attendance.id : null
      }
    })
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const getCourseName = (courseId) => {
  const course = courses.value.find(c => c.id === courseId)
  return course ? course.name : '未知课程'
}

const updateStatus = (student, status) => {
  student.status = status
}

const saveAttendance = async () => {
  try {
    const attendanceRecords = students.value.map(student => ({
      registrationId: student.registrationId,
      childName: student.childName,
      status: student.status
    }))

    await api.createAttendancesBatch({
      scheduleId: scheduleId,
      attendances: attendanceRecords
    })

    ElMessage.success('保存成功')
    setTimeout(() => {
      router.back()
    }, 1500)
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  loadData()
})
</script>
