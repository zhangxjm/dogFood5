<template>
    <div class="customers">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>客户管理</span>
                    <el-button type="primary" @click="openDialog">
                        <el-icon><Plus /></el-icon>
                        新增客户
                    </el-button>
                </div>
            </template>

            <el-form :inline="true" :model="filters" class="filter-form">
                <el-form-item label="搜索">
                    <el-input v-model="filters.search" placeholder="姓名/手机号" clearable style="width: 200px" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loadCustomers">查询</el-button>
                    <el-button @click="resetFilters">重置</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="customers" border stripe>
                <el-table-column prop="name" label="姓名" />
                <el-table-column prop="phone" label="手机号" width="120" />
                <el-table-column prop="email" label="邮箱" />
                <el-table-column prop="address" label="地址" show-overflow-tooltip />
                <el-table-column prop="total_orders" label="订单数" width="100" />
                <el-table-column prop="total_amount" label="消费金额" width="120">
                    <template #default="{ row }">¥{{ row.total_amount }}</template>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" width="180" />
                <el-table-column label="操作" width="180">
                    <template #default="{ row }">
                        <el-button link type="primary" @click="openDialog(row)">编辑</el-button>
                        <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑客户' : '新增客户'" width="500px">
            <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="form.name" placeholder="请输入姓名" />
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="form.phone" placeholder="请输入手机号" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email" placeholder="请输入邮箱" />
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="form.address" type="textarea" :rows="3" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { customerApi } from '../api'

const customers = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)

const filters = reactive({
    search: ''
})

const form = reactive({
    id: null,
    name: '',
    phone: '',
    email: '',
    address: ''
})

const rules = {
    name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
}

const loadCustomers = async () => {
    try {
        const res = await customerApi.list(filters)
        customers.value = res.data
    } catch (error) {
        ElMessage.error('加载客户列表失败')
    }
}

const resetFilters = () => {
    filters.search = ''
    loadCustomers()
}

const openDialog = (row = null) => {
    isEdit.value = !!row
    Object.assign(form, {
        id: row ? row.id : null,
        name: row ? row.name : '',
        phone: row ? row.phone : '',
        email: row ? row.email : '',
        address: row ? row.address : ''
    })
    dialogVisible.value = true
}

const submitForm = async () => {
    if (!formRef.value) return
    
    try {
        await formRef.value.validate()
        if (isEdit.value && form.id) {
            await customerApi.update(form.id, form)
            ElMessage.success('更新成功')
        } else {
            const { id, ...createData } = form
            await customerApi.create(createData)
            ElMessage.success('添加成功')
        }
        dialogVisible.value = false
        loadCustomers()
    } catch (error) {
        if (error !== false) {
            ElMessage.error(isEdit.value ? '更新失败' : '添加失败')
        }
    }
}

const handleDelete = async (row) => {
    try {
        await ElMessageBox.confirm('确定要删除该客户吗？', '提示', {
            type: 'warning'
        })
        await customerApi.delete(row.id)
        ElMessage.success('删除成功')
        loadCustomers()
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('删除失败')
        }
    }
}

onMounted(() => {
    loadCustomers()
})
</script>

<style scoped>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.filter-form {
    margin-bottom: 20px;
}
</style>
