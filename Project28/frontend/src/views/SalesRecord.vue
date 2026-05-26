<template>
  <div class="page-container">
    <div class="page-header">
      <div class="page-title">Sales Records</div>
      <div class="page-subtitle">View and manage your daily sales</div>
    </div>

    <div class="card">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <span style="font-weight: 500;">Select Date</span>
        <van-calendar v-model="showCalendar" @confirm="onDateConfirm">
          <template #trigger>
            <div style="color: #ff6b35; font-weight: 500;">
              {{ selectedDate }}
            </div>
          </template>
        </van-calendar>
      </div>
    </div>

    <div class="stat-card green">
      <div class="stat-label">Total Revenue</div>
      <div class="stat-value">¥{{ summary.totalAmount || '0.00' }}</div>
      <div style="margin-top: 8px; font-size: 14px; opacity: 0.9;">
        {{ summary.recordCount || 0 }} records · {{ summary.totalQuantity || 0 }} items sold
      </div>
    </div>

    <div class="section-title">Records</div>
    <div class="card" style="padding: 0;">
      <div v-if="records.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <div class="empty-text">No records for this date</div>
        <div style="margin-top: 12px;">
          <van-button type="primary" size="small" @click="$router.push('/add-sale')">
            Add Record
          </van-button>
        </div>
      </div>
      <div v-else>
        <div
          v-for="record in records"
          :key="record.id"
          class="record-item"
        >
          <div class="record-info">
            <div class="record-name">{{ record.categoryName }}</div>
            <div class="record-meta">
              Qty: {{ record.quantity }} × ¥{{ record.unitPrice }}
              <span v-if="record.remark" style="margin-left: 8px;">
                · {{ record.remark }}
              </span>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="record-amount">¥{{ record.totalAmount }}</div>
            <van-icon name="delete-o" color="#ff4d4f" @click="deleteRecord(record.id)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { showToast, showConfirmDialog } from 'vant'
import { api } from '../api'
import dayjs from 'dayjs'

const selectedDate = ref(dayjs().format('YYYY-MM-DD'))
const showCalendar = ref(false)
const records = ref([])
const summary = ref({})

const loadData = async () => {
  try {
    const summaryData = await api.getDailySummary(selectedDate.value)
    summary.value = summaryData
    records.value = summaryData.records || []
  } catch (e) {
    console.error('Failed to load records:', e)
    records.value = []
    summary.value = {}
  }
}

const onDateConfirm = (date) => {
  selectedDate.value = dayjs(date).format('YYYY-MM-DD')
  showCalendar.value = false
  loadData()
}

const deleteRecord = async (id) => {
  try {
    await showConfirmDialog({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this record?'
    })
    await api.deleteRecord(id)
    showToast('Deleted successfully')
    loadData()
  } catch (e) {
    if (e !== 'cancel') {
      console.error('Failed to delete record:', e)
    }
  }
}

onMounted(() => {
  loadData()
})
</script>
