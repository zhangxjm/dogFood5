import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import FileUpload from '../views/FileUpload.vue'
import FileCirculate from '../views/FileCirculate.vue'
import ReceivedFiles from '../views/ReceivedFiles.vue'
import CirculationStatus from '../views/CirculationStatus.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: 'upload',
        name: 'FileUpload',
        component: FileUpload
      },
      {
        path: 'circulate',
        name: 'FileCirculate',
        component: FileCirculate
      },
      {
        path: 'received',
        name: 'ReceivedFiles',
        component: ReceivedFiles
      },
      {
        path: 'status',
        name: 'CirculationStatus',
        component: CirculationStatus
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
