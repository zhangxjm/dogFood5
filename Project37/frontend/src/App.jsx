import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import FitnessPlans from './pages/FitnessPlans.jsx';
import CheckIn from './pages/CheckIn.jsx';
import Summary from './pages/Summary.jsx';

export default function App() {
  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-brand">💪 健身计划管理系统</div>
        <ul className="navbar-nav">
          <li>
            <NavLink to="/" className="nav-link" end>
              仪表盘
            </NavLink>
          </li>
          <li>
            <NavLink to="/plans" className="nav-link">
              健身方案
            </NavLink>
          </li>
          <li>
            <NavLink to="/checkin" className="nav-link">
              每日打卡
            </NavLink>
          </li>
          <li>
            <NavLink to="/summary" className="nav-link">
              数据汇总
            </NavLink>
          </li>
        </ul>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/plans" element={<FitnessPlans />} />
          <Route path="/checkin" element={<CheckIn />} />
          <Route path="/summary" element={<Summary />} />
        </Routes>
      </main>
    </div>
  );
}
