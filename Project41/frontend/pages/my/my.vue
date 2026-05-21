<template>
    <view class="container">
        <view class="header">
            <view class="avatar">👤</view>
            <view class="user-info">
                <input 
                    type="tel" 
                    v-model="phone" 
                    placeholder="请输入手机号查询预约" 
                    class="phone-input"
                    maxlength="11"
                    @confirm="searchReservations"
                />
            </view>
            <button class="search-btn" @click="searchReservations">查询</button>
        </view>

        <view class="stats">
            <view class="stat-item">
                <text class="stat-num">{{ stats.total }}</text>
                <text class="stat-label">总预约</text>
            </view>
            <view class="stat-item">
                <text class="stat-num">{{ stats.pending }}</text>
                <text class="stat-label">待核销</text>
            </view>
            <view class="stat-item">
                <text class="stat-num">{{ stats.checked }}</text>
                <text class="stat-label">已核销</text>
            </view>
        </view>

        <view class="reservation-list">
            <view v-for="item in reservationList" :key="item.id" class="reservation-card">
                <view class="card-header">
                    <text class="reservation-no">{{ item.reservationNo }}</text>
                    <text class="reservation-status" :class="getStatusClass(item.status)">
                        {{ getStatusText(item.status) }}
                    </text>
                </view>
                <view class="card-body">
                    <view class="info-row">
                        <text class="label">游客姓名</text>
                        <text class="value">{{ item.visitorName }}</text>
                    </view>
                    <view class="info-row">
                        <text class="label">联系电话</text>
                        <text class="value">{{ item.visitorPhone }}</text>
                    </view>
                    <view class="info-row">
                        <text class="label">预约人数</text>
                        <text class="value">{{ item.peopleCount }}人</text>
                    </view>
                    <view class="info-row" v-if="item.checkinTime">
                        <text class="label">核销时间</text>
                        <text class="value">{{ formatTime(item.checkinTime) }}</text>
                    </view>
                </view>
            </view>
            <view v-if="reservationList.length === 0 && hasSearched" class="empty-tip">
                <text>暂无预约记录</text>
            </view>
        </view>
    </view>
</template>

<script>
import { request } from '@/utils/request.js'

export default {
    data() {
        return {
            phone: '',
            hasSearched: false,
            reservationList: [],
            stats: {
                total: 0,
                pending: 0,
                checked: 0
            }
        }
    },
    methods: {
        searchReservations() {
            if (!this.phone || this.phone.length !== 11) {
                uni.showToast({
                    title: '请输入正确的手机号',
                    icon: 'none'
                })
                return
            }

            request({
                url: `/reservation/list/${this.phone}`
            }).then(res => {
                this.hasSearched = true
                this.reservationList = res
                this.calculateStats()
            })
        },
        calculateStats() {
            this.stats.total = this.reservationList.length
            this.stats.pending = this.reservationList.filter(r => r.status === 0).length
            this.stats.checked = this.reservationList.filter(r => r.status === 1).length
        },
        getStatusText(status) {
            const map = {
                0: '待核销',
                1: '已核销',
                2: '已取消'
            }
            return map[status] || '未知'
        },
        getStatusClass(status) {
            const map = {
                0: 'status-pending',
                1: 'status-checked',
                2: 'status-canceled'
            }
            return map[status] || ''
        },
        formatTime(time) {
            if (!time) return ''
            return time.replace('T', ' ').substring(0, 16)
        }
    }
}
</script>

<style scoped>
.header {
    background: white;
    border-radius: 16rpx;
    padding: 30rpx;
    display: flex;
    align-items: center;
    gap: 20rpx;
    margin-bottom: 20rpx;
}

.avatar {
    font-size: 60rpx;
}

.user-info {
    flex: 1;
}

.phone-input {
    width: 100%;
    padding: 20rpx;
    background: #f5f5f5;
    border-radius: 12rpx;
    font-size: 28rpx;
}

.search-btn {
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 12rpx;
    padding: 20rpx 30rpx;
    font-size: 26rpx;
}

.stats {
    display: flex;
    background: white;
    border-radius: 16rpx;
    padding: 30rpx 0;
    margin-bottom: 20rpx;
}

.stat-item {
    flex: 1;
    text-align: center;
    border-right: 1rpx solid #f0f0f0;
}

.stat-item:last-child {
    border-right: none;
}

.stat-num {
    display: block;
    font-size: 40rpx;
    font-weight: bold;
    color: #4CAF50;
    margin-bottom: 8rpx;
}

.stat-label {
    font-size: 24rpx;
    color: #999;
}

.reservation-card {
    background: white;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    overflow: hidden;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx 30rpx;
    background: #f9f9f9;
}

.reservation-no {
    font-size: 26rpx;
    color: #666;
    font-family: monospace;
}

.reservation-status {
    font-size: 24rpx;
    padding: 6rpx 16rpx;
    border-radius: 20rpx;
}

.status-pending {
    background: #fff3e0;
    color: #ff9800;
}

.status-checked {
    background: #e8f5e9;
    color: #4CAF50;
}

.status-canceled {
    background: #ffebee;
    color: #f44336;
}

.card-body {
    padding: 24rpx 30rpx;
}

.info-row {
    display: flex;
    justify-content: space-between;
    padding: 12rpx 0;
}

.info-row .label {
    font-size: 26rpx;
    color: #999;
}

.info-row .value {
    font-size: 26rpx;
    color: #333;
}

.empty-tip {
    padding: 120rpx 40rpx;
    text-align: center;
    color: #999;
    font-size: 28rpx;
}
</style>
