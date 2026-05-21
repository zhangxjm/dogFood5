import { reactive } from 'vue'

export const store = reactive({
  currentUser: null,
  userRole: 'customer',

  setUser(user) {
    this.currentUser = user
    this.userRole = user?.role || 'customer'
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  },

  loadUser() {
    try {
      const saved = localStorage.getItem('user')
      if (saved) {
        const user = JSON.parse(saved)
        if (user && user._id) {
          this.currentUser = user
          this.userRole = user?.role || 'customer'
        } else {
          localStorage.removeItem('user')
          this.currentUser = null
          this.userRole = 'customer'
        }
      }
    } catch (e) {
      console.error('Failed to load user:', e)
      localStorage.removeItem('user')
      this.currentUser = null
      this.userRole = 'customer'
    }
  },

  logout() {
    this.currentUser = null
    this.userRole = 'customer'
    localStorage.removeItem('user')
  },

  isLoggedIn() {
    return this.currentUser && this.currentUser._id
  },

  getUserId() {
    return this.currentUser?._id || null
  }
})
