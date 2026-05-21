<template>
    <div class="products">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>商品管理</span>
                    <el-button type="primary" @click="openDialog">
                        <el-icon><Plus /></el-icon>
                        发布商品
                    </el-button>
                </div>
            </template>

            <el-form :inline="true" :model="filters" class="filter-form">
                <el-form-item label="分类">
                    <el-select v-model="filters.category" placeholder="请选择" clearable style="width: 200px">
                        <el-option v-for="cat in categories" :key="cat" :label="cat" :value="cat" />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="filters.status" placeholder="请选择" clearable style="width: 200px">
                        <el-option label="在售" value="on_sale" />
                        <el-option label="下架" value="off_sale" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loadProducts">查询</el-button>
                    <el-button @click="resetFilters">重置</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="products" border stripe>
                <el-table-column prop="name" label="商品名称" />
                <el-table-column prop="category" label="分类" />
                <el-table-column prop="price" label="价格">
                    <template #default="{ row }">¥{{ row.price }}</template>
                </el-table-column>
                <el-table-column prop="stock" label="库存" />
                <el-table-column prop="unit" label="单位" />
                <el-table-column prop="status" label="状态">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 'on_sale' ? 'success' : 'info'">
                            {{ row.status === 'on_sale' ? '在售' : '下架' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="description" label="描述" show-overflow-tooltip />
                <el-table-column label="操作" width="180">
                    <template #default="{ row }">
                        <el-button link type="primary" @click="openDialog(row)">编辑</el-button>
                        <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑商品' : '发布商品'" width="500px">
            <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
                <el-form-item label="商品名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入商品名称" />
                </el-form-item>
                <el-form-item label="分类" prop="category">
                    <el-input v-model="form.category" placeholder="请输入分类" />
                </el-form-item>
                <el-form-item label="价格" prop="price">
                    <el-input-number v-model="form.price" :min="0" :precision="2" style="width: 100%" />
                </el-form-item>
                <el-form-item label="库存" prop="stock">
                    <el-input-number v-model="form.stock" :min="0" style="width: 100%" />
                </el-form-item>
                <el-form-item label="单位" prop="unit">
                    <el-input v-model="form.unit" placeholder="如：斤、个、袋" />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="form.status" style="width: 100%">
                        <el-option label="在售" value="on_sale" />
                        <el-option label="下架" value="off_sale" />
                    </el-select>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="form.description" type="textarea" :rows="3" />
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
import { productApi } from '../api'

const products = ref([])
const categories = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)

const filters = reactive({
    category: '',
    status: ''
})

const form = reactive({
    id: null,
    name: '',
    category: '',
    price: 0,
    stock: 0,
    unit: '',
    status: 'on_sale',
    description: ''
})

const rules = {
    name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
    category: [{ required: true, message: '请输入分类', trigger: 'blur' }],
    price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
    unit: [{ required: true, message: '请输入单位', trigger: 'blur' }]
}

const loadProducts = async () => {
    try {
        const res = await productApi.list(filters)
        products.value = res.data
    } catch (error) {
        ElMessage.error('加载商品列表失败')
    }
}

const loadCategories = async () => {
    try {
        const res = await productApi.categories()
        categories.value = res.data
    } catch (error) {
        console.error('加载分类失败')
    }
}

const resetFilters = () => {
    filters.category = ''
    filters.status = ''
    loadProducts()
}

const openDialog = (row = null) => {
    isEdit.value = !!row
    Object.assign(form, {
        id: row ? row.id : null,
        name: row ? row.name : '',
        category: row ? row.category : '',
        price: row ? row.price : 0,
        stock: row ? row.stock : 0,
        unit: row ? row.unit : '',
        status: row ? row.status : 'on_sale',
        description: row ? row.description : '',
        image_url: row ? row.image_url : ''
    })
    dialogVisible.value = true
}

const submitForm = async () => {
    if (!formRef.value) return
    
    try {
        await formRef.value.validate()
        if (isEdit.value && form.id) {
            await productApi.update(form.id, form)
            ElMessage.success('更新成功')
        } else {
            const { id, ...createData } = form
            await productApi.create(createData)
            ElMessage.success('发布成功')
        }
        dialogVisible.value = false
        loadProducts()
    } catch (error) {
        if (error !== false) {
            ElMessage.error(isEdit.value ? '更新失败' : '发布失败')
        }
    }
}

const handleDelete = async (row) => {
    try {
        await ElMessageBox.confirm('确定要删除该商品吗？', '提示', {
            type: 'warning'
        })
        await productApi.delete(row.id)
        ElMessage.success('删除成功')
        loadProducts()
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('删除失败')
        }
    }
}

onMounted(() => {
    loadProducts()
    loadCategories()
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
