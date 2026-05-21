<template>
    <view class="container">
        <view class="card">
            <view class="card-title">{{ projectName }}</view>
            <view class="date-selector">
                <picker mode="date" :value="selectedDate" @change="onDateChange">
                    <view class="picker-btn">
                        📅 {{ selectedDate }}
                    </view>
                </picker>
            </view>
        </view>
        
        <view class="session-list">
            <view 
                v-for="session in sessions" 
                :key="session.id" 
                class="card session-card"
                :class="{ 'disabled': session.available_slots <= 0 }"
            >
                <view class="flex-between">
                    <view>
                        <text class="time">{{ session.start_time }} - {{ session.end_time }}</text>
                    </view>
                    <view>
                        <text 
                            class="tag" 
                            :class="session.available_slots > 0 ? 'tag-green' : 'tag-gray'"
                        >
                            剩余 {{ session.available_slots }} 位
                        </text>
                    </view>
                </view>
                <view class="mt-20" v-if="session.available_slots > 0">
                    <view class="btn btn-green" @click="selectChild(session)">
                        立即预约
                    </view>
                </view>
            </view>
            
            <view v-if="sessions.length === 0" class="empty">
                <text>该日期暂无场次</text>
            </view>
        </view>
        
        <view v-if="showSelector" class="selector-overlay" @click="closeSelector">
            <view class="selector-content" @click.stop>
                <view class="popup-title">选择儿童</view>
                <view class="child-list">
                    <view 
                        v-for="child in children" 
                        :key="child.id" 
                        class="child-item"
                        @click="confirmReservation(child)"
                    >
                        <text class="child-name">{{ child.name }}</text>
                        <text class="child-info">{{ child.gender }} | {{ child.birth_date }}</text>
                    </view>
                </view>
                <view class="add-child-btn" @click="goToAddChild">
                    + 添加新儿童
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { getSessions, getChildren, createReservation } from '@/utils/api.js'

export default {
    data() {
        return {
            projectId: null,
            projectName: '',
            selectedDate: '',
            sessions: [],
            children: [],
            selectedSession: null,
            showSelector: false
        }
    },
    onLoad(options) {
        this.projectId = options.id
        this.projectName = options.name
        const today = new Date()
        this.selectedDate = today.toISOString().split('T')[0]
        this.loadSessions()
        this.loadChildren()
    },
    methods: {
        onDateChange(e) {
            this.selectedDate = e.detail.value
            this.loadSessions()
        },
        loadSessions() {
            getSessions(this.projectId, this.selectedDate).then(res => {
                this.sessions = res
            })
        },
        loadChildren() {
            getChildren().then(res => {
                this.children = res
            })
        },
        selectChild(session) {
            if (this.children.length === 0) {
                uni.showToast({
                    title: '请先添加儿童信息',
                    icon: 'none'
                })
                setTimeout(() => {
                    this.goToAddChild()
                }, 1500)
                return
            }
            this.selectedSession = session
            this.showSelector = true
        },
        closeSelector() {
            this.showSelector = false
        },
        confirmReservation(child) {
            createReservation({
                session_id: this.selectedSession.id,
                child_id: child.id
            }).then(res => {
                uni.showToast({
                    title: '预约成功',
                    icon: 'success'
                })
                this.showSelector = false
                this.loadSessions()
            })
        },
        goToAddChild() {
            this.showSelector = false
            uni.navigateTo({
                url: '/pages/children/add'
            })
        }
    }
}
</script>

<style scoped>
.date-selector {
    margin-top: 20rpx;
}

.selector-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    display: flex;
    align-items: flex-end;
}

.selector-content {
    width: 100%;
    background: #fff;
    border-radius: 32rpx 32rpx 0 0;
    padding: 40rpx;
    max-height: 600rpx;
}

.picker-btn {
    background: #f5f5f5;
    padding: 24rpx;
    border-radius: 12rpx;
    text-align: center;
    font-size: 28rpx;
    color: #333;
}

.session-card.disabled {
    opacity: 0.5;
}

.time {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
}

.empty {
    text-align: center;
    padding: 80rpx;
    color: #999;
}

.popup-content {
    background: #fff;
    border-radius: 32rpx 32rpx 0 0;
    padding: 40rpx;
    max-height: 600rpx;
}

.popup-title {
    font-size: 32rpx;
    font-weight: bold;
    text-align: center;
    margin-bottom: 30rpx;
}

.child-item {
    padding: 30rpx;
    border-bottom: 1px solid #f0f0f0;
}

.child-name {
    display: block;
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 8rpx;
}

.child-info {
    font-size: 24rpx;
    color: #999;
}

.add-child-btn {
    text-align: center;
    padding: 30rpx;
    color: #667eea;
    font-size: 28rpx;
}
</style>
