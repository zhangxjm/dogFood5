<template>
    <view class="container">
        <view class="card">
            <view class="card-title">预约核销</view>
            <view class="form-item">
                <text class="label">预约ID</text>
                <input class="input" v-model="reservationId" placeholder="请输入预约ID" type="number" />
            </view>
            <view class="btn btn-orange mt-20" @click="verify">
                确认核销
            </view>
        </view>
        
        <view class="card mt-20">
            <view class="card-title">今日待核销</view>
            <view v-for="res in todayReservations" :key="res.id" class="reservation-item">
                <view class="flex-between">
                    <view>
                        <text class="name">{{ res.child?.name }}</text>
                        <text class="time">{{ res.session?.start_time }}</text>
                    </view>
                    <view class="id-text">#{{ res.id }}</view>
                </view>
            </view>
            <view v-if="todayReservations.length === 0" class="empty-small">
                <text>暂无待核销预约</text>
            </view>
        </view>
    </view>
</template>

<script>
import { verifyReservation, getReservations } from '@/utils/api.js'

export default {
    data() {
        return {
            reservationId: '',
            todayReservations: []
        }
    },
    onShow() {
        this.loadTodayReservations()
    },
    methods: {
        loadTodayReservations() {
            const today = new Date().toISOString().split('T')[0]
            getReservations().then(res => {
                this.todayReservations = res.filter(r => 
                    r.status === 'reserved' && r.session?.date === today
                )
            })
        },
        verify() {
            if (!this.reservationId) {
                uni.showToast({ title: '请输入预约ID', icon: 'none' })
                return
            }
            
            verifyReservation(parseInt(this.reservationId)).then(res => {
                uni.showToast({
                    title: '核销成功',
                    icon: 'success'
                })
                this.reservationId = ''
                this.loadTodayReservations()
            })
        }
    }
}
</script>

<style scoped>
.form-item {
    margin-bottom: 30rpx;
}

.label {
    display: block;
    font-size: 28rpx;
    color: #333;
    margin-bottom: 16rpx;
}

.input {
    width: 100%;
    padding: 24rpx;
    background: #f5f5f5;
    border-radius: 12rpx;
    font-size: 28rpx;
    box-sizing: border-box;
}

.reservation-item {
    padding: 20rpx 0;
    border-bottom: 1px solid #f0f0f0;
}

.reservation-item:last-child {
    border-bottom: none;
}

.name {
    display: block;
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
}

.time {
    font-size: 24rpx;
    color: #999;
}

.id-text {
    font-size: 24rpx;
    color: #667eea;
}

.empty-small {
    text-align: center;
    padding: 40rpx;
    color: #999;
    font-size: 26rpx;
}
</style>
