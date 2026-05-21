<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>领用台账查询</span>
      </template>

      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="材料">
          <el-select v-model="searchForm.material_id" placeholder="请选择材料" clearable style="width: 200px">
            <el-option
              v-for="item in materials"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班组">
          <el-select v-model="searchForm.team_id" placeholder="请选择班组" clearable style="width: 200px">
            <el-option
              v-for="item in teams"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" clearable style="width: 120px">
            <el-option label="领用" :value="1" />
            <el-option label="归还" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker
            v-model="searchForm.start_date"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker
            v-model="searchForm.end_date"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" border style="width: 100%; margin-top: 20px">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="material_name" label="材料名称" />
        <el-table-column prop="team_name" label="班组名称" width="150" />
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column prop="type_name" label="类型" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.type === 1 ? 'danger' : 'success'">
              {{ scope.row.type_name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="经办人" width="120" />
        <el-table-column prop="remark" label="备注" show-overflow-tooltip />
        <el-table-column prop="created_at" label="登记时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.created_at) }}
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="fetchData"
        @current-change="fetchData"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getRecords, getAllMaterials, getAllTeams } from '../api'

const tableData = ref([])
const materials = ref([])
const teams = ref([])

const searchForm = reactive({
  material_id: null,
  team_id: null,
  type: null,
  start_date: '',
  end_date: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('zh-CN')
}

const fetchData = async () => {
  const params = {
    page: pagination.page,
    pageSize: pagination.pageSize,
    material_id: searchForm.material_id || '',
    team_id: searchForm.team_id || '',
    type: searchForm.type || '',
    start_date: searchForm.start_date || '',
    end_date: searchForm.end_date || ''
  }
  const res = await getRecords(params)
  if (res.code === 200) {
    tableData.value = res.data
    pagination.total = res.total
  }
}

const fetchMaterials = async () => {
  const res = await getAllMaterials()
  if (res.code === 200) {
    materials.value = res.data
  }
}

const fetchTeams = async () => {
  const res = await getAllTeams()
  if (res.code === 200) {
    teams.value = res.data
  }
}

const resetSearch = () => {
  Object.assign(searchForm, {
    material_id: null,
    team_id: null,
    type: null,
    start_date: '',
    end_date: ''
  })
  pagination.page = 1
  fetchData()
}

onMounted(() => {
  fetchData()
  fetchMaterials()
  fetchTeams()
})
</script>

<style scoped>
.page-container {
  padding: 20px;
}
</style>
