<template>
    <view class="container">
        <view class="add-btn" @click="goAdd">
            <text>+ 添加自提点</text>
        </view>
        
        <view class="pickup-list">
            <view class="pickup-item" v-for="item in list" :key="item.id">
                <view class="pickup-header">
                    <text class="name">{{ item.name }}</text>
                    <view class="status" :class="{ active: item.status === 1 }">
                        <text>{{ item.status === 1 ? '启用' : '禁用' }}</text>
                    </view>
                </view>
                <view class="pickup-info">
                    <view class="info-row">
                        <text class="icon">📍</text>
                        <text class="text">{{ item.address }}</text>
                    </view>
                    <view class="info-row">
                        <text class="icon">👤</text>
                        <text class="text">{{ item.contact_name }} {{ item.contact_phone }}</text>
                    </view>
                    <view class="info-row" v-if="item.business_hours">
                        <text class="icon">🕐</text>
                        <text class="text">{{ item.business_hours }}</text>
                    </view>
                </view>
                <view class="pickup-actions">
                    <view class="action-btn edit" @click="goEdit(item.id)">编辑</view>
                    <view class="action-btn status" @click="toggleStatus(item)">
                        {{ item.status === 1 ? '禁用' : '启用' }}
                    </view>
                </view>
            </view>
        </view>
        
        <view class="empty-tip" v-if="list.length === 0">
            <text>暂无自提点</text>
        </view>
    </view>
</template>

<script>
import request from '@/utils/request.js'

export default {
    data() {
        return {
            list: [],
            leaderId: null
        }
    },
    onShow() {
        const leader = uni.getStorageSync('leaderInfo')
        if (leader) {
            this.leaderId = leader.id
            this.loadList()
        }
    },
    methods: {
        async loadList() {
            try {
                const res = await request({ url: `/pickup/list/${this.leaderId}` })
                this.list = res.data
            } catch (e) {
                console.error(e)
            }
        },
        goAdd() {
            uni.navigateTo({ url: '/pages/pickup/form' })
        },
        goEdit(id) {
            uni.navigateTo({ url: `/pages/pickup/form?id=${id}` })
        },
        async toggleStatus(item) {
            const newStatus = item.status === 1 ? 0 : 1
            uni.showModal({
                title: '确认操作',
                content: `确定${newStatus === 1 ? '启用' : '禁用'}该自提点吗？`,
                success: async (res) => {
                    if (res.confirm) {
                        try {
                            await request({
                                url: `/pickup/status/${item.id}`,
                                method: 'PUT',
                                data: { status: newStatus }
                            })
                            item.status = newStatus
                            uni.showToast({ title: newStatus === 1 ? '已启用' : '已禁用', icon: 'success' })
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
.add-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    text-align: center;
    padding: 24rpx;
    border-radius: 16rpx;
    font-size: 30rpx;
    margin-bottom: 20rpx;
}
.pickup-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}
.pickup-item {
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
}
.pickup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #f0f0f0;
}
.name {
    font-size: 30rpx;
    font-weight: 500;
    color: #333;
}
.status {
    padding: 6rpx 20rpx;
    border-radius: 20rpx;
    font-size: 22rpx;
    background: #f5f5f5;
    color: #999;
}
.status.active {
    background: #f6ffed;
    color: #52c41a;
}
.pickup-info {
    padding: 20rpx 0;
}
.info-row {
    display: flex;
    align-items: flex-start;
    gap: 12rpx;
    padding: 12rpx 0;
}
.icon {
    font-size: 24rpx;
}
.text {
    flex: 1;
    font-size: 26rpx;
    color: #666;
    line-height: 1.5;
}
.pickup-actions {
    display: flex;
    gap: 16rpx;
    padding-top: 20rpx;
    border-top: 1rpx solid #f0f0f0;
}
.action-btn {
    flex: 1;
    text-align: center;
    padding: 16rpx;
    border-radius: 8rpx;
    font-size: 26rpx;
}
.action-btn.edit {
    background: #e6f7ff;
    color: #1890ff;
}
.action-btn.status {
    background: #fff7e6;
    color: #fa8c16;
}
.empty-tip {
    text-align: center;
    padding: 100rpx 0;
    color: #999;
    font-size: 28rpx;
}
</style>
