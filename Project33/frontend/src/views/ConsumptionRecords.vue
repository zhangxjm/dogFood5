<template>
  <div class="consumption-records">
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>消费记录管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增消费记录
          </el-button>
        </div>
      </template>

      <el-table :data="records" border stripe>
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="member.name" label="会员姓名" width="120" />
        <el-table-column prop="member.phone" label="会员手机号" width="130" />
        <el-table-column prop="amount" label="消费金额" width="120">
          <template #default="scope">
            ¥{{ scope.row.amount }}
          </template>
        </el-table-column>
        <el-table-column prop="pointsEarned" label="获得积分" width="100" />
        <el-table-column prop="goodsInfo" label="商品信息" />
        <el-table-column prop="cashier" label="收银员" width="100" />
        <el-table-column prop="createdAt" label="消费时间" width="180" />
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      title="新增消费记录"
      width="500px"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="选择会员" prop="memberId">
          <el-select
            v-model="form.memberId"
            filterable
            placeholder="搜索会员"
            style="width: 100%;"
            @focus="loadMembers"
          >
            <el-option
              v-for="member in members"
              :key="member.id"
              :label="`${member.name} - ${member.phone}`"
              :value="member.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="消费金额" prop="amount">
          <el-input-number v-model="form.amount" :min="0" :precision="2" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="获得积分" prop="pointsEarned">
          <el-input-number v-model="form.pointsEarned" :min="0" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="商品信息" prop="goodsInfo">
          <el-input v-model="form.goodsInfo" type="textarea" />
        </el-form-item>
        <el-form-item label="收银员" prop="cashier">
          <el-input v-model="form.cashier" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { consumptionRecordApi, memberApi } from '@/api'

const records = ref([])
const members = ref([])
const dialogVisible = ref(false)

const form = ref({
  memberId: null,
  amount: 0,
  pointsEarned: 0,
  goodsInfo: '',
  cashier: '',
  remark: ''
})

const loadRecords = async () => {
  try {
    const res = await consumptionRecordApi.list()
    records.value = res.data
  } catch (error) {
    ElMessage.error('加载消费记录失败')
  }
}

const loadMembers = async () => {
  try {
    const res = await memberApi.list()
    members.value = res.data
  } catch (error) {
    ElMessage.error('加载会员列表失败')
  }
}

const handleAdd = () => {
  form.value = {
    memberId: null,
    amount: 0,
    pointsEarned: 0,
    goodsInfo: '',
    cashier: '',
    remark: ''
  }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    const data = {
      member: { id: form.value.memberId },
      amount: form.value.amount,
      pointsEarned: form.value.pointsEarned || Math.floor(form.value.amount),
      goodsInfo: form.value.goodsInfo,
      cashier: form.value.cashier,
      remark: form.value.remark
    }
    await consumptionRecordApi.create(data)
    ElMessage.success('新增成功')
    dialogVisible.value = false
    loadRecords()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该消费记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await consumptionRecordApi.delete(row.id)
    ElMessage.success('删除成功')
    loadRecords()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  loadRecords()
  loadMembers()
})
</script>