<template>
    <view class="container">
        <view class="withdrawal-list">
            <view class="withdrawal-item" v-for="item in list" :key="item.id">
                <view class="item-header">
                    <text class="no">{{ item.withdrawal_no }}</text>
                    <text class="status" :class="getStatusClass(item.status)">{{ getStatusText(item.status) }}</text>
                </view>
                <view class="item-body">
                    <view class="amount-row">
                        <text class="label">提现金额</text>
                        <text class="value">¥{{ item.amount }}</text>
                    </view>
                    <view class="amount-row">
                        <text class="label">实际到账</text>
                        <text class="value success">¥{{ item.actual_amount }}</text>
                    </view>
                    <view class="info-row">
                        <text class="label">收款方式</text>
                        <text class="value">{{ getAccountType(item.account_type) }}</text>
                    </view>
                    <view class="info-row">
                        <text class="label">收款账号</text>
                        <text class="value">{{ item.account_no }}</text>
                    </view>
                </view>
                <view class="item-footer">
                    <text class="time">{{ item.created_at }}</text>
                    <text class="remark" v-if="item.audit_remark">{{ item.audit_remark }}</text>
                </view>
            </view>
        </view>
        
        <view class="empty-tip" v-if="list.length === 0 && !loading">
            <text>暂无提现记录</text>
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
            const texts = { 0: '审核中', 1: '审核通过', 2: '审核拒绝', 3: '已打款' }
            return texts[status] || '未知'
        },
        getStatusClass(status) {
            if (status === 0) return 'status-pending'
            if (status === 1 || status === 3) return 'status-success'
            return 'status-fail'
        },
        getAccountType(type) {
            const types = { 1: '微信', 2: '支付宝', 3: '银行卡' }
            return types[type] || '未知'
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
                const res = await request({ 
                    url: `/withdrawal/list/${this.leaderId}?page=${this.page}&page_size=${this.pageSize}` 
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
        }
    }
}
</script>

<style scoped>
.withdrawal-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}
.withdrawal-item {
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
}
.item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16rpx;
    border-bottom: 1rpx solid #f0f0f0;
}
.no {
    font-size: 24rpx;
    color: #999;
}
.status {
    padding: 4rpx 16rpx;
    border-radius: 20rpx;
    font-size: 22rpx;
}
.status-pending {
    background: #fff7e6;
    color: #fa8c16;
}
.status-success {
    background: #f6ffed;
    color: #52c41a;
}
.status-fail {
    background: #fff1f0;
    color: #ff4d4f;
}
.item-body {
    padding: 16rpx 0;
}
.amount-row, .info-row {
    display: flex;
    justify-content: space-between;
    padding: 12rpx 0;
}
.amount-row .label, .info-row .label {
    font-size: 26rpx;
    color: #999;
}
.amount-row .value, .info-row .value {
    font-size: 26rpx;
    color: #333;
}
.amount-row .value.success {
    color: #52c41a;
    font-weight: 500;
}
.item-footer {
    padding-top: 16rpx;
    border-top: 1rpx solid #f0f0f0;
}
.time {
    display: block;
    font-size: 22rpx;
    color: #999;
}
.remark {
    display: block;
    font-size: 22rpx;
    color: #ff4d4f;
    margin-top: 8rpx;
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
