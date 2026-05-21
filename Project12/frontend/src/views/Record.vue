<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>材料领用/归还登记</span>
      </template>

      <el-form :model="form" label-width="120px" style="max-width: 600px">
        <el-form-item label="操作类型" required>
          <el-radio-group v-model="form.type">
            <el-radio :label="1">领用</el-radio>
            <el-radio :label="2">归还</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择材料" required>
          <el-select v-model="form.material_id" placeholder="请选择材料" style="width: 100%">
            <el-option
              v-for="item in materials"
              :key="item.id"
              :label="`${item.name} (${item.specification}) - 库存: ${item.quantity}${item.unit}`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择班组" required>
          <el-select v-model="form.team_id" placeholder="请选择班组" style="width: 100%">
            <el-option
              v-for="item in teams"
              :key="item.id"
              :label="`${item.name} - ${item.leader}`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数量" required>
          <el-input-number v-model="form.quantity" :min="1" style="width: 200px" />
        </el-form-item>
        <el-form-item label="经办人">
          <el-input v-model="form.operator" placeholder="请输入经办人姓名" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" size="large">
            <el-icon><Check /></el-icon>
            提交登记
          </el-button>
          <el-button @click="resetForm" size="large">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getAllMaterials, getAllTeams, createRecord } from '../api'

const materials = ref([])
const teams = ref([])

const form = reactive({
  type: 1,
  material_id: null,
  team_id: null,
  quantity: 1,
  operator: '',
  remark: ''
})

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

const resetForm = () => {
  Object.assign(form, {
    type: 1,
    material_id: null,
    team_id: null,
    quantity: 1,
    operator: '',
    remark: ''
  })
}

const handleSubmit = async () => {
  if (!form.material_id || !form.team_id || !form.quantity) {
    ElMessage.warning('请填写完整信息')
    return
  }

  const res = await createRecord(form)
  if (res.code === 200) {
    ElMessage.success('登记成功')
    resetForm()
    fetchMaterials()
  } else {
    ElMessage.error(res.message || '登记失败')
  }
}

onMounted(() => {
  fetchMaterials()
  fetchTeams()
})
</script>

<style scoped>
.page-container {
  padding: 20px;
}
</style>
