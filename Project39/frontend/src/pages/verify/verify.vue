<template>
  <view class="container">
    <view class="card">
      <view class="verify-header">
        <view class="verify-icon">🎫</view>
        <text class="verify-title">Verify Entry</text>
        <text class="verify-desc">Enter your order number to verify entry</text>
      </view>

      <view class="form-item">
        <text class="label">Order No.</text>
        <input class="input" v-model="orderNo" placeholder="Enter order number" />
      </view>

      <button class="primary-btn" @click="verify" :disabled="!orderNo || verifying">
        {{ verifying ? 'Verifying...' : 'Verify' }}
      </button>
    </view>

    <view class="card" v-if="reservation">
      <view class="result-header">
        <text class="result-title">Reservation Details</text>
        <text :class="statusClass">{{ statusText }}</text>
      </view>
      <view class="detail-item">
        <text class="detail-label">Order No.</text>
        <text class="detail-value">{{ reservation.orderNo }}</text>
      </view>
      <view class="detail-item">
        <text class="detail-label">Visitor Name</text>
        <text class="detail-value">{{ reservation.visitorName }}</text>
      </view>
      <view class="detail-item">
        <text class="detail-label">Phone</text>
        <text class="detail-value">{{ reservation.visitorPhone }}</text>
      </view>
      <view class="detail-item">
        <text class="detail-label">Visitor Count</text>
        <text class="detail-value">{{ reservation.visitorCount }}</text>
      </view>
      <view class="detail-item">
        <text class="detail-label">Create Time</text>
        <text class="detail-value">{{ formatTime(reservation.createTime) }}</text>
      </view>
      <view class="detail-item" v-if="reservation.verifyTime">
        <text class="detail-label">Verify Time</text>
        <text class="detail-value">{{ formatTime(reservation.verifyTime) }}</text>
      </view>
      <view class="detail-item" v-if="reservation.remark">
        <text class="detail-label">Remark</text>
        <text class="detail-value">{{ reservation.remark }}</text>
      </view>
    </view>

    <view class="card">
      <view class="query-section">
        <text class="section-title">My Recent Reservations</text>
        <view class="form-item">
          <text class="label">Phone</text>
          <input class="input" v-model="queryPhone" placeholder="Enter phone number" type="number" />
          <button class="query-btn" @click="queryByPhone">Query</button>
        </view>
      </view>

      <view class="reservation-list" v-if="myReservations.length > 0">
        <view class="reservation-item" v-for="item in myReservations" :key="item.id">
          <view class="item-header">
            <text class="order-no">{{ item.orderNo }}</text>
            <text :class="getStatusClass(item.status)">{{ getStatusText(item.status) }}</text>
          </view>
          <view class="item-info">
            <text>{{ item.visitorName }} | {{ item.visitorCount }} people</text>
          </view>
          <view class="item-info">
            <text class="text-muted">{{ formatTime(item.createTime) }}</text>
          </view>
        </view>
      </view>
      <view class="empty" v-else-if="queried">
        <text>No reservations found</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getReservationByOrderNo, verifyReservation, getReservationsByPhone } from '../../api/index.js'

export default {
  data() {
    return {
      orderNo: '',
      verifying: false,
      reservation: null,
      queryPhone: '',
      myReservations: [],
      queried: false
    }
  },
  computed: {
    statusClass() {
      if (!this.reservation) return ''
      return this.getStatusClass(this.reservation.status)
    },
    statusText() {
      if (!this.reservation) return ''
      return this.getStatusText(this.reservation.status)
    }
  },
  methods: {
    async verify() {
      if (!this.orderNo) {
        uni.showToast({ title: 'Please enter order number', icon: 'none' })
        return
      }
      this.verifying = true
      try {
        const res = await verifyReservation(this.orderNo)
        this.reservation = res
        uni.showToast({ title: 'Verification Successful', icon: 'success' })
      } catch (e) {
        try {
          const res = await getReservationByOrderNo(this.orderNo)
          this.reservation = res
        } catch (e2) {
          uni.showToast({ title: 'Order not found', icon: 'none' })
        }
      } finally {
        this.verifying = false
      }
    },
    async queryByPhone() {
      if (!this.queryPhone) {
        uni.showToast({ title: 'Please enter phone number', icon: 'none' })
        return
      }
      try {
        const res = await getReservationsByPhone(this.queryPhone)
        this.myReservations = res
        this.queried = true
      } catch (e) {
        uni.showToast({ title: 'Query failed', icon: 'none' })
      }
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
.verify-header {
  text-align: center;
  padding: 40rpx 0;
}

.verify-icon {
  font-size: 100rpx;
}

.verify-title {
  display: block;
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  margin-top: 20rpx;
}

.verify-desc {
  display: block;
  font-size: 26rpx;
  color: #666;
  margin-top: 10rpx;
}

.form-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eee;
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

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eee;
  margin-bottom: 20rpx;
}

.result-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;
}

.detail-label {
  font-size: 28rpx;
  color: #666;
}

.detail-value {
  font-size: 28rpx;
  color: #333;
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

.section-title {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.query-section {
  padding: 20rpx 0;
}

.reservation-list {
  margin-top: 20rpx;
}

.reservation-item {
  padding: 20rpx;
  background: #f9f9f9;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.order-no {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.item-info {
  font-size: 24rpx;
  color: #666;
  margin-top: 8rpx;
}

.empty {
  text-align: center;
  padding: 60rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>
