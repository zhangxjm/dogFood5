<template>
    <view class="container">
        <view class="tabs">
            <view class="tab-item" :class="{ active: currentTab === index }" v-for="(tab, index) in tabs" :key="index" @click="switchTab(index)">
                <text>{{ tab }}</text>
            </view>
        </view>
        
        <view class="order-list">
            <view class="order-item" v-for="item in list" :key="item.id" @click="goDetail(item.id)">
                <view class="order-header">
                    <text class="order-no">订单号: {{ item.order_no }}</text>
                    <text class="order-status" :class="getStatusClass(item.status)">{{ getStatusText(item.status) }}</text>
                </view>
                <view class="order-body">
                    <view class="user-info">
                        <text class="user-name">{{ item.user_name }}</text>
                        <text class="user-phone">{{ item.user_phone }}</text>
                    </view>
                    <view class="order-amount">
                        <text class="amount">¥{{ item.total_amount }}</text>
                        <text class="commission">佣金: ¥{{ item.commission_amount }}</text>
                    </view>
                </view>
                <view class="order-footer">
                    <text class="time">{{ item.created_at }}</text>
                    <view class="actions" v-if="item.status === 1">
                        <view class="action-btn verify" @click.stop="verifyOrder(item)">核销</view>
                    </view>
                </view>
            </view>
        </view>
        
        <view class="empty-tip" v-if="list.length === 0 && !loading">
            <text>暂无订单数据</text>
        </view>
        
        <view class="load-more" v-if="hasMore" @click="loadMore">
            <text>{{ loading ? '加载中...' : '加载更多' }}</text>
        </view>
    </view>
</template>

<script>
import request from '@/utils/request.js'

export default {
    data() {
        return {
            tabs: ['全部', '待核销', '已完成'],
            currentTab: 0,
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
        getStatusText(status) {
            const texts = { 0: '待付款', 1: '待核销', 2: '已核销', 3: '已完成', 4: '已取消' }
            return texts[status] || '未知'
        },
        getStatusClass(status) {
            if (status === 1) return 'status-pending'
            if (status === 2 || status === 3) return 'status-success'
            return 'status-default'
        },
        switchTab(index) {
            this.currentTab = index
            this.refresh()
        },
        async refresh() {
            this.page = 1
            this.hasMore = true
            this.list = []
            await this.loadList()
        },
        async loadList() {
            if (this.loading) return
            this.loading = true
            
            try {
                let status = null
                if (this.currentTab === 1) status = 1
                if (this.currentTab === 2) status = [2, 3]
                
                let url = `/order/list/${this.leaderId}?page=${this.page}&page_size=${this.pageSize}`
                if (status !== null) {
                    if (Array.isArray(status)) {
                        url += `&status=${status[0]}`
                    } else {
                        url += `&status=${status}`
                    }
                }
                
                const res = await request({ url })
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
        goDetail(id) {
            uni.navigateTo({ url: `/pages/order/detail?id=${id}` })
        },
        async verifyOrder(item) {
            uni.showModal({
                title: '确认核销',
                content: `确定核销订单 ${item.order_no}？`,
                success: async (res) => {
                    if (res.confirm) {
                        try {
                            await request({
                                url: '/order/verify',
                                method: 'POST',
                                data: {
                                    leader_id: this.leaderId,
                                    order_id: item.id
                                }
                            })
                            uni.showToast({ title: '核销成功', icon: 'success' })
                            this.refresh()
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
.tabs {
    display: flex;
    background: #fff;
    border-radius: 16rpx;
    padding: 8rpx;
    margin-bottom: 20rpx;
}
.tab-item {
    flex: 1;
    text-align: center;
    padding: 20rpx 0;
    border-radius: 12rpx;
    font-size: 28rpx;
    color: #666;
}
.tab-item.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
}
.order-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}
.order-item {
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
}
.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #f0f0f0;
}
.order-no {
    font-size: 24rpx;
    color: #999;
}
.order-status {
    font-size: 24rpx;
    padding: 4rpx 16rpx;
    border-radius: 20rpx;
}
.status-pending {
    background: #fff7e6;
    color: #fa8c16;
}
.status-success {
    background: #f6ffed;
    color: #52c41a;
}
.status-default {
    background: #f5f5f5;
    color: #999;
}
.order-body {
    padding: 20rpx 0;
}
.user-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16rpx;
}
.user-name {
    font-size: 28rpx;
    color: #333;
}
.user-phone {
    font-size: 26rpx;
    color: #666;
}
.order-amount {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.amount {
    font-size: 32rpx;
    color: #ff4d4f;
    font-weight: bold;
}
.commission {
    font-size: 24rpx;
    color: #52c41a;
}
.order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20rpx;
    border-top: 1rpx solid #f0f0f0;
}
.time {
    font-size: 24rpx;
    color: #999;
}
.actions {
    display: flex;
    gap: 16rpx;
}
.action-btn {
    padding: 12rpx 24rpx;
    border-radius: 8rpx;
    font-size: 24rpx;
}
.action-btn.verify {
    background: #52c41a;
    color: #fff;
}
.empty-tip {
    text-align: center;
    padding: 100rpx 0;
    color: #999;
    font-size: 28rpx;
}
.load-more {
    text-align: center;
    padding: 30rpx;
    color: #667eea;
    font-size: 26rpx;
}
</style>
