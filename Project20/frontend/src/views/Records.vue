<template>
  <div class="page-container">
    <van-nav-bar title="练车记录" fixed placeholder />

    <van-cell-group inset style="margin-top: 12px;">
      <van-cell title="累计练车次数" :value="`${stats.total_records || 0} 次`" />
      <van-cell title="累计练车时长" :value="`${(stats.total_hours || 0).toFixed(1)} 小时`" />
    </van-cell-group>

    <van-divider>练车明细</van-divider>

    <van-empty v-if="records.length === 0 && !loading" description="暂无练车记录" />

    <div v-else style="padding: 0 12px;">
      <van-cell-group inset>
        <van-cell
          v-for="record in records"
          :key="record.id"
          :title="`${record.training_date} ${formatTime(record.start_time)}`"
        >
          <template #label>
            <p>教练: {{ record.coach.name }}</p>
            <p>科目: {{ record.subject_type }}</p>
            <p v-if="record.coach_feedback">教练评价: {{ record.coach_feedback }}</p>
          </template>
          <template #right-icon>
            <van-tag type="success">{{ record.duration }}分钟</van-tag>
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="loadMore"
      style="padding: 12px;"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { showToast } from 'vant'
import { getStudentRecords, getRecordStats } from '../api'

const loading = ref(false)
const finished = ref(false)
const records = ref([])
const stats = ref({})
const page = ref(1)
const pageSize = ref(10)

const formatTime = (time) => {
  return time ? time.substring(0, 5) : ''
}

const loadStats = async () => {
  const studentId = localStorage.getItem('studentId')
  if (!studentId) return

  try {
    const res = await getRecordStats({ student_id: studentId })
    if (res.data.success) {
      stats.value = res.data.data
    }
  } catch (e) {
    console.error('加载统计失败')
  }
}

const loadRecords = async (isLoadMore = false) => {
  const studentId = localStorage.getItem('studentId')
  if (!studentId) {
    finished.value = true
    return
  }

  if (!isLoadMore) {
    page.value = 1
    records.value = []
    finished.value = false
  }

  loading.value = true
  try {
    const res = await getStudentRecords(studentId, {
      page: page.value,
      page_size: pageSize.value
    })
    if (res.data.success) {
      const newRecords = res.data.data.records || []
      records.value = isLoadMore ? [...records.value, ...newRecords] : newRecords
      
      if (newRecords.length < pageSize.value) {
        finished.value = true
      } else {
        page.value++
      }
    }
  } catch (e) {
    showToast('加载记录失败')
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  loadRecords(true)
}

onMounted(() => {
  loadStats()
  loadRecords()
})
</script>

<style scoped>
.page-container {
  padding-bottom: 80px;
}
</style>
