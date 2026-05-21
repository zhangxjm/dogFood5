import { defineStore } from 'pinia'
import request from '@/utils/request'

export const useUserStore = defineStore('user', {
  state: () => ({
    leaderInfo: JSON.parse(localStorage.getItem('leaderInfo') || 'null')
  }),
  actions: {
    async login(phone, password) {
      const res = await request({
        url: '/auth/login',
        method: 'POST',
        data: { phone, password }
      })
      this.leaderInfo = res.data
      localStorage.setItem('leaderInfo', JSON.stringify(res.data))
      return res
    },
    logout() {
      this.leaderInfo = null
      localStorage.removeItem('leaderInfo')
    },
    getLeaderId() {
      return this.leaderInfo?.id
    }
  }
})
