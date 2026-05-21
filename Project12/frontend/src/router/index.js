import { createRouter, createWebHistory } from 'vue-router'
import Materials from '../views/Materials.vue'
import Teams from '../views/Teams.vue'
import Record from '../views/Record.vue'
import Records from '../views/Records.vue'

const routes = [
  { path: '/', redirect: '/materials' },
  { path: '/materials', component: Materials },
  { path: '/teams', component: Teams },
  { path: '/record', component: Record },
  { path: '/records', component: Records }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
