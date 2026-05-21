<template>
  <div class="vote-history">
    <h2 class="mb-4">
      <i class="bi bi-clock-history me-2"></i>我的投票历史
    </h2>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">加载中...</span>
      </div>
    </div>

    <div v-else-if="history.length === 0" class="text-center py-5">
      <i class="bi bi-inbox display-1 text-muted mb-3"></i>
      <p class="text-muted">您还没有参与任何投票</p>
      <router-link to="/" class="btn btn-primary">去投票</router-link>
    </div>

    <div v-else class="row g-4">
      <div v-for="record in history" :key="record.id" class="col-md-6 col-lg-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">
              <i class="bi bi-check-circle-fill text-success me-2"></i>
              已投票
            </h5>
            <div class="mb-3">
              <small class="text-muted">投票时间</small>
              <p class="mb-0">{{ formatDate(record.votedAt) }}</p>
            </div>
            <div>
              <small class="text-muted">投票ID</small>
              <p class="mb-0 text-break">{{ record.poll.id }}</p>
            </div>
          </div>
          <div class="card-footer bg-transparent">
            <router-link :to="`/poll/${record.poll.id}`" class="btn btn-outline-primary w-100">
              查看投票详情
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

const history = ref([])
const loading = ref(true)

const loadHistory = async () => {
  loading.value = true
  try {
    const response = await pollApi.getHistory()
    if (response.data.success) {
      history.value = response.data.data
    }
  } catch (error) {
    console.error('加载投票历史失败:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN')
}

onMounted(() => {
  loadHistory()
})
</script>
