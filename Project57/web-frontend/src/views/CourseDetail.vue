<template>
  <div>
    <div v-if="loading" class="loading-center">
      <el-icon class="is-loading" size="32"><Loading /></el-icon>
      <p>加载中...</p>
    </div>

    <div v-else-if="course" class="detail-container">
      <div class="detail-header">
        <div v-if="course.imageUrl" class="detail-image">
          <img :src="course.imageUrl" :alt="course.name" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;" />
        </div>
        <div v-else class="detail-image">🎨</div>
        <div class="detail-info">
          <h2>{{ course.name }}</h2>
          <div class="detail-price">¥{{ course.price }}</div>
          <p class="detail-desc">{{ course.description }}</p>
          <div class="detail-meta">
            <span>👥 限招{{ course.capacity }}人</span>
            <span v-if="course.isActive" style="color: #4caf50;">● 招生中</span>
          </div>
          <div style="margin-top: 16px;">
            <el-button type="primary" size="large" @click="showRegisterDialog = true">
              立即报名
            </el-button>
            <el-button @click="goBack">返回列表</el-button>
          </div>
        </div>
      </div>

      <div class="section-title">课程安排</div>
      <div class="section-content">
        <div v-if="schedules.length > 0">
          <div v-for="schedule in schedules" :key="schedule.id" class="schedule-card">
            <div class="schedule-header">
              <div class="time-badge">{{ schedule.startTime }} - {{ schedule.endTime }}</div>
              <div class="course-badge">{{ formatDate(schedule.scheduleDate) }}</div>
            </div>
            <div class="schedule-body">
              <div class="info-item">📍 {{ schedule.location || '待定' }}</div>
              <div class="info-item">👩‍🏫 {{ schedule.teacher || '待定' }}</div>
              <div class="info-item">👥 限{{ schedule.maxStudents }}人</div>
            </div>
            <div style="margin-top: 12px;">
              <el-button size="small" @click="goToAttendance(schedule.id)">
                查看考勤
              </el-button>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">暂无课程安排</div>
      </div>

      <div class="section-title">报名学员 ({{ registrations.length }})</div>
      <div class="section-content">
        <div v-if="registrations.length > 0">
          <div v-for="reg in registrations" :key="reg.id" class="registration-card">
            <div class="reg-header">
              <div class="reg-course">{{ reg.childName }}（{{ reg.childAge }}岁）</div>
              <span :class="['p-tag', reg.paymentStatus === 'paid' ? 'tag-paid' : 'tag-pending']">
                {{ reg.paymentStatus === 'paid' ? '已缴费' : '待缴费' }}
              </span>
            </div>
            <div class="reg-body">
              <div class="reg-row"><span>家长：</span>{{ reg.parentName }}</div>
              <div class="reg-row"><span>电话：</span>{{ reg.parentPhone }}</div>
            </div>
            <div class="reg-footer">
              <div class="reg-amount">¥{{ reg.amount }}</div>
              <div class="reg-time">{{ formatTime(reg.createdAt) }}</div>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">暂无报名</div>
      </div>
    </div>

    <el-dialog v-model="showRegisterDialog" title="报名信息" width="500px">
      <el-form :model="regForm" label-width="100px">
        <el-form-item label="家长姓名">
          <el-input v-model="regForm.parentName" placeholder="请输入家长姓名" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="regForm.parentPhone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="孩子姓名">
          <el-input v-model="regForm.childName" placeholder="请输入孩子姓名" />
        </el-form-item>
        <el-form-item label="孩子年龄">
          <el-input-number v-model="regForm.childAge" :min="1" :max="18" style="width: 100%" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="regForm.remark" type="textarea" :rows="2" placeholder="选填" />
        </el-form-item>
        <el-form-item label="应付金额">
          <span style="color: #ff6b6b; font-size: 22px; font-weight: 600;">¥{{ course.price }}</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showRegisterDialog = false">取消</el-button>
        <el-button type="primary" @click="submitRegistration">确认报名</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import { api } from '../api'

const route = useRoute()
const router = useRouter()
const courseId = route.params.id

const loading = ref(true)
const course = ref(null)
const schedules = ref([])
const registrations = ref([])
const showRegisterDialog = ref(false)
const regForm = ref({
  parentName: '',
  parentPhone: '',
  childName: '',
  childAge: 5,
  remark: ''
})

const loadData = async () => {
  try {
    loading.value = true
    const [courseData, scheduleData, regData] = await Promise.all([
      api.getCourse(courseId),
      api.getSchedules({ courseId }),
      api.getRegistrations(courseId)
    ])
    course.value = courseData
    schedules.value = scheduleData
    registrations.value = regData
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${date.getMonth() + 1}月${date.getDate()}日 ${weekDays[date.getDay()]}`
}

const formatTime = (dateStr) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
}

const goBack = () => {
  router.push('/courses')
}

const goToAttendance = (scheduleId) => {
  router.push(`/attendance/${scheduleId}`)
}

const submitRegistration = async () => {
  if (!regForm.value.parentName || !regForm.value.parentPhone || !regForm.value.childName) {
    ElMessage.warning('请填写完整信息')
    return
  }
  try {
    await api.createRegistration({
      courseId: courseId,
      parentName: regForm.value.parentName,
      parentPhone: regForm.value.parentPhone,
      childName: regForm.value.childName,
      childAge: regForm.value.childAge,
      amount: course.value.price,
      remark: regForm.value.remark
    })
    ElMessage.success('报名成功')
    showRegisterDialog.value = false
    regForm.value = {
      parentName: '',
      parentPhone: '',
      childName: '',
      childAge: 5,
      remark: ''
    }
    loadData()
  } catch (error) {
    ElMessage.error('报名失败')
  }
}

onMounted(() => {
  loadData()
})
</script>
