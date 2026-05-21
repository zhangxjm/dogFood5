import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout as AntLayout, Menu, Typography } from 'antd';
import {
  GiftOutlined,
  ClockCircleOutlined,
  HistoryOutlined,
  BarChartOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import GiftList from './pages/GiftList';
import Reminders from './pages/Reminders';
import History from './pages/History';
import './App.css';

const { Header, Content, Sider } = AntLayout;
const { Title } = Typography;

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: '/',
      icon: <BarChartOutlined />,
      label: '数据概览',
    },
    {
      key: '/gifts',
      icon: <GiftOutlined />,
      label: '礼品清单',
    },
    {
      key: '/reminders',
      icon: <ClockCircleOutlined />,
      label: '送礼提醒',
    },
    {
      key: '/history',
      icon: <HistoryOutlined />,
      label: '历史记录',
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          {!collapsed && <Title level={4} style={{ color: 'white', margin: 0 }}>🎁 礼品管理</Title>}
          {collapsed && <GiftOutlined style={{ fontSize: 24 }} />}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <AntLayout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title level={3} style={{ margin: 0 }}>节日礼品清单管理系统</Title>
          <UserOutlined style={{ fontSize: 20 }} />
        </Header>
        <Content style={{ margin: '24px', background: '#fff', padding: 24, borderRadius: 8 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/gifts" element={<GiftList />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </Content>
      </AntLayout>
    </AntLayout>
  );
}

export default App;
