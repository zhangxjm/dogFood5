<template>
    <view class="container" v-if="order">
        <view class="status-card">
            <view class="status-icon">
                <text>{{ order.status === 1 ? '⏳' : '✅' }}</text>
            </view>
            <view class="status-info">
                <text class="status-text">{{ getStatusText(order.status) }}</text>
                <text class="status-desc" v-if="order.status === 1">请向顾客确认商品后核销</text>
            </view>
        </view>
        
        <view class="info-card">
            <view class="card-title">订单信息</view>
            <view class="info-row">
                <text class="label">订单号</text>
                <text class="value">{{ order.order_no }}</text>
            </view>
            <view class="info-row">
                <text class="label">下单时间</text>
                <text class="value">{{ order.created_at }}</text>
            </view>
            <view class="info-row">
                <text class="label">支付时间</text>
                <text class="value">{{ order.payment_time || '-' }}</text>
            </view>
            <view class="info-row" v-if="order.verify_time">
                <text class="label">核销时间</text>
                <text class="value">{{ order.verify_time }}</text>
            </view>
            <view class="info-row" v-if="order.pickup_code">
                <text class="label">提货码</text>
                <text class="value code">{{ order.pickup_code }}</text>
            </view>
        </view>
        
        <view class="info-card">
            <view class="card-title">顾客信息</view>
            <view class="info-row">
                <text class="label">姓名</text>
                <text class="value">{{ order.user_name }}</text>
            </view>
            <view class="info-row">
                <text class="label">手机号</text>
                <text class="value">{{ order.user_phone }}</text>
            </view>
        </view>
        
        <view class="info-card">
            <view class="card-title">商品清单</view>
            <view class="goods-list">
                <view class="goods-item" v-for="item in order.items" :key="item.id">
                    <view class="goods-image">
                        <text>📦</text>
                    </view>
                    <view class="goods-info">
                        <text class="goods-name">{{ item.product_name }}</text>
                        <text class="goods-spec">¥{{ item.price }} × {{ item.quantity }}</text>
                    </view>
                    <view class="goods-amount">
                        <text>¥{{ item.total_price }}</text>
                    </view>
                </view>
            </view>
        </view>
        
        <view class="info-card">
            <view class="card-title">金额明细</view>
            <view class="amount-row">
                <text class="label">订单金额</text>
                <text class="value">¥{{ order.total_amount }}</text>
            </view>
            <view class="amount-row commission">
                <text class="label">佣金收益</text>
                <text class="value">+¥{{ order.commission_amount }}</text>
            </view>
        </view>
        
        <view class="footer-btn" v-if="order.status === 1">
            <button class="verify-btn" @click="handleVerify">确认核销</button>
        </view>
    </view>
</template>

<script>
import request from '@/utils/request.js'

export default {
    data() {
        return {
            orderId: null,
            order: null,
            leaderId: null
        }
    },
    onLoad(options) {
        if (options.id) {
            this.orderId = options.id
            this.loadDetail()
        }
        const leader = uni.getStorageSync('leaderInfo')
        if (leader) {
            this.leaderId = leader.id
        }
    },
    methods: {
        getStatusText(status) {
            const texts = { 0: '待付款', 1: '待核销', 2: '已核销', 3: '已完成', 4: '已取消' }
            return texts[status] || '未知'
        },
        async loadDetail() {
            try {
                const res = await request({ url: `/order/detail/${this.orderId}` })
                this.order = res.data
            } catch (e) {
                console.error(e)
            }
        },
        async handleVerify() {
            uni.showModal({
                title: '确认核销',
                content: '确定核销该订单吗？',
                success: async (res) => {
                    if (res.confirm) {
                        try {
                            await request({
                                url: '/order/verify',
                                method: 'POST',
                                data: {
                                    leader_id: this.leaderId,
                                    order_id: this.orderId
                                }
                            })
                            uni.showToast({ title: '核销成功', icon: 'success' })
                            setTimeout(() => {
                                uni.navigateBack()
                            }, 1000)
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
.status-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 24rpx;
    padding: 40rpx;
    display: flex;
    align-items: center;
    gap: 24rpx;
    margin-bottom: 20rpx;
}
.status-icon {
    width: 100rpx;
    height: 100rpx;
    background: rgba(255,255,255,0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48rpx;
}
.status-info {
    flex: 1;
}
.status-text {
    display: block;
    font-size: 36rpx;
    font-weight: 500;
    color: #fff;
    margin-bottom: 8rpx;
}
.status-desc {
    font-size: 24rpx;
    color: rgba(255,255,255,0.8);
}
.info-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
}
.card-title {
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 24rpx;
}
.info-row {
    display: flex;
    justify-content: space-between;
    padding: 16rpx 0;
}
.info-row .label {
    font-size: 26rpx;
    color: #999;
}
.info-row .value {
    font-size: 26rpx;
    color: #333;
}
.info-row .value.code {
    color: #667eea;
    font-weight: bold;
    letter-spacing: 4rpx;
}
.goods-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}
.goods-item {
    display: flex;
    align-items: center;
    gap: 16rpx;
    padding: 16rpx 0;
    border-bottom: 1rpx solid #f5f5f5;
}
.goods-item:last-child {
    border-bottom: none;
}
.goods-image {
    width: 80rpx;
    height: 80rpx;
    background: #f5f5f5;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36rpx;
}
.goods-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8rpx;
}
.goods-name {
    font-size: 26rpx;
    color: #333;
}
.goods-spec {
    font-size: 22rpx;
    color: #999;
}
.goods-amount {
    font-size: 26rpx;
    color: #ff4d4f;
    font-weight: 500;
}
.amount-row {
    display: flex;
    justify-content: space-between;
    padding: 16rpx 0;
}
.amount-row .label {
    font-size: 26rpx;
    color: #666;
}
.amount-row .value {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
}
.amount-row.commission .value {
    color: #52c41a;
}
.footer-btn {
    padding: 30rpx 0;
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
</style>
