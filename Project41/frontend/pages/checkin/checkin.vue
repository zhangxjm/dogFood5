<template>
    <view class="container">
        <view class="scan-section">
            <view class="scan-icon">🎫</view>
            <text class="scan-title">输入预约单号核销</text>
            <text class="scan-desc">请输入预约时生成的预约单号</text>
        </view>

        <view class="card">
            <view class="input-group">
                <input 
                    type="text" 
                    v-model="reservationNo" 
                    placeholder="请输入预约单号" 
                    class="reservation-input"
                    maxlength="20"
                />
            </view>

            <button class="checkin-btn" @click="doCheckin" :disabled="!reservationNo">
                确认核销
            </button>
        </view>

        <view v-if="checkinResult" class="checkin-success">
            <view class="success-icon">✓</view>
            <text class="success-title">核销成功</text>
            <view class="success-info">
                <text>游客姓名：{{ checkinResult.visitorName }}</text>
                <text>联系电话：{{ checkinResult.visitorPhone }}</text>
                <text>预约人数：{{ checkinResult.peopleCount }}人</text>
                <text>核销时间：{{ formatTime(checkinResult.checkinTime) }}</text>
            </view>
        </view>
    </view>
</template>

<script>
import { request } from '@/utils/request.js'

export default {
    data() {
        return {
            reservationNo: '',
            checkinResult: null
        }
    },
    methods: {
        doCheckin() {
            if (!this.reservationNo) {
                uni.showToast({
                    title: '请输入预约单号',
                    icon: 'none'
                })
                return
            }

            request({
                url: `/reservation/checkin/${this.reservationNo}`,
                method: 'POST'
            }).then(res => {
                this.checkinResult = res
                uni.showToast({
                    title: '核销成功',
                    icon: 'success'
                })
            })
        },
        formatTime(time) {
            if (!time) return ''
            return time.replace('T', ' ').substring(0, 16)
        }
    }
}
</script>

<style scoped>
.scan-section {
    text-align: center;
    padding: 60rpx 40rpx;
}

.scan-icon {
    font-size: 120rpx;
    margin-bottom: 20rpx;
}

.scan-title {
    display: block;
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 12rpx;
}

.scan-desc {
    font-size: 26rpx;
    color: #999;
}

.input-group {
    margin-bottom: 30rpx;
}

.reservation-input {
    width: 100%;
    padding: 24rpx;
    background: #f9f9f9;
    border-radius: 12rpx;
    font-size: 28rpx;
    text-align: center;
}

.checkin-btn {
    width: 100%;
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: white;
    border: none;
    border-radius: 50rpx;
    padding: 28rpx;
    font-size: 32rpx;
}

.checkin-btn[disabled] {
    opacity: 0.5;
}

.checkin-success {
    background: white;
    border-radius: 16rpx;
    padding: 40rpx;
    text-align: center;
    margin-top: 30rpx;
}

.success-icon {
    width: 100rpx;
    height: 100rpx;
    margin: 0 auto 20rpx;
    background: #4CAF50;
    color: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 50rpx;
    font-weight: bold;
}

.success-title {
    display: block;
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 30rpx;
}

.success-info {
    background: #f9f9f9;
    border-radius: 12rpx;
    padding: 24rpx;
    text-align: left;
}

.success-info text {
    display: block;
    font-size: 26rpx;
    color: #666;
    line-height: 2;
}
</style>
