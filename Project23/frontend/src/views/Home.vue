<template>
  <div>
    <h2 style="margin-bottom: 20px;">欢迎使用宠物用品门店管理系统</h2>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <div style="text-align: center;">
            <div style="font-size: 48px; color: #409EFF;">{{ categoryCount }}</div>
            <div style="color: #666; margin-top: 10px;">商品分类</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div style="text-align: center;">
            <div style="font-size: 48px; color: #67C23A;">{{ productCount }}</div>
            <div style="color: #666; margin-top: 10px;">商品数量</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div style="text-align: center;">
            <div style="font-size: 48px; color: #E6A23C;">{{ saleCount }}</div>
            <div style="color: #666; margin-top: 10px;">销售记录</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div style="text-align: center;">
            <div style="font-size: 48px; color: #F56C6C;">¥{{ totalRevenue }}</div>
            <div style="color: #666; margin-top: 10px;">总销售额</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-card style="margin-top: 20px;" shadow="never">
      <h3 style="margin-bottom: 15px;">系统功能说明</h3>
      <ul style="line-height: 2;">
        <li><strong>商品分类管理</strong>：添加、编辑、删除商品分类</li>
        <li><strong>商品管理</strong>：管理商品信息，调整商品价格</li>
        <li><strong>销售记录</strong>：记录线下销售，自动扣减库存</li>
        <li><strong>热销统计</strong>：查看热销商品排行</li>
      </ul>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { categoryApi, productApi, saleApi } from '../api'

const categoryCount = ref(0)
const productCount = ref(0)
const saleCount = ref(0)
const totalRevenue = ref(0)

onMounted(async () => {
  const [categories, products, sales] = await Promise.all([
    categoryApi.getAll(),
    productApi.getAll(),
    saleApi.getAll()
  ])
  
  categoryCount.value = categories.data.length
  productCount.value = products.data.length
  saleCount.value = sales.data.length
  totalRevenue.value = sales.data.reduce((sum, sale) => sum + parseFloat(sale.totalPrice), 0).toFixed(2)
})
</script>
