import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import { message } from 'ant-design-vue'
import App from './App.vue'
import Dashboard from './pages/Dashboard.vue'
import Category from './pages/Category.vue'
import Product from './pages/Product.vue'
import Sale from './pages/Sale.vue'
import ExpiryAlert from './pages/ExpiryAlert.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Dashboard, meta: { title: '首页' } },
    { path: '/category', component: Category, meta: { title: '酒水品类' } },
    { path: '/product', component: Product, meta: { title: '酒水库存' } },
    { path: '/sale', component: Sale, meta: { title: '售卖记录' } },
    { path: '/expiry-alert', component: ExpiryAlert, meta: { title: '临期提醒' } }
  ]
})

const app = createApp(App)
app.config.globalProperties.$message = message
app.use(router)
app.use(Antd)
app.mount('#app')
