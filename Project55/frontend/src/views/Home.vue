<template>
  <div class="home">
    <el-row :gutter="20" class="stat-cards">
      <el-col :span="6">
        <el-card class="stat-card type-card">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="48"><Collection /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.typeCount }}</div>
              <div class="stat-label">剧本类型</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card inventory-card">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="48"><Goods /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.inventoryCount }}</div>
              <div class="stat-label">剧本总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card session-card">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="48"><Tickets /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.sessionCount }}</div>
              <div class="stat-label">开本场次</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card player-card">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="48"><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.playerCount }}</div>
              <div class="stat-label">玩家记录</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <span>剧本类型分布</span>
          </template>
          <div ref="typeChart" class="chart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <span>近期场次统计</span>
          </template>
          <div ref="sessionChart" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import * as echarts from 'echarts'
import { getScriptTypeList, getScriptInventoryList, getSessionRecordList, getPlayerRecordList } from '../api'

const stats = reactive({
  typeCount: 0,
  inventoryCount: 0,
  sessionCount: 0,
  playerCount: 0
})

const typeChart = ref(null)
const sessionChart = ref(null)

const loadData = async () => {
  try {
    const [types, inventories, sessions, players] = await Promise.all([
      getScriptTypeList(),
      getScriptInventoryList(),
      getSessionRecordList(),
      getPlayerRecordList()
    ])
    stats.typeCount = types.length
    stats.inventoryCount = inventories.length
    stats.sessionCount = sessions.length
    stats.playerCount = players.length
    initTypeChart(types, inventories)
    initSessionChart(sessions)
  } catch (e) {
    console.error(e)
  }
}

const initTypeChart = (types, inventories) => {
  if (!typeChart.value) return
  const chart = echarts.init(typeChart.value)
  const typeMap = {}
  types.forEach(t => { typeMap[t.id] = t.name })
  const countMap = {}
  inventories.forEach(i => {
    const name = typeMap[i.typeId] || '未知'
    countMap[name] = (countMap[name] || 0) + 1
  })
  const data = Object.keys(countMap).map(k => ({ name: k, value: countMap[k] }))
  chart.setOption({
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: data
    }]
  })
}

const initSessionChart = (sessions) => {
  if (!sessionChart.value) return
  const chart = echarts.init(sessionChart.value)
  const statusMap = { 0: '未开始', 1: '进行中', 2: '已完成', 3: '已取消' }
  const countMap = {}
  sessions.forEach(s => {
    const name = statusMap[s.status] || '未知'
    countMap[name] = (countMap[name] || 0) + 1
  })
  chart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: Object.keys(countMap) },
    yAxis: { type: 'value' },
    series: [{
      type: 'bar',
      data: Object.values(countMap),
      itemStyle: { color: '#409EFF' }
    }]
  })
}

onMounted(() => {
  loadData()
  window.addEventListener('resize', () => {
    echarts.getInstanceByDom(typeChart.value)?.resize()
    echarts.getInstanceByDom(sessionChart.value)?.resize()
  })
})
</script>

<style scoped>
.stat-cards {
  margin-bottom: 20px;
}

.stat-card {
  border: none;
  border-radius: 8px;
  color: #fff;
}

.type-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.inventory-card { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.session-card { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.player-card { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }

.stat-card :deep(.el-card__body) { padding: 20px; }

.stat-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-icon { opacity: 0.8; }

.stat-info { text-align: right; }

.stat-value {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label { font-size: 14px; opacity: 0.9; }

.chart-card {
  border-radius: 8px;
}

.chart {
  height: 300px;
  width: 100%;
}
</style>
