<template>
  <div class="home-page">
    <van-nav-bar title="茶饮门店" />
    
    <van-tabs v-model:active="activeCategory" @change="onCategoryChange">
      <van-tab title="全部" :name="0" />
      <van-tab title="奶茶" :name="1" />
      <van-tab title="果茶" :name="2" />
      <van-tab title="特调" :name="3" />
      <van-tab title="套餐" :name="4" />
    </van-tabs>

    <div class="drink-list">
      <van-cell-group>
        <van-cell
          v-for="drink in drinks"
          :key="drink.id"
          :title="drink.name"
          :label="drink.description"
          clickable
          @click="addToCart(drink)"
        >
          <template #value>
            <div class="drink-price">¥{{ drink.price }}</div>
            <van-button
              size="small"
              type="primary"
              icon="plus"
              @click.stop="addToCart(drink)"
            />
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <van-submit-bar
      :price="totalPrice * 100"
      button-text="去结算"
      :disabled="cartItems.length === 0"
      @submit="goToCheckout"
    >
      <van-tag type="primary" size="medium">已选 {{ cartItems.length }} 件</van-tag>
    </van-submit-bar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { drinkApi } from '@/api'

const router = useRouter()
const activeCategory = ref(0)
const drinks = ref([])
const cartItems = ref([])

const totalPrice = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    return sum + item.price * item.quantity
  }, 0)
})

const loadDrinks = async () => {
  try {
    const res = await drinkApi.getAvailable()
    if (res.code === 200) {
      if (activeCategory.value === 0) {
        drinks.value = res.data
      } else {
        drinks.value = res.data.filter(d => d.category === activeCategory.value)
      }
    }
  } catch (e) {
    console.error('加载饮品失败', e)
  }
}

const onCategoryChange = () => {
  loadDrinks()
}

const addToCart = (drink) => {
  const existingItem = cartItems.value.find(item => item.drinkId === drink.id)
  if (existingItem) {
    existingItem.quantity++
  } else {
    cartItems.value.push({
      drinkId: drink.id,
      drinkName: drink.name,
      price: drink.price,
      quantity: 1
    })
  }
}

const goToCheckout = () => {
  router.push({
    path: '/checkout',
    query: {
      cart: JSON.stringify(cartItems.value),
      totalPrice: totalPrice.value
    }
  })
}

onMounted(() => {
  loadDrinks()
})
</script>

<style scoped>
.home-page {
  padding-bottom: 50px;
}
.drink-list {
  padding: 12px;
}
.drink-price {
  color: #f56c6c;
  font-weight: bold;
  margin-bottom: 8px;
}
</style>
