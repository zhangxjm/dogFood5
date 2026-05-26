import React, { useEffect, useState } from 'react';
import { api } from '../api';
import Modal from '../components/Modal';

const emptyGift = { name: '', category: '', price: 0, quantity: 1, description: '', tags: '' };

export default function Gifts() {
  const [gifts, setGifts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cat, setCat] = useState('全部');
  const [q, setQ] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyGift);

  const load = async () => {
    const [list, cats] = await Promise.all([
      api.gifts.list({ category: cat, q }),
      api.gifts.categories()
    ]);
    setGifts(list);
    setCategories(cats);
  };

  useEffect(() => { load(); }, [cat, q]);

  const openCreate = () => { setEditing(null); setForm(emptyGift); setShowModal(true); };
  const openEdit = (g) => {
    setEditing(g._id);
    setForm({ ...g, tags: (g.tags || []).join(',') });
    setShowModal(true);
  };

  const submit = async () => {
    const data = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [], price: Number(form.price), quantity: Number(form.quantity) };
    if (editing) {
      await api.gifts.update(editing, data);
    } else {
      await api.gifts.create(data);
    }
    setShowModal(false);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm('确认删除该礼品？')) return;
    await api.gifts.remove(id);
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h2>📦 礼品分类清单</h2>
        <button className="btn btn-primary" onClick={openCreate}>＋ 新增礼品</button>
      </div>

      <div className="toolbar">
        <input placeholder="搜索礼品名称..." value={q} onChange={e => setQ(e.target.value)} />
        <select value={cat} onChange={e => setCat(e.target.value)}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="card">
        {gifts.length === 0 ? (
          <div className="empty">暂无礼品，请添加</div>
        ) : (
          <table>
            <thead>
              <tr><th>名称</th><th>分类</th><th>价格</th><th>库存</th><th>标签</th><th>操作</th></tr>
            </thead>
            <tbody>
              {gifts.map(g => (
                <tr key={g._id}>
                  <td><strong>{g.name}</strong><br /><small style={{color:'#7f8c8d'}}>{g.description}</small></td>
                  <td>{g.category}</td>
                  <td>¥{g.price}</td>
                  <td>{g.quantity}</td>
                  <td>{(g.tags || []).map(t => <span key={t} className="tag">{t}</span>)}</td>
                  <td>
                    <button className="btn btn-sm btn-secondary" onClick={() => openEdit(g)}>编辑</button>
                    <button className="btn btn-sm btn-danger" onClick={() => remove(g._id)}>删除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <Modal title={editing ? '编辑礼品' : '新增礼品'} onClose={() => setShowModal(false)} onSubmit={submit}>
          <div className="form-group"><label>礼品名称</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
          <div className="form-row">
            <div className="form-group"><label>分类</label><input value={form.category} onChange={e => setForm({...form, category: e.target.value})} required /></div>
            <div className="form-group"><label>价格 (¥)</label><input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>库存</label><input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} /></div>
            <div className="form-group"><label>标签 (逗号分隔)</label><input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} /></div>
          </div>
          <div className="form-group"><label>描述</label><textarea rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
        </Modal>
      )}
    </div>
  );
}
