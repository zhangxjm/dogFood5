import { createSSRApp } from 'vue'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  
  app.config.globalProperties.$api = {
    baseUrl: 'http://localhost:3000',
    
    async get(url) {
      const res = await uni.request({
        url: this.baseUrl + url,
        method: 'GET'
      })
      return res.data
    },
    
    async post(url, data) {
      const res = await uni.request({
        url: this.baseUrl + url,
        method: 'POST',
        data
      })
      return res.data
    },
    
    async put(url, data) {
      const res = await uni.request({
        url: this.baseUrl + url,
        method: 'PUT',
        data
      })
      return res.data
    },
    
    async patch(url, data) {
      const res = await uni.request({
        url: this.baseUrl + url,
        method: 'PATCH',
        data
      })
      return res.data
    },
    
    async delete(url) {
      const res = await uni.request({
        url: this.baseUrl + url,
        method: 'DELETE'
      })
      return res.data
    }
  }
  
  return {
    app
  }
}
