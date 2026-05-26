<template>
  <view class="container">
    <view class="card">
      <view class="form-item">
        <text class="label">Select Date</text>
        <picker mode="date" :value="selectedDate" :start="today" @change="onDateChange">
          <view class="picker">{{ selectedDate || 'Please select date' }}</view>
        </picker>
      </view>
    </view>

    <view class="section-title">Available Time Slots</view>
    <view class="time-slots">
      <view 
        class="time-slot-card" 
        v-for="slot in timeSlots" 
        :key="slot.id"
        :class="{ 'selected': selectedSlot && selectedSlot.id === slot.id, 'disabled': slot.bookedCount >= slot.maxCapacity }"
        @click="selectSlot(slot)">
        <view class="slot-time">{{ slot.startTime }} - {{ slot.endTime }}</view>
        <view class="slot-right">
          <text class="slot-price">¥{{ slot.price }}/person</text>
          <text class="slot-capacity">{{ slot.bookedCount }}/{{ slot.maxCapacity }}</text>
          <text :class="slot.bookedCount >= slot.maxCapacity ? 'badge-full' : 'badge-available'">
            {{ slot.bookedCount >= slot.maxCapacity ? 'Full' : 'Available' }}
          </text>
        </view>
      </view>
    </view>

    <view class="card" v-if="selectedSlot">
      <view class="form-item">
        <text class="label">Visitor Name</text>
        <input class="input" v-model="form.visitorName" placeholder="Enter your name" />
      </view>
      <view class="form-item">
        <text class="label">Phone Number</text>
        <input class="input" v-model="form.visitorPhone" placeholder="Enter phone number" type="number" />
      </view>
      <view class="form-item">
        <text class="label">Visitor Count</text>
        <view class="stepper">
          <view class="stepper-btn" @click="decreaseCount">-</view>
          <text class="stepper-value">{{ form.visitorCount }}</text>
          <view class="stepper-btn" @click="increaseCount">+</view>
        </view>
      </view>
      <view class="form-item">
        <text class="label">Remark</text>
        <input class="input" v-model="form.remark" placeholder="Optional" />
      </view>
    </view>

    <view class="total-price" v-if="selectedSlot">
      <text>Total Amount:</text>
      <text class="price">¥{{ totalPrice }}</text>
    </view>

    <view class="footer">
      <button class="primary-btn" @click="submitReservation" :disabled="!selectedSlot || submitting">
        {{ submitting ? 'Submitting...' : 'Confirm Reservation' }}
      </button>
    </view>
  </view>
</template>

<script>
import { getTimeSlotsByDate, createReservation } from '../../api/index.js'

export default {
  data() {
    return {
      selectedDate: '',
      timeSlots: [],
      selectedSlot: null,
      form: {
        visitorName: '',
        visitorPhone: '',
        visitorCount: 1,
        remark: ''
      },
      submitting: false
    }
  },
  computed: {
    today() {
      return this.formatDate(new Date())
    },
    totalPrice() {
      if (this.selectedSlot && this.selectedSlot.price) {
        return (this.selectedSlot.price * this.form.visitorCount).toFixed(2)
      }
      return '0.00'
    }
  },
  onLoad() {
    this.selectedDate = this.formatDate(new Date())
    this.loadTimeSlots()
  },
  methods: {
    formatDate(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    onDateChange(e) {
      this.selectedDate = e.detail.value
      this.selectedSlot = null
      this.loadTimeSlots()
    },
    async loadTimeSlots() {
      try {
        const res = await getTimeSlotsByDate(this.selectedDate)
        this.timeSlots = res
      } catch (e) {
        uni.showToast({ title: 'Failed to load time slots', icon: 'none' })
      }
    },
    selectSlot(slot) {
      if (slot.bookedCount >= slot.maxCapacity) {
        uni.showToast({ title: 'This slot is full', icon: 'none' })
        return
      }
      this.selectedSlot = slot
    },
    decreaseCount() {
      if (this.form.visitorCount > 1) {
        this.form.visitorCount--
      }
    },
    increaseCount() {
      if (this.selectedSlot) {
        const available = this.selectedSlot.maxCapacity - this.selectedSlot.bookedCount
        if (this.form.visitorCount < available) {
          this.form.visitorCount++
        } else {
          uni.showToast({ title: 'Only ' + available + ' spots available', icon: 'none' })
        }
      }
    },
    async submitReservation() {
      if (!this.selectedSlot) {
        uni.showToast({ title: 'Please select a time slot', icon: 'none' })
        return
      }
      if (!this.form.visitorName) {
        uni.showToast({ title: 'Please enter visitor name', icon: 'none' })
        return
      }
      if (!this.form.visitorPhone || this.form.visitorPhone.length !== 11) {
        uni.showToast({ title: 'Please enter valid phone number', icon: 'none' })
        return
      }

      this.submitting = true
      try {
        const data = {
          timeSlotId: this.selectedSlot.id,
          visitorName: this.form.visitorName,
          visitorPhone: this.form.visitorPhone,
          visitorCount: this.form.visitorCount,
          remark: this.form.remark
        }
        const res = await createReservation(data)
        uni.showModal({
          title: 'Reservation Success',
          content: 'Order No: ' + res.orderNo + '\nPlease keep this order number for verification',
          showCancel: false,
          success: () => {
            this.form = {
              visitorName: '',
              visitorPhone: '',
              visitorCount: 1,
              remark: ''
            }
            this.selectedSlot = null
            this.loadTimeSlots()
          }
        })
      } catch (e) {
        uni.showToast({ title: e || 'Reservation failed', icon: 'none' })
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped>
.form-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eee;
}

.form-item:last-child {
  border-bottom: none;
}

.label {
  width: 200rpx;
  font-size: 28rpx;
  color: #333;
}

.picker {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.input {
  flex: 1;
  font-size: 28rpx;
}

.stepper {
  display: flex;
  align-items: center;
}

.stepper-btn {
  width: 60rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  background: #f5f5f5;
  border-radius: 50%;
  font-size: 32rpx;
}

.stepper-value {
  width: 80rpx;
  text-align: center;
  font-size: 32rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin: 20rpx 0;
}

.time-slots {
  margin-bottom: 20rpx;
}

.time-slot-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
  border: 2rpx solid transparent;
}

.time-slot-card.selected {
  border-color: #4CAF50;
  background: #f0f9f0;
}

.time-slot-card.disabled {
  opacity: 0.5;
}

.slot-time {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.slot-right {
  text-align: right;
}

.slot-price {
  display: block;
  font-size: 28rpx;
  color: #4CAF50;
  font-weight: bold;
}

.slot-capacity {
  display: block;
  font-size: 24rpx;
  color: #666;
  margin-top: 10rpx;
}

.badge-available {
  display: inline-block;
  font-size: 22rpx;
  color: #4CAF50;
  background: #e8f5e9;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  margin-top: 10rpx;
}

.badge-full {
  display: inline-block;
  font-size: 22rpx;
  color: #f44336;
  background: #ffebee;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  margin-top: 10rpx;
}

.total-price {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 32rpx;
}

.price {
  color: #4CAF50;
  font-size: 40rpx;
  font-weight: bold;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx;
  background: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.1);
}
</style>
