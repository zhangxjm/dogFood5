import React, { useEffect, useState } from 'react';
import { api } from '../api';
import Modal from '../components/Modal';

const emptyReminder = { title: '', recipientId: '', giftId: '', occasion: '', remindDate: '', status: 'pending', notes: '' };

export default function Reminders() {
  const [list, setList] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyReminder);

  const load = async () => {
    const [l, r, g] = await Promise.all([api.reminders.list(), api.recipients.list(), api.gifts.list()]);
    setList(l);
    setRecipients(r);
    setGifts(g);
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyReminder); setShowModal(true); };
  const openEdit = (r) => {
    setEditing(r._id);
    setForm({
      ...r,
      recipientId: r.recipientId?._id || '',
      giftId: r.giftId?._id || '',
      remindDate: new Date(r.remindDate).toISOString().slice(0, 10)
    });
    setShowModal(true);
  };

  const submit = async () => {
    if (editing) await api.reminders.update(editing, form);
    else await api.reminders.create(form);
    setShowModal(false);
    load();
  };

  const toggleDone = async (r) => {
    await api.reminders.update(r._id, { status: r.status === 'done' ? 'pending' : 'done' });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('确认删除该提醒？')) return;
    await api.reminders.remove(id);
    load();
  };

  const fmtDate = (d) => new Date(d).toLocaleDateString('zh-CN');

  return (
    <div>
      <div className="page-header">
        <h2>⏰ 时间提醒</h2>
        <button className="btn btn-primary" onClick={openCreate}>＋ 新增提醒</button>
      </div>

      <div className="card">
        {list.length === 0 ? (
          <div className="empty">暂无提醒</div>
        ) : (
          <table>
            <thead>
              <tr><th>标题</th><th>对象</th><th>礼品</th><th>场合</th><th>日期</th><th>状态</th><th>操作</th></tr>
            </thead>
            <tbody>
              {list.map(r => (
                <tr key={r._id}>
                  <td><strong>{r.title}</strong></td>
                  <td>{r.recipientId?.name}</td>
                  <td>{r.giftId?.name}</td>
                  <td>{r.occasion}</td>
                  <td>{fmtDate(r.remindDate)}</td>
                  <td>
                    <span className={`tag ${r.status === 'done' ? 'badge-done' : 'badge-pending'}`}>
                      {r.status === 'done' ? '已完成' : '待办'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-secondary" onClick={() => toggleDone(r)}>{r.status === 'done' ? '撤销' : '完成'}</button>
                    <button className="btn btn-sm btn-secondary" onClick={() => openEdit(r)}>编辑</button>
                    <button className="btn btn-sm btn-danger" onClick={() => remove(r._id)}>删除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <Modal title={editing ? '编辑提醒' : '新增提醒'} onClose={() => setShowModal(false)} onSubmit={submit}>
          <div className="form-group"><label>标题</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
          <div className="form-row">
            <div className="form-group"><label>送礼对象</label>
              <select value={form.recipientId} onChange={e => setForm({...form, recipientId: e.target.value})} required>
                <option value="">请选择</option>
                {recipients.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
              </select>
            </div>
            <div className="form-group"><label>礼品</label>
              <select value={form.giftId} onChange={e => setForm({...form, giftId: e.target.value})} required>
                <option value="">请选择</option>
                {gifts.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>场合</label><input value={form.occasion} onChange={e => setForm({...form, occasion: e.target.value})} required /></div>
            <div className="form-group"><label>提醒日期</label><input type="date" value={form.remindDate} onChange={e => setForm({...form, remindDate: e.target.value})} required /></div>
          </div>
          <div className="form-group"><label>备注</label><textarea rows="2" value={form.notes || ''} onChange={e => setForm({...form, notes: e.target.value})} /></div>
        </Modal>
      )}
    </div>
  );
}
