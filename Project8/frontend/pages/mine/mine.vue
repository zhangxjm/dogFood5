<template>
    <view class="container">
        <view class="header">
            <view class="avatar">
                <text>{{ leaderInfo.name ? leaderInfo.name.charAt(0) : '团' }}</text>
            </view>
            <view class="info">
                <text class="name">{{ leaderInfo.name || '团长' }}</text>
                <text class="phone">{{ leaderInfo.phone || '' }}</text>
            </view>
        </view>
        
        <view class="wallet-card" @click="goEarnings">
            <view class="wallet-item">
                <text class="wallet-label">累计收益</text>
                <text class="wallet-value">¥{{ wallet.total_earnings || '0.00' }}</text>
            </view>
            <view class="wallet-item">
                <text class="wallet-label">可提现</text>
                <text class="wallet-value">¥{{ wallet.available_balance || '0.00' }}</text>
            </view>
            <view class="wallet-item">
                <text class="wallet-label">冻结中</text>
                <text class="wallet-value">¥{{ wallet.frozen_balance || '0.00' }}</text>
            </view>
        </view>
        
        <view class="menu-list">
            <view class="menu-item" @click="goPage('/pages/product/list')">
                <view class="menu-icon product">
                    <text>📦</text>
                </view>
                <text class="menu-text">商品管理</text>
                <text class="arrow">›</text>
            </view>
            <view class="menu-item" @click="goPage('/pages/order/list')">
                <view class="menu-icon order">
                    <text>📋</text>
                </view>
                <text class="menu-text">订单管理</text>
                <text class="arrow">›</text>
            </view>
            <view class="menu-item" @click="goPage('/pages/order/verify')">
                <view class="menu-icon verify">
                    <text>✓</text>
                </view>
                <text class="menu-text">订单核销</text>
                <text class="arrow">›</text>
            </view>
            <view class="menu-item" @click="goPage('/pages/pickup/list')">
                <view class="menu-icon pickup">
                    <text>📍</text>
                </view>
                <text class="menu-text">自提点管理</text>
                <text class="arrow">›</text>
            </view>
            <view class="menu-item" @click="goPage('/pages/earnings/index')">
                <view class="menu-icon earnings">
                    <text>💰</text>
                </view>
                <text class="menu-text">收益统计</text>
                <text class="arrow">›</text>
            </view>
            <view class="menu-item" @click="goPage('/pages/withdrawal/list')">
                <view class="menu-icon withdrawal">
                    <text>💳</text>
                </view>
                <text class="menu-text">提现记录</text>
                <text class="arrow">›</text>
            </view>
        </view>
        
        <view class="logout-btn" @click="handleLogout">
            <text>退出登录</text>
        </view>
    </view>
</template>

<script>
import request from '@/utils/request.js'

export default {
    data() {
        return {
            leaderInfo: {},
            wallet: {}
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
                this.loadWallet(leader.id)
            } else {
                uni.redirectTo({ url: '/pages/login/login' })
            }
        },
        async loadWallet(leaderId) {
            try {
                const res = await request({ url: `/earnings/statistics/${leaderId}` })
                this.wallet = res.data
            } catch (e) {
                console.error(e)
            }
        },
        goPage(url) {
            uni.navigateTo({ url })
        },
        goEarnings() {
            uni.navigateTo({ url: '/pages/earnings/index' })
        },
        handleLogout() {
            uni.showModal({
                title: '确认退出',
                content: '确定要退出登录吗？',
                success: (res) => {
                    if (res.confirm) {
                        uni.removeStorageSync('leaderInfo')
                        uni.reLaunch({ url: '/pages/login/login' })
                    }
                }
            })
        }
    }
}
</script>

<style scoped>
.header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 60rpx 40rpx 80rpx;
    display: flex;
    align-items: center;
    gap: 24rpx;
    margin: -20rpx -20rpx 20rpx;
}
.avatar {
    width: 120rpx;
    height: 120rpx;
    background: rgba(255,255,255,0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.avatar text {
    color: #fff;
    font-size: 48rpx;
    font-weight: bold;
}
.info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12rpx;
}
.name {
    font-size: 36rpx;
    font-weight: 500;
    color: #fff;
}
.phone {
    font-size: 26rpx;
    color: rgba(255,255,255,0.8);
}
.wallet-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    display: flex;
    margin-bottom: 20rpx;
}
.wallet-item {
    flex: 1;
    text-align: center;
}
.wallet-label {
    display: block;
    font-size: 24rpx;
    color: #999;
    margin-bottom: 8rpx;
}
.wallet-value {
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
}
.menu-list {
    background: #fff;
    border-radius: 16rpx;
    overflow: hidden;
    margin-bottom: 30rpx;
}
.menu-item {
    display: flex;
    align-items: center;
    padding: 30rpx 24rpx;
    border-bottom: 1rpx solid #f5f5f5;
}
.menu-item:last-child {
    border-bottom: none;
}
.menu-icon {
    width: 60rpx;
    height: 60rpx;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20rpx;
    font-size: 28rpx;
}
.menu-icon.product { background: #e6f7ff; }
.menu-icon.order { background: #fff7e6; }
.menu-icon.verify { background: #f6ffed; }
.menu-icon.pickup { background: #f9f0ff; }
.menu-icon.earnings { background: #fff1f0; }
.menu-icon.withdrawal { background: #e6fffb; }
.menu-text {
    flex: 1;
    font-size: 28rpx;
    color: #333;
}
.arrow {
    font-size: 32rpx;
    color: #ccc;
}
.logout-btn {
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    text-align: center;
}
.logout-btn text {
    font-size: 28rpx;
    color: #ff4d4f;
}
</style>
