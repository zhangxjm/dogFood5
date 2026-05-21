<template>
  <div class="page-container">
    <van-nav-bar title="预约练车" fixed placeholder />
    
    <van-cell-group inset style="margin-top: 12px;">
      <van-field
        v-model="selectedCoachId"
        name="coach"
        label="选择教练"
        placeholder="请选择教练"
        is-link
        readonly
        @click="showCoachPicker = true"
      />
    </van-cell-group>

    <van-cell-group inset style="margin-top: 12px;">
      <van-field
        v-model="selectedDate"
        name="date"
        label="预约日期"
        placeholder="请选择日期"
        is-link
        readonly
        @click="showDatePicker = true"
      />
    </van-cell-group>

    <div style="padding: 12px;">
      <van-button type="primary" block :loading="loading" @click="loadSchedules">
        查询可预约时段
      </van-button>
    </div>

    <van-divider>可预约时段</van-divider>

    <van-empty v-if="schedules.length === 0 && !loading" description="暂无可用时段" />

    <div v-else style="padding: 0 12px;">
      <van-cell-group inset>
        <van-cell
          v-for="schedule in schedules"
          :key="schedule.id"
          :title="`${formatTime(schedule.start_time)} - ${formatTime(schedule.end_time)}`"
          :label="`教练: ${schedule.coach.name} | 车型: ${schedule.coach.car_type} | 车牌号: ${schedule.coach.car_number}`"
          is-link
          @click="handleBook(schedule)"
        >
          <template #right-icon>
            <van-tag type="success">可预约</van-tag>
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <van-popup v-model:show="showCoachPicker" position="bottom">
      <van-picker
        :columns="coachColumns"
        @confirm="onConfirmCoach"
        @cancel="showCoachPicker = false"
      />
    </van-popup>

    <van-popup v-model:show="showDatePicker" position="bottom">
      <van-date-picker
        v-model="datePickerValue"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onConfirmDate"
        @cancel="showDatePicker = false"
      />
    </van-popup>

    <van-dialog
      v-model:show="showBookDialog"
      title="确认预约"
      @confirm="confirmBooking"
    >
      <div v-if="selectedSchedule" style="padding: 20px;">
        <p>日期: {{ selectedSchedule.date }}</p>
        <p>时间: {{ formatTime(selectedSchedule.start_time) }} - {{ formatTime(selectedSchedule.end_time) }}</p>
        <p>教练: {{ selectedSchedule.coach.name }}</p>
        <p>车型: {{ selectedSchedule.coach.car_type }}</p>
        <p>车牌号: {{ selectedSchedule.coach.car_number }}</p>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { showToast } from 'vant'
import dayjs from 'dayjs'
import { getCoaches, getAvailableSchedules, createBooking } from '../api'

const loading = ref(false)
const coaches = ref([])
const schedules = ref([])
const selectedCoachId = ref('')
const selectedCoachName = ref('')
const selectedDate = ref('')
const showCoachPicker = ref(false)
const showDatePicker = ref(false)
const showBookDialog = ref(false)
const selectedSchedule = ref(null)

const today = new Date()
const datePickerValue = ref([today.getFullYear(), today.getMonth() + 1, today.getDate()])
const minDate = new Date()
const maxDate = new Date()
maxDate.setMonth(maxDate.getMonth() + 1)

const coachColumns = ref([
  { text: '全部教练', value: '' },
])

const formatTime = (time) => {
  return time ? time.substring(0, 5) : ''
}

const loadCoaches = async () => {
  try {
    const res = await getCoaches()
    if (res.data.success) {
      coaches.value = res.data.data
      coachColumns.value = [
        { text: '全部教练', value: '' },
        ...res.data.data.map(c => ({ text: c.name, value: c.id }))
      ]
    }
  } catch (e) {
    showToast('加载教练列表失败')
  }
}

const loadSchedules = async () => {
  if (!selectedDate.value) {
    showToast('请选择预约日期')
    return
  }
  
  loading.value = true
  try {
    const params = { date: selectedDate.value }
    if (selectedCoachId.value) {
      params.coach_id = selectedCoachId.value
    }
    const res = await getAvailableSchedules(params)
    if (res.data.success) {
      schedules.value = res.data.data
      if (schedules.value.length === 0) {
        showToast('该日期暂无可用时段')
      }
    }
  } catch (e) {
    showToast('加载时段失败')
  } finally {
    loading.value = false
  }
}

const onConfirmCoach = ({ selectedOptions }) => {
  selectedCoachId.value = selectedOptions[0].value
  selectedCoachName.value = selectedOptions[0].text
  showCoachPicker.value = false
}

const onConfirmDate = ({ selectedValues }) => {
  const [year, month, day] = selectedValues
  selectedDate.value = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  showDatePicker.value = false
}

const handleBook = (schedule) => {
  const studentId = localStorage.getItem('studentId')
  if (!studentId) {
    showToast('请先在个人中心选择学员')
    return
  }
  selectedSchedule.value = schedule
  showBookDialog.value = true
}

const confirmBooking = async () => {
  if (!selectedSchedule.value) return
  
  const studentId = localStorage.getItem('studentId')
  try {
    const res = await createBooking({
      schedule_id: selectedSchedule.value.id,
      student_id: parseInt(studentId)
    })
    if (res.data.success) {
      showToast('预约成功')
      showBookDialog.value = false
      loadSchedules()
    } else {
      showToast(res.data.message || '预约失败')
    }
  } catch (e) {
    showToast(e.response?.data?.message || '预约失败')
  }
}

onMounted(() => {
  loadCoaches()
})
</script>

<style scoped>
.page-container {
  padding-bottom: 80px;
}
</style>
