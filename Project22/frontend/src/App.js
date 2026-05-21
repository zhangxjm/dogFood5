import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme } from 'antd';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  AppstoreOutlined,
  TableOutlined,
  FileTextOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Dashboard from './pages/Dashboard';
import AreaManagement from './pages/AreaManagement';
import SeatManagement from './pages/SeatManagement';
import ReservationManagement from './pages/ReservationManagement';
import UserManagement from './pages/UserManagement';
import './App.css';

const { Header, Content, Sider } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    setCurrentUser({ id: 1, username: 'admin', full_name: '管理员' });
  }, []);

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页概览',
    },
    {
      key: '/areas',
      icon: <AppstoreOutlined />,
      label: '区域管理',
    },
    {
      key: '/seats',
      icon: <TableOutlined />,
      label: '座位管理',
    },
    {
      key: '/reservations',
      icon: <FileTextOutlined />,
      label: '预约管理',
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: '用户管理',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo">
          {!collapsed && <h2 style={{ color: 'white', textAlign: 'center', padding: '16px 0', margin: 0 }}>自习室预约</h2>}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0 }}>自习室座位预约管理系统</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserOutlined />
            <span>{currentUser?.full_name || currentUser?.username}</span>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280, background: colorBgContainer, borderRadius: borderRadiusLG }}>
          <Routes>
            <Route path="/" element={<Dashboard currentUser={currentUser} />} />
            <Route path="/areas" element={<AreaManagement />} />
            <Route path="/seats" element={<SeatManagement />} />
            <Route path="/reservations" element={<ReservationManagement currentUser={currentUser} />} />
            <Route path="/users" element={<UserManagement />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
