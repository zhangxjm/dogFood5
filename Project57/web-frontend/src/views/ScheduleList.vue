<template>
  <div>
    <div class="page-header">
      <h2 class="page-title">课程表</h2>
    </div>

    <div class="date-filter">
      <div
        v-for="date in dateList"
        :key="date.dateStr"
        :class="['date-item', selectedDate === date.dateStr ? 'active' : '']"
        @click="selectedDate = date.dateStr"
      >
        {{ date.weekday }}<br />
        <strong>{{ date.date }}</strong>
      </div>
    </div>

    <div v-if="loading" class="loading-center">
      <el-icon class="is-loading" size="32"><Loading /></el-icon>
      <p>加载中...</p>
    </div>

    <div v-else>
      <div v-for="schedule in filteredSchedules" :key="schedule.id" class="schedule-card">
        <div class="schedule-header">
          <div class="time-badge">{{ schedule.startTime }} - {{ schedule.endTime }}</div>
          <div class="course-badge">{{ getCourseName(schedule.courseId) }}</div>
        </div>
        <div class="schedule-body">
          <div class="info-item">📍 {{ schedule.location || '待定' }}</div>
          <div class="info-item">👩‍🏫 {{ schedule.teacher || '待定' }}</div>
          <div class="info-item">👥 限{{ schedule.maxStudents }}人</div>
        </div>
        <div style="margin-top: 12px;">
          <el-button size="small" type="primary" @click="goToAttendance(schedule.id)">
            查看考勤
          </el-button>
          <el-button size="small" type="danger" @click="deleteSchedule(schedule.id)">
            删除
          </el-button>
        </div>
      </div>

      <div v-if="filteredSchedules.length === 0" class="empty-state">
        该日期暂无课程安排
      </div>
    </div>

    <button class="floating-btn" @click="showAddDialog = true">+</button>

    <el-dialog v-model="showAddDialog" title="添加课程安排" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="选择课程">
          <el-select v-model="form.courseId" placeholder="请选择课程" style="width: 100%">
            <el-option
              v-for="course in courses"
              :key="course.id"
              :label="course.name"
              :value="course.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="form.scheduleDate"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-time-picker
            v-model="form.startTime"
            placeholder="选择开始时间"
            style="width: 100%"
            format="HH:mm"
            value-format="HH:mm"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-time-picker
            v-model="form.endTime"
            placeholder="选择结束时间"
            style="width: 100%"
            format="HH:mm"
            value-format="HH:mm"
          />
        </el-form-item>
        <el-form-item label="地点">
          <el-input v-model="form.location" placeholder="请输入上课地点" />
        </el-form-item>
        <el-form-item label="老师">
          <el-input v-model="form.teacher" placeholder="请输入老师姓名" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="submitSchedule">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import { api } from '../api'

const router = useRouter()
const loading = ref(true)
const schedules = ref([])
const courses = ref([])
const selectedDate = ref('')
const dateList = ref([])
const showAddDialog = ref(false)
const form = ref({
  courseId: null,
  scheduleDate: '',
  startTime: '',
  endTime: '',
  location: '',
  teacher: ''
})

const filteredSchedules = computed(() => {
  if (!selectedDate.value) return schedules.value
  return schedules.value.filter(s => s.scheduleDate === selectedDate.value)
})

const initDateList = () => {
  const dates = []
  const today = new Date()
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  for (let i = 0; i < 14; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    dates.push({
      dateStr: date.toISOString().split('T')[0],
      weekday: weekDays[date.getDay()],
      date: date.getDate()
    })
  }
  dateList.value = dates
  selectedDate.value = dates[0].dateStr
}

const loadData = async () => {
  try {
    loading.value = true
    const [scheduleData, courseData] = await Promise.all([
      api.getSchedules(),
      api.getCourses()
    ])
    schedules.value = scheduleData
    courses.value = courseData
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

const goToAttendance = (scheduleId) => {
  router.push(`/attendance/${scheduleId}`)
}

const deleteSchedule = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个课程安排吗？', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await api.deleteSchedule(id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const submitSchedule = async () => {
  if (!form.value.courseId || !form.value.scheduleDate || !form.value.startTime || !form.value.endTime) {
    ElMessage.warning('请填写完整信息')
    return
  }
  try {
    const course = courses.value.find(c => c.id === form.value.courseId)
    await api.createSchedule({
      ...form.value,
      maxStudents: course ? course.capacity : 10
    })
    ElMessage.success('添加成功')
    showAddDialog.value = false
    form.value = {
      courseId: null,
      scheduleDate: '',
      startTime: '',
      endTime: '',
      location: '',
      teacher: ''
    }
    loadData()
  } catch (error) {
    ElMessage.error('添加失败')
  }
}

onMounted(() => {
  initDateList()
  loadData()
})
</script>
