<template>
    <view class="container">
        <view class="category-list">
            <view v-for="item in categoryList" :key="item.id" class="category-card">
                <image :src="item.image" mode="aspectFill" class="category-img"></image>
                <view class="category-info">
                    <view class="category-header">
                        <text class="category-name">{{ item.name }}</text>
                        <text class="category-price">¥{{ item.price }}/斤</text>
                    </view>
                    <text class="category-season">成熟季节：{{ item.season }}</text>
                    <text class="category-desc">{{ item.description }}</text>
                </view>
            </view>
            <view v-if="categoryList.length === 0" class="empty-tip">
                <text>暂无可采摘品类</text>
            </view>
        </view>
    </view>
</template>

<script>
import { request } from '@/utils/request.js'

export default {
    data() {
        return {
            categoryList: []
        }
    },
    onLoad() {
        this.loadCategories()
    },
    onShow() {
        this.loadCategories()
    },
    methods: {
        loadCategories() {
            request({
                url: '/category/list'
            }).then(res => {
                this.categoryList = res
            })
        }
    }
}
</script>

<style scoped>
.category-list {
    padding: 20rpx;
}

.category-card {
    background: white;
    border-radius: 16rpx;
    overflow: hidden;
    margin-bottom: 24rpx;
    box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.08);
}

.category-img {
    width: 100%;
    height: 300rpx;
}

.category-info {
    padding: 24rpx;
}

.category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12rpx;
}

.category-name {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
}

.category-price {
    font-size: 32rpx;
    font-weight: bold;
    color: #ff6b35;
}

.category-season {
    display: block;
    font-size: 24rpx;
    color: #666;
    padding: 8rpx 16rpx;
    background: #f5f5f5;
    border-radius: 20rpx;
    display: inline-block;
    margin-bottom: 12rpx;
}

.category-desc {
    display: block;
    font-size: 26rpx;
    color: #999;
    line-height: 1.6;
}

.empty-tip {
    padding: 120rpx 40rpx;
    text-align: center;
    color: #999;
    font-size: 28rpx;
}
</style>
