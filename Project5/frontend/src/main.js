import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { 
  Button, Cell, CellGroup, Form, Field, NavBar, Tabbar, TabbarItem, 
  Card, Tag, Dialog, Toast, List, PullRefresh, ActionSheet, Rate,
  Radio, RadioGroup, Picker, Popup, Tabs, Tab, Loading
} from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)

app.use(router)
app.use(Button)
app.use(Cell)
app.use(CellGroup)
app.use(Form)
app.use(Field)
app.use(NavBar)
app.use(Tabbar)
app.use(TabbarItem)
app.use(Card)
app.use(Tag)
app.use(Dialog)
app.use(Toast)
app.use(List)
app.use(PullRefresh)
app.use(ActionSheet)
app.use(Rate)
app.use(Radio)
app.use(RadioGroup)
app.use(Picker)
app.use(Popup)
app.use(Tabs)
app.use(Tab)
app.use(Loading)

app.mount('#app')
