import React, { useEffect, useState } from 'react';
import { api } from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState({ gifts: 0, recipients: 0, reminders: 0, history: 0 });
  const [upcoming, setUpcoming] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [gifts, recipients, reminders, upcoming, history] = await Promise.all([
        api.gifts.list(),
        api.recipients.list(),
        api.reminders.list(),
        api.reminders.upcoming(),
        api.history.list()
      ]);
      setStats({
        gifts: gifts.length,
        recipients: recipients.length,
        reminders: reminders.filter(r => r.status === 'pending').length,
        history: history.length
      });
      setUpcoming(upcoming.slice(0, 5));
      setHistory(history.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  const fmtDate = (d) => new Date(d).toLocaleDateString('zh-CN');

  return (
    <div>
      <div className="page-header">
        <h2>📊 系统总览</h2>
      </div>

      <div className="stats">
        <div className="stat-card">
          <div className="label">礼品种类</div>
          <div className="value">{stats.gifts}</div>
        </div>
        <div className="stat-card">
          <div className="label">送礼对象</div>
          <div className="value">{stats.recipients}</div>
        </div>
        <div className="stat-card">
          <div className="label">待办提醒</div>
          <div className="value">{stats.reminders}</div>
        </div>
        <div className="stat-card">
          <div className="label">历史记录</div>
          <div className="value">{stats.history}</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 12 }}>⏰ 即将到来的提醒（30天内）</h3>
        {upcoming.length === 0 ? (
          <div className="empty">暂无即将到来的提醒</div>
        ) : (
          <table>
            <thead>
              <tr><th>事项</th><th>送礼对象</th><th>礼品</th><th>日期</th><th>状态</th></tr>
            </thead>
            <tbody>
              {upcoming.map(r => (
                <tr key={r._id}>
                  <td>{r.title}</td>
                  <td>{r.recipientId?.name}</td>
                  <td>{r.giftId?.name}</td>
                  <td>{fmtDate(r.remindDate)}</td>
                  <td><span className="tag badge-pending">待办</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 12 }}>📜 最近送礼记录</h3>
        {history.length === 0 ? (
          <div className="empty">暂无历史记录</div>
        ) : (
          <table>
            <thead>
              <tr><th>日期</th><th>送礼对象</th><th>礼品</th><th>场合</th><th>反应</th></tr>
            </thead>
            <tbody>
              {history.map(h => (
                <tr key={h._id}>
                  <td>{fmtDate(h.giveDate)}</td>
                  <td>{h.recipientId?.name}</td>
                  <td>{h.giftId?.name}</td>
                  <td>{h.occasion}</td>
                  <td>{h.reaction || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
