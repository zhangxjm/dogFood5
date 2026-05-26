import React, { useState, useEffect } from 'react';
import { fitnessPlanApi, checkInApi } from '../api';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, getDay } from 'date-fns';

export default function CheckIn() {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [checkIns, setCheckIns] = useState([]);
  const [todayCheckIn, setTodayCheckIn] = useState(null);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    caloriesBurned: 0,
    durationMinutes: 30,
    notes: '',
  });

  useEffect(() => {
    loadPlans();
  }, []);

  useEffect(() => {
    if (selectedPlan) {
      loadCheckIns();
      loadTodayCheckIn();
    }
  }, [selectedPlan]);

  const loadPlans = async () => {
    try {
      const res = await fitnessPlanApi.getActive();
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

  const loadCheckIns = async () => {
    try {
      const now = new Date();
      const res = await checkInApi.getByMonth(selectedPlan, now.getFullYear(), now.getMonth() + 1);
      setCheckIns(res.data);
    } catch (error) {
      console.error('Failed to load check-ins:', error);
    }
  };

  const loadTodayCheckIn = async () => {
    try {
      const res = await checkInApi.getToday(selectedPlan);
      setTodayCheckIn(res.data);
    } catch (error) {
      console.error('Failed to load today check-in:', error);
    }
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();
    try {
      await checkInApi.create({
        fitnessPlanId: selectedPlan,
        checkInDate: format(new Date(), 'yyyy-MM-dd'),
        completed: true,
        ...formData,
      });
      setShowCheckInModal(false);
      setFormData({ caloriesBurned: 0, durationMinutes: 30, notes: '' });
      loadCheckIns();
      loadTodayCheckIn();
    } catch (error) {
      console.error('Failed to check in:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('打卡失败，请重试');
      }
    }
  };

  const handleDeleteCheckIn = async (id) => {
    if (confirm('确定要删除这条打卡记录吗？')) {
      try {
        await checkInApi.delete(id);
        loadCheckIns();
        loadTodayCheckIn();
      } catch (error) {
        console.error('Failed to delete check-in:', error);
        alert('删除失败，请重试');
      }
    }
  };

  const renderCalendar = () => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startDay = getDay(monthStart);
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

    return (
      <div>
        <div className="calendar-grid">
          {weekDays.map(day => (
            <div key={day} className="calendar-header">
              {day}
            </div>
          ))}
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} className="calendar-day empty"></div>
          ))}
          {days.map(day => {
            const hasCheckIn = checkIns.some(c => isSameDay(new Date(c.checkInDate), day) && c.completed);
            return (
              <div
                key={day.toISOString()}
                className={`calendar-day ${hasCheckIn ? 'has-checkin' : ''} ${isToday(day) ? 'today' : ''}`}
              >
                {format(day, 'd')}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">每日打卡</h1>
        <p className="page-subtitle">记录您的每日健身完成情况</p>
      </div>

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

      {selectedPlan && (
        <>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1rem' }}>今日打卡</h3>
            {todayCheckIn ? (
              <div>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                <p style={{ fontSize: '1.2rem', color: '#28a745', marginBottom: '0.5rem' }}>今日已打卡</p>
                <p>消耗卡路里: {todayCheckIn.caloriesBurned} kcal</p>
                <p>运动时长: {todayCheckIn.durationMinutes} 分钟</p>
                {todayCheckIn.notes && <p>备注: {todayCheckIn.notes}</p>}
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                <p style={{ marginBottom: '1rem' }}>今日还未打卡</p>
                <button className="btn btn-success" onClick={() => setShowCheckInModal(true)}>
                  立即打卡
                </button>
              </div>
            )}
          </div>

          <h2 className="page-title" style={{ fontSize: '1.5rem', margin: '2rem 0 1rem' }}>
            本月打卡日历
          </h2>
          <div className="card">
            {renderCalendar()}
          </div>

          <h2 className="page-title" style={{ fontSize: '1.5rem', margin: '2rem 0 1rem' }}>
            打卡记录
          </h2>
          {checkIns.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>本月暂无打卡记录</p>
            </div>
          ) : (
            <div className="check-in-list">
              {checkIns.map(checkIn => (
                <div key={checkIn.id} className="check-in-item">
                  <div className="check-in-date">
                    {format(new Date(checkIn.checkInDate), 'MM/dd')}
                  </div>
                  <div className={`check-in-status ${checkIn.completed ? 'check-in-completed' : 'check-in-pending'}`}>
                    {checkIn.completed ? '✅ 已完成' : '⏳ 未完成'}
                  </div>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                    {checkIn.caloriesBurned} kcal · {checkIn.durationMinutes} min
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    style={{ marginTop: '0.5rem' }}
                    onClick={() => handleDeleteCheckIn(checkIn.id)}
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {showCheckInModal && (
        <div className="modal-overlay" onClick={() => setShowCheckInModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">今日打卡</h2>
              <button className="modal-close" onClick={() => setShowCheckInModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleCheckIn}>
              <div className="form-group">
                <label className="form-label">消耗卡路里 (kcal)</label>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  value={formData.caloriesBurned}
                  onChange={e => setFormData({ ...formData, caloriesBurned: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">运动时长 (分钟)</label>
                <input
                  className="form-input"
                  type="number"
                  min="1"
                  value={formData.durationMinutes}
                  onChange={e => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 30 })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">备注</label>
                <textarea
                  className="form-textarea"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="记录今天的感受或其他备注..."
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCheckInModal(false)}>
                  取消
                </button>
                <button type="submit" className="btn btn-success">
                  确认打卡
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
