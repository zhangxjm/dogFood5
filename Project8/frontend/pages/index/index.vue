<template>
    <view class="container">
        <view class="header">
            <view class="user-info">
                <view class="avatar">
                    <text>{{ leaderInfo.name ? leaderInfo.name.charAt(0) : '团' }}</text>
                </view>
                <view class="info">
                    <text class="name">{{ leaderInfo.name || '团长' }}</text>
                    <text class="phone">{{ leaderInfo.phone || '' }}</text>
                </view>
            </view>
        </view>
        
        <view class="stats-section">
            <view class="stats-card">
                <view class="stats-item" @click="goPage('/pages/earnings/index')">
                    <text class="stats-value">¥{{ earnings.total_earnings || '0.00' }}</text>
                    <text class="stats-label">累计收益</text>
                </view>
                <view class="stats-item">
                    <text class="stats-value">¥{{ earnings.today_earnings || '0.00' }}</text>
                    <text class="stats-label">今日收益</text>
                </view>
                <view class="stats-item">
                    <text class="stats-value">¥{{ earnings.available_balance || '0.00' }}</text>
                    <text class="stats-label">可提现</text>
                </view>
            </view>
        </view>
        
        <view class="menu-grid">
            <view class="menu-item" @click="goPage('/pages/order/verify')">
                <view class="menu-icon verify">
                    <text>✓</text>
                </view>
                <text class="menu-label">订单核销</text>
            </view>
            <view class="menu-item" @click="goPage('/pages/product/list')">
                <view class="menu-icon product">
                    <text>📦</text>
                </view>
                <text class="menu-label">商品管理</text>
            </view>
            <view class="menu-item" @click="goPage('/pages/order/list')">
                <view class="menu-icon order">
                    <text>📋</text>
                </view>
                <text class="menu-label">订单管理</text>
            </view>
            <view class="menu-item" @click="goPage('/pages/pickup/list')">
                <view class="menu-icon pickup">
                    <text>📍</text>
                </view>
                <text class="menu-label">自提点</text>
            </view>
            <view class="menu-item" @click="goPage('/pages/earnings/index')">
                <view class="menu-icon earnings">
                    <text>💰</text>
                </view>
                <text class="menu-label">收益统计</text>
            </view>
            <view class="menu-item" @click="goPage('/pages/withdrawal/apply')">
                <view class="menu-icon withdrawal">
                    <text>💳</text>
                </view>
                <text class="menu-label">申请提现</text>
            </view>
        </view>
        
        <view class="order-stats card">
            <view class="card-title">订单统计</view>
            <view class="order-grid">
                <view class="order-item">
                    <text class="order-num">{{ orderStats.total_orders || 0 }}</text>
                    <text class="order-label">总订单</text>
                </view>
                <view class="order-item">
                    <text class="order-num">{{ orderStats.today_orders || 0 }}</text>
                    <text class="order-label">今日订单</text>
                </view>
                <view class="order-item">
                    <text class="order-num">{{ orderStats.pending_orders || 0 }}</text>
                    <text class="order-label">待核销</text>
                </view>
                <view class="order-item">
                    <text class="order-num">{{ orderStats.completed_orders || 0 }}</text>
                    <text class="order-label">已完成</text>
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
            leaderInfo: {},
            earnings: {},
            orderStats: {}
        }
    },
    onShow() {
        this.loadData()
    },
    methods: {
        async loadData() {
            const leader = uni.getStorageSync('leaderInfo')
            if (leader) {
                this.leaderInfo = leader
                this.loadEarnings(leader.id)
                this.loadOrderStats(leader.id)
            } else {
                uni.redirectTo({ url: '/pages/login/login' })
            }
        },
        async loadEarnings(leaderId) {
            try {
                const res = await request({
                    url: `/earnings/statistics/${leaderId}`
                })
                this.earnings = res.data
            } catch (e) {
                console.error(e)
            }
        },
        async loadOrderStats(leaderId) {
            try {
                const res = await request({
                    url: `/order/statistics/${leaderId}`
                })
                this.orderStats = res.data
            } catch (e) {
                console.error(e)
            }
        },
        goPage(url) {
            uni.navigateTo({ url })
        }
    }
}
</script>

<style scoped>
.header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 40rpx;
    border-radius: 0 0 40rpx 40rpx;
    margin: -20rpx -20rpx 40rpx;
}
.user-info {
    display: flex;
    align-items: center;
}
.avatar {
    width: 100rpx;
    height: 100rpx;
    background: rgba(255,255,255,0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 24rpx;
}
.avatar text {
    color: #fff;
    font-size: 44rpx;
    font-weight: bold;
}
.info {
    display: flex;
    flex-direction: column;
}
.name {
    color: #fff;
    font-size: 36rpx;
    font-weight: 500;
    margin-bottom: 8rpx;
}
.phone {
    color: rgba(255,255,255,0.8);
    font-size: 26rpx;
}
.stats-section {
    margin-bottom: 40rpx;
}
.stats-card {
    background: #fff;
    border-radius: 24rpx;
    padding: 40rpx 20rpx;
    display: flex;
    box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);
}
.stats-item {
    flex: 1;
    text-align: center;
}
.stats-value {
    display: block;
    font-size: 36rpx;
    font-weight: bold;
    color: #667eea;
    margin-bottom: 8rpx;
}
.stats-label {
    font-size: 24rpx;
    color: #999;
}
.menu-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20rpx;
    margin-bottom: 40rpx;
}
.menu-item {
    background: #fff;
    border-radius: 20rpx;
    padding: 30rpx 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);
}
.menu-icon {
    width: 80rpx;
    height: 80rpx;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16rpx;
    font-size: 36rpx;
}
.menu-icon.verify { background: #e6f7ff; }
.menu-icon.product { background: #f6ffed; }
.menu-icon.order { background: #fff7e6; }
.menu-icon.pickup { background: #f9f0ff; }
.menu-icon.earnings { background: #fff1f0; }
.menu-icon.withdrawal { background: #e6fffb; }
.menu-label {
    font-size: 26rpx;
    color: #333;
}
.card-title {
    font-size: 32rpx;
    font-weight: 500;
    margin-bottom: 30rpx;
    color: #333;
}
.order-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20rpx;
}
.order-item {
    text-align: center;
}
.order-num {
    display: block;
    font-size: 36rpx;
    font-weight: bold;
    color: #667eea;
    margin-bottom: 8rpx;
}
.order-label {
    font-size: 22rpx;
    color: #999;
}
</style>
