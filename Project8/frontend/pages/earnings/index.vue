<template>
    <view class="container">
        <view class="stats-card">
            <view class="stats-main">
                <text class="stats-label">累计收益(元)</text>
                <text class="stats-value">¥{{ stats.total_earnings || '0.00' }}</text>
            </view>
            <view class="stats-grid">
                <view class="stats-item">
                    <text class="item-value">¥{{ stats.today_earnings || '0.00' }}</text>
                    <text class="item-label">今日收益</text>
                </view>
                <view class="stats-item">
                    <text class="item-value">¥{{ stats.month_earnings || '0.00' }}</text>
                    <text class="item-label">本月收益</text>
                </view>
                <view class="stats-item">
                    <text class="item-value">¥{{ stats.available_balance || '0.00' }}</text>
                    <text class="item-label">可提现</text>
                </view>
            </view>
        </view>
        
        <view class="action-bar">
            <button class="withdraw-btn" @click="goWithdraw">申请提现</button>
        </view>
        
        <view class="list-card">
            <view class="card-header">
                <text class="card-title">收益明细</text>
            </view>
            <view class="earnings-list">
                <view class="earnings-item" v-for="item in list" :key="item.id">
                    <view class="item-info">
                        <text class="item-title">销售佣金</text>
                        <text class="item-order">订单: {{ item.order_no }}</text>
                        <text class="item-time">{{ item.created_at }}</text>
                    </view>
                    <view class="item-amount">
                        <text class="amount">+{{ item.amount }}</text>
                        <text class="status" :class="{ settled: item.status === 1 }">
                            {{ item.status === 1 ? '已结算' : '待结算' }}
                        </text>
                    </view>
                </view>
            </view>
            
            <view class="empty-tip" v-if="list.length === 0 && !loading">
                <text>暂无收益记录</text>
            </view>
            
            <view class="load-more" v-if="hasMore" @click="loadMore">
                <text>{{ loading ? '加载中...' : '加载更多' }}</text>
            </view>
        </view>
    </view>
</template>

<script>
import request from '@/utils/request.js'

export default {
    data() {
        return {
            stats: {},
            list: [],
            page: 1,
            pageSize: 10,
            hasMore: true,
            loading: false,
            leaderId: null
        }
    },
    onShow() {
        const leader = uni.getStorageSync('leaderInfo')
        if (leader) {
            this.leaderId = leader.id
            this.refresh()
        }
    },
    methods: {
        async refresh() {
            this.page = 1
            this.hasMore = true
            this.list = []
            await Promise.all([this.loadStats(), this.loadList()])
        },
        async loadStats() {
            try {
                const res = await request({ url: `/earnings/statistics/${this.leaderId}` })
                this.stats = res.data
            } catch (e) {
                console.error(e)
            }
        },
        async loadList() {
            if (this.loading) return
            this.loading = true
            
            try {
                const res = await request({ 
                    url: `/earnings/list/${this.leaderId}?page=${this.page}&page_size=${this.pageSize}` 
                })
                const data = res.data
                if (this.page === 1) {
                    this.list = data.list
                } else {
                    this.list = this.list.concat(data.list)
                }
                this.hasMore = data.list.length >= this.pageSize
            } catch (e) {
                console.error(e)
            } finally {
                this.loading = false
            }
        },
        loadMore() {
            this.page++
            this.loadList()
        },
        goWithdraw() {
            uni.navigateTo({ url: '/pages/withdrawal/apply' })
        }
    }
}
</script>

<style scoped>
.stats-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 24rpx;
    padding: 40rpx;
    margin-bottom: 20rpx;
}
.stats-main {
    text-align: center;
    padding-bottom: 40rpx;
    border-bottom: 1rpx solid rgba(255,255,255,0.2);
}
.stats-label {
    display: block;
    font-size: 26rpx;
    color: rgba(255,255,255,0.8);
    margin-bottom: 12rpx;
}
.stats-value {
    font-size: 56rpx;
    font-weight: bold;
    color: #fff;
}
.stats-grid {
    display: flex;
    padding-top: 30rpx;
}
.stats-item {
    flex: 1;
    text-align: center;
}
.item-value {
    display: block;
    font-size: 32rpx;
    font-weight: 500;
    color: #fff;
    margin-bottom: 8rpx;
}
.item-label {
    font-size: 22rpx;
    color: rgba(255,255,255,0.7);
}
.action-bar {
    padding: 10rpx 0 20rpx;
}
.withdraw-btn {
    width: 100%;
    height: 80rpx;
    background: #fff;
    color: #667eea;
    border: none;
    border-radius: 40rpx;
    font-size: 28rpx;
    font-weight: 500;
}
.list-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
}
.card-header {
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #f0f0f0;
}
.card-title {
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
}
.earnings-list {
    display: flex;
    flex-direction: column;
}
.earnings-item {
    display: flex;
    justify-content: space-between;
    padding: 24rpx 0;
    border-bottom: 1rpx solid #f5f5f5;
}
.earnings-item:last-child {
    border-bottom: none;
}
.item-info {
    display: flex;
    flex-direction: column;
    gap: 8rpx;
}
.item-title {
    font-size: 28rpx;
    color: #333;
}
.item-order {
    font-size: 22rpx;
    color: #999;
}
.item-time {
    font-size: 22rpx;
    color: #999;
}
.item-amount {
    text-align: right;
}
.amount {
    display: block;
    font-size: 30rpx;
    font-weight: 500;
    color: #52c41a;
    margin-bottom: 8rpx;
}
.status {
    font-size: 22rpx;
    color: #999;
}
.status.settled {
    color: #52c41a;
}
.empty-tip {
    text-align: center;
    padding: 60rpx 0;
    color: #999;
    font-size: 28rpx;
}
.load-more {
    text-align: center;
    padding: 30rpx 0 0;
    color: #667eea;
    font-size: 26rpx;
}
</style>
