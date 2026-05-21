<template>
  <div class="page-container">
    <van-nav-bar title="我的预约" fixed placeholder />

    <van-tabs v-model:active="activeTab" sticky offset-top="46">
      <van-tab title="全部" name="all"></van-tab>
      <van-tab title="已预约" name="booked"></van-tab>
      <van-tab title="已完成" name="completed"></van-tab>
      <van-tab title="已取消" name="cancelled"></van-tab>
    </van-tabs>

    <van-empty v-if="bookings.length === 0 && !loading" description="暂无预约记录" />

    <div v-else style="padding: 12px;">
      <van-cell-group inset>
        <van-cell
          v-for="booking in bookings"
          :key="booking.id"
          :title="`${booking.booking_date} ${formatTime(booking.start_time)}`"
          :label="`教练: ${booking.coach.name} | 车型: ${booking.coach.car_type}`"
        >
          <template #right-icon>
            <div style="text-align: right;">
              <van-tag :type="getStatusType(booking.status)">
                {{ getStatusText(booking.status) }}
              </van-tag>
              <div v-if="booking.status === 'booked'" style="margin-top: 8px;">
                <van-button size="small" type="danger" @click="handleCancel(booking)">
                  取消预约
                </van-button>
              </div>
            </div>
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <van-popup v-model:show="showCancelDialog" position="bottom">
      <div style="padding: 20px;">
        <h4 style="margin-bottom: 16px;">取消预约</h4>
        <van-field
          v-model="cancelReason"
          type="textarea"
          label="取消原因"
          placeholder="请输入取消原因"
          rows="3"
        />
        <div style="display: flex; gap: 12px; margin-top: 20px;">
          <van-button block @click="showCancelDialog = false">取消</van-button>
          <van-button type="primary" block :loading="cancelling" @click="confirmCancel">
            确认取消
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { showToast } from 'vant'
import { getStudentBookings, cancelBooking } from '../api'

const loading = ref(false)
const cancelling = ref(false)
const bookings = ref([])
const activeTab = ref('all')
const showCancelDialog = ref(false)
const cancelReason = ref('')
const currentBooking = ref(null)

const formatTime = (time) => {
  return time ? time.substring(0, 5) : ''
}

const getStatusType = (status) => {
  const map = {
    booked: 'primary',
    completed: 'success',
    cancelled: 'danger'
  }
  return map[status] || 'default'
}

const getStatusText = (status) => {
  const map = {
    booked: '已预约',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] || status
}

const loadBookings = async () => {
  const studentId = localStorage.getItem('studentId')
  if (!studentId) {
    bookings.value = []
    return
  }

  loading.value = true
  try {
    const status = activeTab.value === 'all' ? '' : activeTab.value
    const res = await getStudentBookings(studentId, status)
    if (res.data.success) {
      bookings.value = res.data.data
    }
  } catch (e) {
    showToast('加载预约记录失败')
  } finally {
    loading.value = false
  }
}

const handleCancel = (booking) => {
  currentBooking.value = booking
  cancelReason.value = ''
  showCancelDialog.value = true
}

const confirmCancel = async () => {
  if (!currentBooking.value) return
  if (!cancelReason.value.trim()) {
    showToast('请输入取消原因')
    return
  }

  cancelling.value = true
  try {
    const res = await cancelBooking(currentBooking.value.id, cancelReason.value)
    if (res.data.success) {
      showToast('取消成功')
      showCancelDialog.value = false
      loadBookings()
    } else {
      showToast(res.data.message || '取消失败')
    }
  } catch (e) {
    showToast('取消失败')
  } finally {
    cancelling.value = false
  }
}

watch(activeTab, () => {
  loadBookings()
})

onMounted(() => {
  loadBookings()
})
</script>

<style scoped>
.page-container {
  padding-bottom: 80px;
}
</style>
