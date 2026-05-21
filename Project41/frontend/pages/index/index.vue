<template>
    <view class="container">
        <view class="banner">
            <image src="https://images.unsplash.com/photo-1568702846914-96b305d2a88a?w=800" mode="aspectFill" class="banner-img"></image>
            <view class="banner-text">
                <text class="banner-title">生鲜果蔬采摘园</text>
                <text class="banner-subtitle">亲近自然，体验采摘乐趣</text>
            </view>
        </view>

        <view class="quick-actions">
            <view class="action-item" @click="goReservation">
                <view class="action-icon">📅</view>
                <text class="action-text">立即预约</text>
            </view>
            <view class="action-item" @click="goCategory">
                <view class="action-icon">🍓</view>
                <text class="action-text">采摘品类</text>
            </view>
            <view class="action-item" @click="goCheckin">
                <view class="action-icon">🎫</view>
                <text class="action-text">入园核销</text>
            </view>
        </view>

        <view class="section">
            <view class="section-title">今日可预约时段</view>
            <view class="time-slots">
                <view 
                    v-for="slot in timeSlots" 
                    :key="slot.id" 
                    class="slot-item"
                    :class="{ 'slot-full': slot.reservedPeople >= slot.maxPeople }"
                    @click="selectSlot(slot)"
                >
                    <view class="slot-time">
                        <text class="start-time">{{ slot.startTime }}</text>
                        <text class="time-sep">-</text>
                        <text class="end-time">{{ slot.endTime }}</text>
                    </view>
                    <view class="slot-info">
                        <text class="people-count">已约 {{ slot.reservedPeople }}/{{ slot.maxPeople }}人</text>
                        <text v-if="slot.reservedPeople >= slot.maxPeople" class="slot-status">已满</text>
                    </view>
                </view>
                <view v-if="timeSlots.length === 0" class="empty-tip">
                    <text>暂无可预约时段</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { request } from '@/utils/request.js'

export default {
    data() {
        return {
            timeSlots: []
        }
    },
    onLoad() {
        this.loadTimeSlots()
    },
    onShow() {
        this.loadTimeSlots()
    },
    methods: {
        loadTimeSlots() {
            request({
                url: '/time-slot/list'
            }).then(res => {
                this.timeSlots = res
            })
        },
        goReservation() {
            uni.navigateTo({
                url: '/pages/reservation/reservation'
            })
        },
        goCategory() {
            uni.switchTab({
                url: '/pages/category/category'
            })
        },
        goCheckin() {
            uni.switchTab({
                url: '/pages/checkin/checkin'
            })
        },
        selectSlot(slot) {
            if (slot.reservedPeople < slot.maxPeople) {
                uni.navigateTo({
                    url: `/pages/reservation/reservation?slotId=${slot.id}`
                })
            }
        }
    }
}
</script>

<style scoped>
.banner {
    position: relative;
    border-radius: 20rpx;
    overflow: hidden;
    margin-bottom: 30rpx;
}

.banner-img {
    width: 100%;
    height: 360rpx;
}

.banner-text {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 40rpx;
    background: linear-gradient(transparent, rgba(0,0,0,0.6));
    color: white;
}

.banner-title {
    display: block;
    font-size: 40rpx;
    font-weight: bold;
    margin-bottom: 10rpx;
}

.banner-subtitle {
    display: block;
    font-size: 26rpx;
    opacity: 0.9;
}

.quick-actions {
    display: flex;
    background: white;
    border-radius: 16rpx;
    padding: 30rpx 0;
    margin-bottom: 30rpx;
}

.action-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.action-icon {
    font-size: 60rpx;
    margin-bottom: 10rpx;
}

.action-text {
    font-size: 26rpx;
    color: #333;
}

.section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
}

.time-slots {
    background: white;
    border-radius: 16rpx;
    overflow: hidden;
}

.slot-item {
    padding: 30rpx;
    border-bottom: 1rpx solid #f0f0f0;
}

.slot-item:last-child {
    border-bottom: none;
}

.slot-full {
    opacity: 0.5;
}

.slot-time {
    display: flex;
    align-items: center;
    margin-bottom: 10rpx;
}

.start-time, .end-time {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
}

.time-sep {
    margin: 0 10rpx;
    color: #999;
}

.slot-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.people-count {
    font-size: 26rpx;
    color: #666;
}

.slot-status {
    font-size: 24rpx;
    color: #ff4444;
    padding: 4rpx 16rpx;
    background: #ffebee;
    border-radius: 20rpx;
}

.empty-tip {
    padding: 60rpx;
    text-align: center;
    color: #999;
}
</style>
