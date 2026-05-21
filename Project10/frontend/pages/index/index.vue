<template>
    <view class="container">
        <view class="header">
            <text class="title">🎠 亲子乐园</text>
            <text class="subtitle">选择项目，轻松预约</text>
        </view>
        
        <view class="project-list">
            <view 
                v-for="project in projects" 
                :key="project.id" 
                class="card project-card"
                @click="goToDetail(project)"
            >
                <view class="card-title">{{ project.name }}</view>
                <view class="card-desc">{{ project.description }}</view>
                <view class="flex-between">
                    <view>
                        <text class="tag">时长 {{ project.duration_minutes }}分钟</text>
                        <text class="tag tag-green">最多{{ project.max_people_per_session }}人/场</text>
                    </view>
                    <text class="arrow">→</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { getProjects } from '@/utils/api.js'

export default {
    data() {
        return {
            projects: []
        }
    },
    onLoad() {
        this.loadProjects()
    },
    methods: {
        loadProjects() {
            getProjects().then(res => {
                this.projects = res
            })
        },
        goToDetail(project) {
            uni.navigateTo({
                url: `/pages/projects/detail?id=${project.id}&name=${project.name}`
            })
        }
    }
}
</script>

<style scoped>
.header {
    padding: 40rpx 0;
    text-align: center;
}

.title {
    display: block;
    font-size: 48rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 16rpx;
}

.subtitle {
    font-size: 28rpx;
    color: #999;
}

.project-card {
    cursor: pointer;
    transition: transform 0.3s;
}

.arrow {
    font-size: 32rpx;
    color: #999;
}
</style>
