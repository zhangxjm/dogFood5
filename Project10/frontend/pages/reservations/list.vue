<template>
    <view class="container">
        <view v-for="res in reservations" :key="res.id" class="card reservation-card">
            <view class="flex-between">
                <view class="child-info">
                    <text class="child-name">{{ res.child?.name }}</text>
                    <text class="session-info">
                        {{ res.session?.date }} {{ res.session?.start_time }}
                    </text>
                </view>
                <view>
                    <text 
                        class="tag" 
                        :class="res.status === 'verified' ? 'tag-green' : 'tag-orange'"
                    >
                        {{ res.status === 'verified' ? '已核销' : '已预约' }}
                    </text>
                </view>
            </view>
        </view>
        
        <view v-if="reservations.length === 0" class="empty">
            <text>暂无预约记录</text>
        </view>
    </view>
</template>

<script>
import { getReservations } from '@/utils/api.js'

export default {
    data() {
        return {
            reservations: []
        }
    },
    onShow() {
        this.loadReservations()
    },
    methods: {
        loadReservations() {
            getReservations().then(res => {
                this.reservations = res
            })
        }
    }
}
</script>

<style scoped>
.child-name {
    display: block;
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 8rpx;
}

.session-info {
    font-size: 26rpx;
    color: #999;
}

.empty {
    text-align: center;
    padding: 80rpx;
    color: #999;
}
</style>
