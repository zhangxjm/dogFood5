import React, { useEffect, useState } from 'react';
import { api } from '../api';
import Modal from '../components/Modal';

const emptyRecipient = { name: '', relationship: '', birthday: '', preferences: '', notes: '' };

export default function Recipients() {
  const [list, setList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyRecipient);

  const load = async () => {
    setList(await api.recipients.list());
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyRecipient); setShowModal(true); };
  const openEdit = (r) => { setEditing(r._id); setForm({ ...r }); setShowModal(true); };

  const submit = async () => {
    if (editing) await api.recipients.update(editing, form);
    else await api.recipients.create(form);
    setShowModal(false);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('确认删除该送礼对象？')) return;
    await api.recipients.remove(id);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h2>👥 送礼对象</h2>
        <button className="btn btn-primary" onClick={openCreate}>＋ 新增对象</button>
      </div>

      <div className="card">
        {list.length === 0 ? (
          <div className="empty">暂无送礼对象</div>
        ) : (
          <table>
            <thead>
              <tr><th>姓名</th><th>关系</th><th>生日</th><th>偏好</th><th>备注</th><th>操作</th></tr>
            </thead>
            <tbody>
              {list.map(r => (
                <tr key={r._id}>
                  <td><strong>{r.name}</strong></td>
                  <td>{r.relationship}</td>
                  <td>{r.birthday || '-'}</td>
                  <td>{r.preferences || '-'}</td>
                  <td>{r.notes || '-'}</td>
                  <td>
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
        <Modal title={editing ? '编辑送礼对象' : '新增送礼对象'} onClose={() => setShowModal(false)} onSubmit={submit}>
          <div className="form-row">
            <div className="form-group"><label>姓名</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
            <div className="form-group"><label>关系</label><input value={form.relationship} onChange={e => setForm({...form, relationship: e.target.value})} required /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>生日</label><input placeholder="如 06-15" value={form.birthday || ''} onChange={e => setForm({...form, birthday: e.target.value})} /></div>
            <div className="form-group"><label>偏好</label><input value={form.preferences || ''} onChange={e => setForm({...form, preferences: e.target.value})} /></div>
          </div>
          <div className="form-group"><label>备注</label><textarea rows="3" value={form.notes || ''} onChange={e => setForm({...form, notes: e.target.value})} /></div>
        </Modal>
      )}
    </div>
  );
}
