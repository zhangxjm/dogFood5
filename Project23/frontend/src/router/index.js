import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Categories from '../views/Categories.vue'
import Products from '../views/Products.vue'
import Sales from '../views/Sales.vue'
import HotProducts from '../views/HotProducts.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/categories', component: Categories },
  { path: '/products', component: Products },
  { path: '/sales', component: Sales },
  { path: '/hot-products', component: HotProducts }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
