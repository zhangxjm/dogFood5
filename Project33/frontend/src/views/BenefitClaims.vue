<template>
  <div class="benefit-claims">
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>福利领取记录</span>
          <el-button type="primary" @click="handleClaim">
            <el-icon><Present /></el-icon>
            领取福利
          </el-button>
        </div>
      </template>

      <el-table :data="claims" border stripe>
        <el-table-column prop="member.name" label="会员姓名" width="120" />
        <el-table-column prop="member.phone" label="会员手机号" width="130" />
        <el-table-column prop="benefit.name" label="福利名称" width="200" />
        <el-table-column prop="pointsUsed" label="消耗积分" width="100" />
        <el-table-column prop="operator" label="操作人" width="100" />
        <el-table-column prop="createdAt" label="领取时间" width="180" />
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      title="领取福利"
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
              :label="`${member.name} - ${member.phone} (积分:${member.availablePoints})`"
              :value="member.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择福利" prop="benefitId">
          <el-select
            v-model="form.benefitId"
            placeholder="选择福利"
            style="width: 100%;"
            @focus="loadBenefits"
          >
            <el-option
              v-for="benefit in benefits"
              :key="benefit.id"
              :label="`${benefit.name} (${benefit.pointsRequired}积分, 剩余:${benefit.stock - benefit.claimedCount})`"
              :value="benefit.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="操作人" prop="operator">
          <el-input v-model="form.operator" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定领取</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { benefitClaimApi, memberApi, benefitApi } from '@/api'

const claims = ref([])
const members = ref([])
const benefits = ref([])
const dialogVisible = ref(false)

const form = ref({
  memberId: null,
  benefitId: null,
  operator: '',
  remark: ''
})

const loadClaims = async () => {
  try {
    const res = await benefitClaimApi.list()
    claims.value = res.data
  } catch (error) {
    ElMessage.error('加载领取记录失败')
  }
}

const loadMembers = async () => {
  try {
    const res = await memberApi.list()
    members.value = res.data.filter(m => m.status)
  } catch (error) {
    ElMessage.error('加载会员列表失败')
  }
}

const loadBenefits = async () => {
  try {
    const res = await benefitApi.list()
    benefits.value = res.data.filter(b => b.status && b.stock > b.claimedCount)
  } catch (error) {
    ElMessage.error('加载福利列表失败')
  }
}

const handleClaim = () => {
  form.value = {
    memberId: null,
    benefitId: null,
    operator: '',
    remark: ''
  }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    await benefitClaimApi.claim(form.value)
    ElMessage.success('领取成功')
    dialogVisible.value = false
    loadClaims()
  } catch (error) {
    ElMessage.error(error.response?.data || '领取失败')
  }
}

onMounted(() => {
  loadClaims()
  loadMembers()
  loadBenefits()
})
</script>