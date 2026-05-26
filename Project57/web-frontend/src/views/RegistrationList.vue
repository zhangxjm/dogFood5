<template>
  <div>
    <div class="page-header">
      <h2 class="page-title">报名记录</h2>
    </div>

    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-value">{{ registrations.length }}</div>
        <div class="stat-label">总报名数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: #4caf50;">{{ paidCount }}</div>
        <div class="stat-label">已缴费</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: #409eff;">¥{{ totalAmount }}</div>
        <div class="stat-label">总金额</div>
      </div>
    </div>

    <div v-if="loading" class="loading-center">
      <el-icon class="is-loading" size="32"><Loading /></el-icon>
      <p>加载中...</p>
    </div>

    <div v-else>
      <div v-for="reg in registrations" :key="reg.id" class="registration-card">
        <div class="reg-header">
          <div class="reg-course">{{ getCourseName(reg.courseId) }}</div>
          <span :class="['p-tag', reg.paymentStatus === 'paid' ? 'tag-paid' : 'tag-pending']">
            {{ reg.paymentStatus === 'paid' ? '已缴费' : '待缴费' }}
          </span>
        </div>
        <div class="reg-body">
          <div class="reg-row"><span>家长：</span>{{ reg.parentName }}</div>
          <div class="reg-row"><span>电话：</span>{{ reg.parentPhone }}</div>
          <div class="reg-row"><span>孩子：</span>{{ reg.childName }}（{{ reg.childAge }}岁）</div>
          <div v-if="reg.remark" class="reg-row"><span>备注：</span>{{ reg.remark }}</div>
        </div>
        <div class="reg-footer">
          <div class="reg-amount">¥{{ reg.amount }}</div>
          <div class="reg-time">{{ formatTime(reg.createdAt) }}</div>
        </div>
        <div class="reg-actions">
          <el-button
            v-if="reg.paymentStatus !== 'paid'"
            type="success"
            size="small"
            @click="confirmPayment(reg.id)"
          >
            确认缴费
          </el-button>
          <el-button type="danger" size="small" @click="deleteReg(reg.id)">
            删除
          </el-button>
        </div>
      </div>

      <div v-if="registrations.length === 0" class="empty-state">
        暂无报名记录
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import { api } from '../api'

const loading = ref(true)
const registrations = ref([])
const courses = ref([])

const paidCount = computed(() => {
  return registrations.value.filter(r => r.paymentStatus === 'paid').length
})

const totalAmount = computed(() => {
  return registrations.value
    .filter(r => r.paymentStatus === 'paid')
    .reduce((sum, r) => sum + parseFloat(r.amount), 0)
    .toFixed(2)
})

const loadData = async () => {
  try {
    loading.value = true
    const [regData, courseData] = await Promise.all([
      api.getRegistrations(),
      api.getCourses()
    ])
    registrations.value = regData
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

const formatTime = (dateStr) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const confirmPayment = async (id) => {
  try {
    await ElMessageBox.confirm('确认已收到缴费？', '确认缴费', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await api.updateRegistration(id, { paymentStatus: 'paid' })
    ElMessage.success('缴费成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

const deleteReg = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这条报名记录吗？', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await api.deleteRegistration(id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  loadData()
})
</script>
