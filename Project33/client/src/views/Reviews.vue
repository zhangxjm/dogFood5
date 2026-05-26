<template>
  <div class="reviews-page">
    <el-card class="page-header" shadow="never">
      <div class="header-left">
        <h2 class="page-title">服务评价</h2>
        <p class="page-desc">查看用户对服务的评价</p>
      </div>
      <div class="stats" v-if="stats">
        <el-statistic title="平均评分" :value="stats.avgRating" :precision="1" />
        <el-statistic title="评价总数" :value="stats.totalReviews" style="margin-left: 32px" />
      </div>
    </el-card>

    <el-card shadow="never">
      <el-form :inline="true" class="filter-form">
        <el-form-item label="服务项目">
          <el-select v-model="filterService" placeholder="全部服务" clearable @change="fetchReviews">
            <el-option v-for="service in services" :key="service.id" :label="service.name" :value="service.id" />
          </el-select>
        </el-form-item>
      </el-form>

      <div v-if="reviews.length === 0" class="empty-tip">
        <el-empty description="暂无评价数据" />
      </div>

      <div v-else class="reviews-list">
        <el-card v-for="review in reviews" :key="review.id" class="review-card" shadow="hover">
          <div class="review-header">
            <el-avatar :size="40" class="avatar">{{ review.user_name?.charAt(0) || 'U' }}</el-avatar>
            <div class="user-info">
              <div class="user-name">{{ review.user_name }}</div>
              <div class="service-name">{{ review.service_name }}</div>
            </div>
            <el-rate :model-value="review.rating" disabled show-score text-color="#ff9900" score-template="{value}" />
          </div>
          <div class="review-content">
            {{ review.content || '用户未填写评价内容' }}
          </div>
          <div class="review-footer">
            <span class="review-time">{{ review.created_at }}</span>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { reviewApi, serviceApi, statsApi } from '../api'

const reviews = ref([])
const services = ref([])
const stats = ref(null)
const filterService = ref('')

const fetchReviews = async () => {
  try {
    const params = {}
    if (filterService.value) params.service_id = filterService.value
    const res = await reviewApi.getAll(params)
    reviews.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const fetchServices = async () => {
  try {
    const res = await serviceApi.getAll()
    services.value = res.data
  } catch (err) {
    console.error(err)
  }
}

const fetchStats = async () => {
  try {
    const res = await statsApi.getStats()
    stats.value = res.data
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  fetchReviews()
  fetchServices()
  fetchStats()
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.page-desc {
  margin: 4px 0 0;
  color: #999;
  font-size: 14px;
}

.stats {
  display: flex;
  align-items: center;
}

.filter-form {
  margin-bottom: 16px;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-card {
  transition: transform 0.2s;
}

.review-card:hover {
  transform: translateY(-2px);
}

.review-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.avatar {
  background: #67C23A;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 600;
  color: #333;
}

.service-name {
  font-size: 13px;
  color: #999;
  margin-top: 2px;
}

.review-content {
  color: #666;
  line-height: 1.6;
  padding: 12px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.review-footer {
  margin-top: 8px;
  text-align: right;
}

.review-time {
  color: #999;
  font-size: 13px;
}

.empty-tip {
  padding: 40px 0;
}
</style>
