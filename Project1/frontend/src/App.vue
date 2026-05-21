<template>
  <div class="app">
    <component :is="currentPage" @navigate="navigateTo" @goBack="goBack" />
    <div class="bottom-nav" v-if="showNav">
      <div 
        v-for="item in navItems" 
        :key="item.id"
        class="nav-item"
        :class="{ active: currentPage === item.page }"
        @click="navigateTo(item.page)"
      >
        <div class="nav-icon">{{ item.icon }}</div>
        <div>{{ item.text }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import HomePage from './pages/HomePage.vue';
import InboundPage from './pages/InboundPage.vue';
import PickupPage from './pages/PickupPage.vue';
import ListPage from './pages/ListPage.vue';
import StatisticsPage from './pages/StatisticsPage.vue';
import ExpiredPage from './pages/ExpiredPage.vue';

export default {
  name: 'App',
  components: {
    HomePage,
    InboundPage,
    PickupPage,
    ListPage,
    StatisticsPage,
    ExpiredPage
  },
  data() {
    return {
      currentPage: 'HomePage',
      navItems: [
        { id: 1, page: 'HomePage', icon: '🏠', text: '首页' },
        { id: 2, page: 'ListPage', icon: '📋', text: '列表' },
        { id: 3, page: 'StatisticsPage', icon: '📊', text: '统计' },
        { id: 4, page: 'ExpiredPage', icon: '🔔', text: '提醒' }
      ]
    };
  },
  computed: {
    showNav() {
      return ['HomePage', 'ListPage', 'StatisticsPage', 'ExpiredPage'].includes(this.currentPage);
    }
  },
  methods: {
    navigateTo(page) {
      this.currentPage = page;
    },
    goBack() {
      this.currentPage = 'HomePage';
    }
  }
};
</script>

<style>
</style>
