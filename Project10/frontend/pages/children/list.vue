<template>
    <view class="container">
        <view class="card add-card" @click="goToAdd">
            <text class="add-icon">+</text>
            <text class="add-text">添加儿童信息</text>
        </view>
        
        <view v-for="child in children" :key="child.id" class="card child-card">
            <view class="flex-between">
                <view>
                    <text class="child-name">{{ child.name }}</text>
                    <view class="child-info">
                        <text class="tag">{{ child.gender }}</text>
                        <text class="tag">{{ child.birth_date }}</text>
                    </view>
                </view>
                <view class="guardian-info">
                    <text>{{ child.guardian_name }}</text>
                    <text class="phone">{{ child.guardian_phone }}</text>
                </view>
            </view>
        </view>
        
        <view v-if="children.length === 0" class="empty">
            <text>暂无儿童信息</text>
        </view>
    </view>
</template>

<script>
import { getChildren } from '@/utils/api.js'

export default {
    data() {
        return {
            children: []
        }
    },
    onShow() {
        this.loadChildren()
    },
    methods: {
        loadChildren() {
            getChildren().then(res => {
                this.children = res
            })
        },
        goToAdd() {
            uni.navigateTo({
                url: '/pages/children/add'
            })
        }
    }
}
</script>

<style scoped>
.add-card {
    text-align: center;
    border: 2px dashed #ddd;
    background: #fafafa;
}

.add-icon {
    display: block;
    font-size: 48rpx;
    color: #667eea;
    margin-bottom: 16rpx;
}

.add-text {
    font-size: 28rpx;
    color: #667eea;
}

.child-name {
    display: block;
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 16rpx;
}

.guardian-info {
    text-align: right;
}

.guardian-info text {
    display: block;
    font-size: 26rpx;
    color: #666;
}

.phone {
    color: #667eea !important;
    margin-top: 8rpx;
}

.empty {
    text-align: center;
    padding: 80rpx;
    color: #999;
}
</style>
