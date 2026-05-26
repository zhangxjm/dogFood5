<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="stat-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <div class="label">布草总数量</div>
          <div class="value">{{ stats.total }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);">
          <div class="label">洁净可用</div>
          <div class="value">{{ stats.clean }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
          <div class="label">待清洗</div>
          <div class="value">{{ stats.dirty }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
          <div class="label">使用中</div>
          <div class="value">{{ stats.inUse }}</div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <div class="page-card">
          <h3 style="margin-top: 0;">各类布草分布</h3>
          <div ref="chart1" style="height: 350px;"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="page-card">
          <h3 style="margin-top: 0;">最近清洗记录</h3>
          <el-table :data="recentCleaning" style="width: 100%;" size="small">
            <el-table-column prop="linenName" label="布草名称" />
            <el-table-column prop="quantity" label="数量" width="80" />
            <el-table-column prop="cleaner" label="清洗员" width="100" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === '已完成' ? 'success' : 'warning'">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="cleanTime" label="清洗时间" width="160" />
          </el-table>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <div class="page-card">
          <h3 style="margin-top: 0;">最近领用记录</h3>
          <el-table :data="recentUsage" style="width: 100%;" size="small">
            <el-table-column prop="linenName" label="布草名称" />
            <el-table-column prop="quantity" label="数量" width="80" />
            <el-table-column prop="userName" label="领用人" width="120" />
            <el-table-column prop="department" label="部门" width="100" />
            <el-table-column prop="status" label="状态" width="80">
              <template #default="{ row }">
                <el-tag :type="row.status === '已归还' ? 'info' : 'primary'">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="page-card">
          <h3 style="margin-top: 0;">最近损耗记录</h3>
          <el-table :data="recentLoss" style="width: 100%;" size="small">
            <el-table-column prop="linenName" label="布草名称" />
            <el-table-column prop="quantity" label="数量" width="80" />
            <el-table-column prop="reason" label="损耗原因" show-overflow-tooltip />
            <el-table-column prop="recorder" label="登记人" width="100" />
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { inventoryApi, cleaningApi, usageApi, lossApi } from '../api'

const stats = ref({ total: 0, clean: 0, dirty: 0, inUse: 0 })
const chart1 = ref(null)
const recentCleaning = ref([])
const recentUsage = ref([])
const recentLoss = ref([])

const loadData = async () => {
  try {
    const [invRes, cleanRes, usageRes, lossRes] = await Promise.all([
      inventoryApi.list(),
      cleaningApi.list(),
      usageApi.list(),
      lossApi.list()
    ])

    const inventory = invRes.data || []
    stats.value.total = inventory.reduce((sum, i) => sum + (i.totalQuantity || 0), 0)
    stats.value.clean = inventory.reduce((sum, i) => sum + (i.cleanQuantity || 0), 0)
    stats.value.dirty = inventory.reduce((sum, i) => sum + (i.dirtyQuantity || 0), 0)
    stats.value.inUse = inventory.reduce((sum, i) => sum + (i.inUseQuantity || 0), 0)

    recentCleaning.value = (cleanRes.data || []).slice(0, 5)
    recentUsage.value = (usageRes.data || []).slice(0, 5)
    recentLoss.value = (lossRes.data || []).slice(0, 5)

    await nextTick()
    renderChart(inventory)
  } catch (e) {
    console.error(e)
  }
}

const renderChart = (inventory) => {
  if (!chart1.value) return
  const chart = echarts.init(chart1.value)
  const typeMap = {}
  inventory.forEach(item => {
    typeMap[item.type] = (typeMap[item.type] || 0) + item.totalQuantity
  })
  const data = Object.entries(typeMap).map(([name, value]) => ({ name, value }))
  chart.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: { show: true, formatter: '{b}: {c}' },
      data
    }]
  })
  window.addEventListener('resize', () => chart.resize())
}

onMounted(loadData)
</script>
