<template>
  <div class="poll-list">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2><i class="bi bi-list-check me-2"></i>投票列表</h2>
      <router-link to="/create" class="btn btn-primary">
        <i class="bi bi-plus-lg me-1"></i>创建投票
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">加载中...</span>
      </div>
    </div>

    <div v-else-if="polls.length === 0" class="text-center py-5">
      <i class="bi bi-inbox display-1 text-muted mb-3"></i>
      <p class="text-muted">暂无投票，点击上方按钮创建一个吧！</p>
    </div>

    <div v-else class="row g-4">
      <div v-for="poll in polls" :key="poll.id" class="col-md-6 col-lg-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title">{{ poll.title }}</h5>
              <span :class="getStatusBadgeClass(poll)">
                {{ getStatusText(poll) }}
              </span>
            </div>
            <p class="card-text text-muted small mb-3" v-if="poll.description">
              {{ poll.description }}
            </p>
            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">
                <i class="bi bi-calendar me-1"></i>
                {{ formatDate(poll.createdAt) }}
              </small>
              <small class="text-muted">
                <i class="bi bi-people me-1"></i>
                {{ poll.options ? poll.options.length : 0 }} 个选项
              </small>
            </div>
          </div>
          <div class="card-footer bg-transparent">
            <router-link :to="`/poll/${poll.id}`" class="btn btn-outline-primary w-100">
              查看详情 <i class="bi bi-arrow-right ms-1"></i>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { pollApi } from '../api'

const polls = ref([])
const loading = ref(true)

const loadPolls = async () => {
  try {
    const response = await pollApi.getAllPolls()
    if (response.data.success) {
      polls.value = response.data.data
    }
  } catch (error) {
    console.error('加载投票列表失败:', error)
  } finally {
    loading.value = false
  }
}

const getStatusBadgeClass = (poll) => {
  if (!poll.isActive) return 'badge bg-secondary'
  if (poll.deadline && new Date(poll.deadline) < new Date()) return 'badge bg-danger'
  return 'badge bg-success'
}

const getStatusText = (poll) => {
  if (!poll.isActive) return '已关闭'
  if (poll.deadline && new Date(poll.deadline) < new Date()) return '已截止'
  return '进行中'
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
}

onMounted(() => {
  loadPolls()
})
</script>
