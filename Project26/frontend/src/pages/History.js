import React, { useEffect, useState } from 'react';
import { api } from '../api';
import Modal from '../components/Modal';

const emptyHistory = { recipientId: '', giftId: '', occasion: '', giveDate: '', reaction: '', notes: '' };

export default function History() {
  const [list, setList] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [filterRecipient, setFilterRecipient] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyHistory);

  const load = async () => {
    const params = {};
    if (filterRecipient) params.recipientId = filterRecipient;
    const [l, r, g] = await Promise.all([api.history.list(params), api.recipients.list(), api.gifts.list()]);
    setList(l);
    setRecipients(r);
    setGifts(g);
  };
  useEffect(() => { load(); }, [filterRecipient]);

  const openCreate = () => { setEditing(null); setForm(emptyHistory); setShowModal(true); };
  const openEdit = (h) => {
    setEditing(h._id);
    setForm({
      ...h,
      recipientId: h.recipientId?._id || '',
      giftId: h.giftId?._id || '',
      giveDate: new Date(h.giveDate).toISOString().slice(0, 10)
    });
    setShowModal(true);
  };

  const submit = async () => {
    if (editing) await api.history.update(editing, form);
    else await api.history.create(form);
    setShowModal(false);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('确认删除该历史记录？')) return;
    await api.history.remove(id);
    load();
  };

  const fmtDate = (d) => new Date(d).toLocaleDateString('zh-CN');

  return (
    <div>
      <div className="page-header">
        <h2>📜 历史送礼记录</h2>
        <button className="btn btn-primary" onClick={openCreate}>＋ 新增记录</button>
      </div>

      <div className="toolbar">
        <select value={filterRecipient} onChange={e => setFilterRecipient(e.target.value)}>
          <option value="">全部对象</option>
          {recipients.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
        </select>
      </div>

      <div className="card">
        {list.length === 0 ? (
          <div className="empty">暂无历史记录</div>
        ) : (
          <table>
            <thead>
              <tr><th>日期</th><th>送礼对象</th><th>礼品</th><th>场合</th><th>反应</th><th>备注</th><th>操作</th></tr>
            </thead>
            <tbody>
              {list.map(h => (
                <tr key={h._id}>
                  <td>{fmtDate(h.giveDate)}</td>
                  <td>{h.recipientId?.name}</td>
                  <td>{h.giftId?.name} <small style={{color:'#7f8c8d'}}>({h.giftId?.category})</small></td>
                  <td>{h.occasion}</td>
                  <td>{h.reaction || '-'}</td>
                  <td>{h.notes || '-'}</td>
                  <td>
                    <button className="btn btn-sm btn-secondary" onClick={() => openEdit(h)}>编辑</button>
                    <button className="btn btn-sm btn-danger" onClick={() => remove(h._id)}>删除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <Modal title={editing ? '编辑记录' : '新增记录'} onClose={() => setShowModal(false)} onSubmit={submit}>
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
            <div className="form-group"><label>送礼日期</label><input type="date" value={form.giveDate} onChange={e => setForm({...form, giveDate: e.target.value})} required /></div>
          </div>
          <div className="form-group"><label>反应</label><input value={form.reaction || ''} onChange={e => setForm({...form, reaction: e.target.value})} /></div>
          <div className="form-group"><label>备注</label><textarea rows="2" value={form.notes || ''} onChange={e => setForm({...form, notes: e.target.value})} /></div>
        </Modal>
      )}
    </div>
  );
}
