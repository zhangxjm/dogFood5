import React, { useState, useEffect } from 'react';
import { fitnessPlanApi, checkInApi, summaryApi } from '../api';

export default function Dashboard() {
  const [plans, setPlans] = useState([]);
  const [overallSummary, setOverallSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const now = new Date();
      const [plansRes, summaryRes] = await Promise.all([
        fitnessPlanApi.getActive(),
        summaryApi.getOverall(now.getFullYear(), now.getMonth() + 1),
      ]);
      setPlans(plansRes.data);
      setOverallSummary(summaryRes.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">仪表盘</h1>
        <p className="page-subtitle">查看您的健身进度和统计数据</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{overallSummary?.totalCheckIns || 0}</div>
          <div className="stat-label">本月打卡次数</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{overallSummary?.totalCalories || 0}</div>
          <div className="stat-label">本月消耗卡路里</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{overallSummary?.totalDuration || 0}</div>
          <div className="stat-label">本月运动时长(分钟)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{plans.length}</div>
          <div className="stat-label">活跃健身计划</div>
        </div>
      </div>

      <h2 className="page-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
        活跃健身计划
      </h2>

      {plans.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>暂无活跃的健身计划</p>
        </div>
      ) : (
        plans.map(plan => (
          <div key={plan.id} className="card">
            <div className="card-header">
              <h3 className="card-title">{plan.name}</h3>
              <span className={`badge badge-${plan.difficulty}`}>
                {plan.difficulty === 'beginner'
                  ? '初级'
                  : plan.difficulty === 'intermediate'
                  ? '中级'
                  : '高级'}
              </span>
            </div>
            <p className="card-desc">{plan.description}</p>
            <div className="exercise-tags">
              {plan.exercises?.map((ex, i) => (
                <span key={i} className="exercise-tag">
                  {ex}
                </span>
              ))}
            </div>
            <div className="card-footer">
              <span className="badge badge-active">每周 {plan.frequencyPerWeek} 次</span>
              <span className="badge badge-active">每次 {plan.duration} 分钟</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
