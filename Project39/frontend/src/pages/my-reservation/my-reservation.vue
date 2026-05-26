<template>
  <view class="container">
    <view class="card">
      <view class="form-item">
        <text class="label">Phone Number</text>
        <input class="input" v-model="phone" placeholder="Enter your phone number" type="number" />
        <button class="query-btn" @click="queryReservations">Query</button>
      </view>
    </view>

    <view class="reservation-list" v-if="reservations.length > 0">
      <view class="reservation-card" v-for="item in reservations" :key="item.id">
        <view class="card-header">
          <text class="order-no">{{ item.orderNo</text>
          <text :class="getStatusClass(item.status)">{{ getStatusText(item.status) }}</text>
        </view>
        <view class="card-body">
          <view class="info-row">
            <text class="info-label">Visitor</text>
            <text class="info-value">{{ item.visitorName }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">Phone</text>
            <text class="info-value">{{ item.visitorPhone }}</text>
          </view>
          <view class="info-row">
            <text class="info-label">Count</text>
            <text class="info-value">{{ item.visitorCount }} people</text>
          </view>
          <view class="info-row">
            <text class="info-label">Create Time</text>
            <text class="info-value">{{ formatTime(item.createTime) }}</text>
          </view>
          <view class="info-row" v-if="item.verifyTime">
            <text class="info-label">Verify Time</text>
            <text class="info-value">{{ formatTime(item.verifyTime) }}</text>
          </view>
        </view>
        <view class="card-footer" v-if="item.status === 'BOOKED'">
          <button class="cancel-btn" @click="cancelOrder(item.orderNo)">Cancel</button>
        </view>
      </view>
    </view>

    <view class="empty" v-else-if="queried">
      <text>No reservations found</text>
    </view>
  </view>
</template>

<script>
import { getReservationsByPhone, cancelReservation } from '../../api/index.js'

export default {
  data() {
    return {
      phone: '',
      reservations: [],
      queried: false
    }
  },
  methods: {
    async queryReservations() {
      if (!this.phone || this.phone.length !== 11) {
        uni.showToast({ title: 'Please enter valid phone number', icon: 'none' })
        return
      }
      try {
        const res = await getReservationsByPhone(this.phone)
        this.reservations = res
        this.queried = true
      } catch (e) {
        uni.showToast({ title: 'Query failed', icon: 'none' })
      }
    },
    async cancelOrder(orderNo) {
      uni.showModal({
        title: 'Confirm',
        content: 'Are you sure you want to cancel this reservation?',
        success: async (res) => {
          if (res.confirm) {
            try {
              await cancelReservation(orderNo)
              uni.showToast({ title: 'Cancelled', icon: 'success' })
              this.queryReservations()
            } catch (e) {
              uni.showToast({ title: 'Cancel failed', icon: 'none' })
            }
          }
        }
      })
    },
    getStatusClass(status) {
      switch (status) {
        case 'BOOKED': return 'status-booked'
        case 'VERIFIED': return 'status-verified'
        case 'CANCELLED': return 'status-cancelled'
        default: return ''
      }
    },
    getStatusText(status) {
      switch (status) {
        case 'BOOKED': return 'Booked'
        case 'VERIFIED': return 'Verified'
        case 'CANCELLED': return 'Cancelled'
        default: return status
      }
    },
    formatTime(time) {
      if (!time) return '-'
      return time.replace('T', ' ').substring(0, 19)
    }
  }
}
</script>

<style scoped>
.form-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
}

.label {
  width: 200rpx;
  font-size: 28rpx;
  color: #333;
}

.input {
  flex: 1;
  font-size: 28rpx;
}

.query-btn {
  padding: 10rpx 30rpx;
  font-size: 24rpx;
  background: #4CAF50;
  color: #fff;
  border-radius: 30rpx;
  margin-left: 20rpx;
}

.query-btn::after {
  border: none;
}

.reservation-list {
  margin-top: 20rpx;
}

.reservation-card {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background: #f5f5f5;
}

.order-no {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.card-body {
  padding: 20rpx 30rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 12rpx 0;
}

.info-label {
  font-size: 26rpx;
  color: #666;
}

.info-value {
  font-size: 26rpx;
  color: #333;
}

.card-footer {
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #eee;
  text-align: right;
}

.cancel-btn {
  padding: 10rpx 40rpx;
  font-size: 24rpx;
  background: #f44336;
  color: #fff;
  border-radius: 30rpx;
}

.cancel-btn::after {
  border: none;
}

.status-booked {
  font-size: 24rpx;
  color: #2196F3;
  background: #E3F2FD;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
}

.status-verified {
  font-size: 24rpx;
  color: #4CAF50;
  background: #E8F5E9;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
}

.status-cancelled {
  font-size: 24rpx;
  color: #999;
  background: #f5f5f5;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
}

.empty {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>
