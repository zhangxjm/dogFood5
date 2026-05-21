import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style/global.scss'
import 'vant/lib/index.css'
import { 
  Button, 
  Cell, 
  CellGroup, 
  Field, 
  NavBar, 
  Tabbar, 
  TabbarItem,
  Card,
  Tag,
  SwipeCell,
  Dialog,
  Toast,
  Empty,
  Tab,
  Tabs,
  PullRefresh,
  List,
  Popup,
  Picker,
  Switch,
  Stepper,
  Image as VanImage,
  Grid,
  GridItem
} from 'vant'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.use(Button)
app.use(Cell)
app.use(CellGroup)
app.use(Field)
app.use(NavBar)
app.use(Tabbar)
app.use(TabbarItem)
app.use(Card)
app.use(Tag)
app.use(SwipeCell)
app.use(Dialog)
app.use(Toast)
app.use(Empty)
app.use(Tab)
app.use(Tabs)
app.use(PullRefresh)
app.use(List)
app.use(Popup)
app.use(Picker)
app.use(Switch)
app.use(Stepper)
app.use(VanImage)
app.use(Grid)
app.use(GridItem)

app.config.globalProperties.$toast = Toast
app.config.globalProperties.$dialog = Dialog

app.mount('#app')
