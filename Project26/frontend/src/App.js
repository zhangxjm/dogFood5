import React from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Gifts from './pages/Gifts';
import Recipients from './pages/Recipients';
import Reminders from './pages/Reminders';
import History from './pages/History';

function App() {
  return (
    <div className="app">
      <aside className="sidebar">
        <h1>🎁 礼品清单管理</h1>
        <nav>
          <NavLink to="/dashboard" activeclassname="active">📊 总览</NavLink>
          <NavLink to="/gifts" activeclassname="active">📦 礼品分类</NavLink>
          <NavLink to="/recipients" activeclassname="active">👥 送礼对象</NavLink>
          <NavLink to="/reminders" activeclassname="active">⏰ 时间提醒</NavLink>
          <NavLink to="/history" activeclassname="active">📜 历史记录</NavLink>
        </nav>
      </aside>
      <main className="main">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/gifts" element={<Gifts />} />
          <Route path="/recipients" element={<Recipients />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
