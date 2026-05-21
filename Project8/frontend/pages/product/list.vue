<template>
    <view class="container">
        <view class="search-bar">
            <input class="search-input" v-model="keyword" placeholder="搜索商品" />
            <picker :value="statusIndex" :range="statusOptions" @change="onStatusChange">
                <view class="picker-btn">{{ statusOptions[statusIndex] }}</view>
            </picker>
        </view>
        
        <view class="add-btn" @click="goAdd">
            <text>+ 添加商品</text>
        </view>
        
        <view class="product-list">
            <view class="product-item" v-for="item in list" :key="item.id">
                <view class="product-image">
                    <text class="placeholder-img">📦</text>
                </view>
                <view class="product-info">
                    <text class="product-name">{{ item.name }}</text>
                    <view class="product-meta">
                        <text class="price">¥{{ item.price }}</text>
                        <text class="stock">库存: {{ item.stock }}</text>
                    </view>
                    <view class="product-footer">
                        <text class="commission">佣金: {{ item.commission_rate }}%</text>
                        <switch :checked="item.status == 1" @change="toggleStatus(item)" color="#52c41a" />
                    </view>
                </view>
                <view class="product-actions">
                    <view class="action-btn edit" @click="goEdit(item.id)">编辑</view>
                </view>
            </view>
        </view>
        
        <view class="empty-tip" v-if="list.length === 0 && !loading">
            <text>暂无商品数据</text>
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
            keyword: '',
            statusIndex: 0,
            statusOptions: ['全部', '上架', '下架'],
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
            await this.loadList()
        },
        async loadList() {
            if (this.loading) return
            this.loading = true
            
            try {
                let status = null
                if (this.statusIndex === 1) status = 1
                if (this.statusIndex === 2) status = 0
                
                const res = await request({
                    url: `/product/list/${this.leaderId}?page=${this.page}&page_size=${this.pageSize}` + (status !== null ? `&status=${status}` : '')
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
        onStatusChange(e) {
            this.statusIndex = e.detail.value
            this.refresh()
        },
        async toggleStatus(item) {
            const newStatus = item.status === 1 ? 0 : 1
            try {
                await request({
                    url: `/product/status/${item.id}`,
                    method: 'PUT',
                    data: { status: newStatus }
                })
                item.status = newStatus
                uni.showToast({ title: newStatus === 1 ? '已上架' : '已下架', icon: 'success' })
            } catch (e) {
                console.error(e)
            }
        },
        goAdd() {
            uni.navigateTo({ url: '/pages/product/form' })
        },
        goEdit(id) {
            uni.navigateTo({ url: `/pages/product/form?id=${id}` })
        }
    }
}
</script>

<style scoped>
.search-bar {
    display: flex;
    gap: 20rpx;
    margin-bottom: 20rpx;
}
.search-input {
    flex: 1;
    background: #fff;
    border-radius: 50rpx;
    padding: 20rpx 30rpx;
    font-size: 28rpx;
}
.picker-btn {
    background: #fff;
    border-radius: 50rpx;
    padding: 20rpx 30rpx;
    font-size: 28rpx;
    color: #666;
}
.add-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    text-align: center;
    padding: 24rpx;
    border-radius: 16rpx;
    font-size: 30rpx;
    margin-bottom: 20rpx;
}
.product-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}
.product-item {
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    display: flex;
    gap: 20rpx;
}
.product-image {
    width: 160rpx;
    height: 160rpx;
    background: #f5f5f5;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 60rpx;
}
.product-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.product-name {
    font-size: 30rpx;
    color: #333;
    font-weight: 500;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}
.product-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.price {
    font-size: 32rpx;
    color: #ff4d4f;
    font-weight: bold;
}
.stock {
    font-size: 24rpx;
    color: #999;
}
.product-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.commission {
    font-size: 24rpx;
    color: #52c41a;
}
.product-actions {
    display: flex;
    align-items: center;
}
.action-btn {
    padding: 12rpx 24rpx;
    border-radius: 8rpx;
    font-size: 24rpx;
}
.action-btn.edit {
    background: #e6f7ff;
    color: #1890ff;
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
