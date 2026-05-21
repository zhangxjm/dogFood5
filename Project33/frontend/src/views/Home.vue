<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>会员总数</span>
            </div>
          </template>
          <div class="stat-value">{{ memberCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>消费记录数</span>
            </div>
          </template>
          <div class="stat-value">{{ consumptionCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>福利数量</span>
            </div>
          </template>
          <div class="stat-value">{{ benefitCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>会员等级</span>
            </div>
          </template>
          <div class="stat-value">{{ levelCount }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px;">
      <template #header>
        <span>快捷操作</span>
      </template>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-button type="primary" @click="$router.push('/members')" style="width: 100%; height: 80px; font-size: 18px;">
            <el-icon style="font-size: 24px; margin-right: 10px;"><User /></el-icon>
            会员管理
          </el-button>
        </el-col>
        <el-col :span="8">
          <el-button type="success" @click="$router.push('/consumption-records')" style="width: 100%; height: 80px; font-size: 18px;">
            <el-icon style="font-size: 24px; margin-right: 10px;"><ShoppingCart /></el-icon>
            消费记录
          </el-button>
        </el-col>
        <el-col :span="8">
          <el-button type="warning" @click="$router.push('/benefit-claims')" style="width: 100%; height: 80px; font-size: 18px;">
            <el-icon style="font-size: 24px; margin-right: 10px;"><Gift /></el-icon>
            福利领取
          </el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { memberApi, consumptionRecordApi, benefitApi, memberLevelApi } from '@/api'

const memberCount = ref(0)
const consumptionCount = ref(0)
const benefitCount = ref(0)
const levelCount = ref(0)

onMounted(async () => {
  try {
    const [members, consumptions, benefits, levels] = await Promise.all([
      memberApi.list(),
      consumptionRecordApi.list(),
      benefitApi.list(),
      memberLevelApi.list()
    ])
    memberCount.value = members.data.length
    consumptionCount.value = consumptions.data.length
    benefitCount.value = benefits.data.length
    levelCount.value = levels.data.length
  } catch (error) {
    console.error('加载数据失败', error)
  }
})
</script>

<style scoped>
.stat-value {
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  color: #409eff;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>