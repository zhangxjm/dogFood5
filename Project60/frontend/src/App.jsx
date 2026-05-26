import React, { useState } from 'react'
import { Layout, Menu, theme } from 'antd'
import { 
  CalendarOutlined, 
  TeamOutlined, 
  DollarOutlined, 
  FileTextOutlined,
  HomeOutlined
} from '@ant-design/icons'
import PlanList from './pages/PlanList'
import PlanDetail from './pages/PlanDetail'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'

const { Header, Content, Sider } = Layout

const menuItems = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: '首页概览'
  },
  {
    key: '/plans',
    icon: <CalendarOutlined />,
    label: '团建方案管理'
  }
]

function AppContent() {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer }
  } = theme.useToken()

  const handleMenuClick = ({ key }) => {
    navigate(key)
  }

  return (
    <Layout className="layout">
      <Header style={{ display: 'flex', alignItems: 'center', padding: '0 24px' }}>
        <div className="logo">企业团建活动管理系统</div>
      </Header>
      <Layout>
        <Sider
          width={200}
          style={{ background: colorBgContainer }}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content
            className="site-layout-content"
            style={{
              background: colorBgContainer,
              borderRadius: '8px'
            }}
          >
            <Routes>
              <Route path="/" element={<PlanList />} />
              <Route path="/plans" element={<PlanList />} />
              <Route path="/plans/:id" element={<PlanDetail />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
