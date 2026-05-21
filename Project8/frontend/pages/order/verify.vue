<template>
    <view class="container">
        <view class="verify-card">
            <view class="verify-title">输入提货码</view>
            <view class="code-input">
                <input class="input" type="number" v-model="pickupCode" placeholder="请输入6位提货码" maxlength="6" />
            </view>
            <button class="verify-btn" @click="handleVerify" :disabled="pickupCode.length !== 6">
                <text>确认核销</text>
            </button>
        </view>
        
        <view class="tips">
            <view class="tip-title">核销说明</view>
            <view class="tip-item">• 请顾客出示提货码进行核销</view>
            <view class="tip-item">• 核销后订单状态变为已完成</view>
            <view class="tip-item">• 核销后佣金将自动计入收益</view>
        </view>
        
        <view class="recent-card" v-if="recentOrders.length > 0">
            <view class="card-title">最近核销</view>
            <view class="recent-list">
                <view class="recent-item" v-for="item in recentOrders" :key="item.id">
                    <view class="recent-info">
                        <text class="recent-no">{{ item.order_no }}</text>
                        <text class="recent-time">{{ item.verify_time }}</text>
                    </view>
                    <view class="recent-amount">
                        <text class="amount">¥{{ item.total_amount }}</text>
                        <text class="commission">+¥{{ item.commission_amount }}</text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import request from '@/utils/request.js'

export default {
    data() {
        return {
            pickupCode: '',
            recentOrders: [],
            leaderId: null
        }
    },
    onShow() {
        const leader = uni.getStorageSync('leaderInfo')
        if (leader) {
            this.leaderId = leader.id
        }
    },
    methods: {
        async handleVerify() {
            if (this.pickupCode.length !== 6) {
                uni.showToast({ title: '请输入完整的提货码', icon: 'none' })
                return
            }
            
            uni.showModal({
                title: '确认核销',
                content: `确定核销提货码 ${this.pickupCode}？`,
                success: async (res) => {
                    if (res.confirm) {
                        try {
                            await request({
                                url: '/order/verify',
                                method: 'POST',
                                data: {
                                    leader_id: this.leaderId,
                                    pickup_code: this.pickupCode
                                }
                            })
                            uni.showToast({ title: '核销成功', icon: 'success' })
                            this.pickupCode = ''
                        } catch (e) {
                            console.error(e)
                        }
                    }
                }
            })
        }
    }
}
</script>

<style scoped>
.verify-card {
    background: #fff;
    border-radius: 24rpx;
    padding: 60rpx 40rpx;
    text-align: center;
    margin-bottom: 30rpx;
}
.verify-title {
    font-size: 36rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 40rpx;
}
.code-input {
    margin-bottom: 40rpx;
}
.input {
    width: 100%;
    height: 100rpx;
    background: #f5f5f5;
    border-radius: 16rpx;
    text-align: center;
    font-size: 48rpx;
    font-weight: bold;
    letter-spacing: 20rpx;
}
.verify-btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    border: none;
    border-radius: 44rpx;
    font-size: 32rpx;
}
.verify-btn[disabled] {
    opacity: 0.5;
}
.tips {
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
}
.tip-title {
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 20rpx;
}
.tip-item {
    font-size: 24rpx;
    color: #666;
    line-height: 2;
}
.recent-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
}
.card-title {
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 20rpx;
}
.recent-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}
.recent-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
}
.recent-item:last-child {
    border-bottom: none;
}
.recent-info {
    display: flex;
    flex-direction: column;
    gap: 8rpx;
}
.recent-no {
    font-size: 26rpx;
    color: #333;
}
.recent-time {
    font-size: 22rpx;
    color: #999;
}
.recent-amount {
    text-align: right;
}
.recent-amount .amount {
    display: block;
    font-size: 28rpx;
    color: #333;
}
.recent-amount .commission {
    font-size: 22rpx;
    color: #52c41a;
}
</style>
