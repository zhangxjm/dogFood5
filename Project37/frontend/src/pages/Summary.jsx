import React, { useState, useEffect } from 'react';
import { fitnessPlanApi, summaryApi } from '../api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#667eea', '#764ba2', '#11998e', '#38ef7d', '#ff416c', '#ffb86c'];

export default function Summary() {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [overallSummary, setOverallSummary] = useState(null);
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overall');

  const now = new Date();
  const [year] = useState(now.getFullYear());
  const [month] = useState(now.getMonth() + 1);

  useEffect(() => {
    loadPlans();
  }, []);

  useEffect(() => {
    loadOverallSummary();
  }, []);

  useEffect(() => {
    if (selectedPlan) {
      loadMonthlySummary();
      loadStreak();
    }
  }, [selectedPlan]);

  const loadPlans = async () => {
    try {
      const res = await fitnessPlanApi.getAll();
      setPlans(res.data);
      if (res.data.length > 0) {
        setSelectedPlan(res.data[0].id);
      }
    } catch (error) {
      console.error('Failed to load plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOverallSummary = async () => {
    try {
      const res = await summaryApi.getOverall(year, month);
      setOverallSummary(res.data);
    } catch (error) {
      console.error('Failed to load overall summary:', error);
    }
  };

  const loadMonthlySummary = async () => {
    try {
      const res = await summaryApi.getMonthly(selectedPlan, year, month);
      setMonthlySummary(res.data);
    } catch (error) {
      console.error('Failed to load monthly summary:', error);
    }
  };

  const loadStreak = async () => {
    try {
      const res = await summaryApi.getStreak(selectedPlan);
      setStreak(res.data);
    } catch (error) {
      console.error('Failed to load streak:', error);
    }
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">数据汇总</h1>
        <p className="page-subtitle">查看您的健身数据统计和月度报告</p>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'overall' ? 'active' : ''}`} onClick={() => setActiveTab('overall')}>
          整体统计
        </button>
        <button className={`tab ${activeTab === 'plan' ? 'active' : ''}`} onClick={() => setActiveTab('plan')}>
          单计划统计
        </button>
      </div>

      {activeTab === 'overall' && overallSummary && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{overallSummary.totalCheckIns}</div>
              <div className="stat-label">本月总打卡次数</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{overallSummary.totalCalories}</div>
              <div className="stat-label">本月总消耗卡路里</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{overallSummary.totalDuration}</div>
              <div className="stat-label">本月总运动时长(分钟)</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{overallSummary.activePlans}</div>
              <div className="stat-label">活跃健身计划数</div>
            </div>
          </div>

          <div className="chart-container">
            <h3 style={{ marginBottom: '1rem' }}>各计划完成情况</h3>
            {overallSummary.planSummaries && overallSummary.planSummaries.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={overallSummary.planSummaries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="planName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="checkIns" name="打卡次数" fill="#667eea" />
                  <Bar dataKey="calories" name="消耗卡路里" fill="#764ba2" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <p>本月暂无数据</p>
              </div>
            )}
          </div>

          <div className="chart-container">
            <h3 style={{ marginBottom: '1rem' }}>各计划完成率分布</h3>
            {overallSummary.planSummaries && overallSummary.planSummaries.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={overallSummary.planSummaries}
                    dataKey="completionRate"
                    nameKey="planName"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ planName, completionRate }) => `${planName}: ${completionRate}%`}
                  >
                    {overallSummary.planSummaries.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <p>本月暂无数据</p>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'plan' && (
        <>
          <div className="select-plan">
            <label>选择健身计划：</label>
            <select
              className="form-input"
              style={{ maxWidth: '300px' }}
              value={selectedPlan || ''}
              onChange={e => setSelectedPlan(parseInt(e.target.value))}
            >
              {plans.map(plan => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </select>
          </div>

          {monthlySummary && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{monthlySummary.totalCheckIns}</div>
                  <div className="stat-label">本月打卡次数</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{monthlySummary.completionRate}%</div>
                  <div className="stat-label">完成率</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${monthlySummary.completionRate}%` }}></div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{monthlySummary.totalCalories}</div>
                  <div className="stat-label">消耗卡路里</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{monthlySummary.totalDuration}</div>
                  <div className="stat-label">运动时长(分钟)</div>
                </div>
              </div>

              {streak && (
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-value">{streak.currentStreak}</div>
                    <div className="stat-label">当前连续打卡</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{streak.longestStreak}</div>
                    <div className="stat-label">最长连续打卡</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{streak.totalCheckIns}</div>
                    <div className="stat-label">历史总打卡</div>
                  </div>
                </div>
              )}

              <div className="chart-container">
                <h3 style={{ marginBottom: '1rem' }}>每日卡路里消耗趋势</h3>
                {monthlySummary.dailyData && monthlySummary.dailyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlySummary.dailyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="caloriesBurned" name="卡路里" stroke="#667eea" strokeWidth={2} />
                      <Line type="monotone" dataKey="durationMinutes" name="时长(分钟)" stroke="#764ba2" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-state">
                    <p>本月暂无数据</p>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
