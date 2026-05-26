import React, { useState, useEffect } from 'react';
import { fitnessPlanApi } from '../api';

export default function FitnessPlans() {
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 30,
    exercises: [],
    frequencyPerWeek: 3,
    difficulty: 'beginner',
    isActive: true,
  });
  const [exerciseInput, setExerciseInput] = useState('');

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const res = await fitnessPlanApi.getAll();
      setPlans(res.data);
    } catch (error) {
      console.error('Failed to load plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExercise = () => {
    if (exerciseInput.trim()) {
      setFormData({
        ...formData,
        exercises: [...formData.exercises, exerciseInput.trim()],
      });
      setExerciseInput('');
    }
  };

  const handleRemoveExercise = (index) => {
    const newExercises = [...formData.exercises];
    newExercises.splice(index, 1);
    setFormData({ ...formData, exercises: newExercises });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        await fitnessPlanApi.update(editingPlan.id, formData);
      } else {
        await fitnessPlanApi.create(formData);
      }
      setShowModal(false);
      resetForm();
      loadPlans();
    } catch (error) {
      console.error('Failed to save plan:', error);
      alert('保存失败，请重试');
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description || '',
      duration: plan.duration,
      exercises: plan.exercises || [],
      frequencyPerWeek: plan.frequencyPerWeek,
      difficulty: plan.difficulty,
      isActive: plan.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('确定要删除这个健身计划吗？')) {
      try {
        await fitnessPlanApi.delete(id);
        loadPlans();
      } catch (error) {
        console.error('Failed to delete plan:', error);
        alert('删除失败，请重试');
      }
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await fitnessPlanApi.toggleActive(id);
      loadPlans();
    } catch (error) {
      console.error('Failed to toggle plan:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration: 30,
      exercises: [],
      frequencyPerWeek: 3,
      difficulty: 'beginner',
      isActive: true,
    });
    setEditingPlan(null);
    setExerciseInput('');
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">健身方案</h1>
          <p className="page-subtitle">管理您的健身计划</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + 新建计划
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>暂无健身计划，点击上方按钮创建</p>
        </div>
      ) : (
        plans.map(plan => (
          <div key={plan.id} className="card">
            <div className="card-header">
              <h3 className="card-title">{plan.name}</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span className={`badge badge-${plan.difficulty}`}>
                  {plan.difficulty === 'beginner'
                    ? '初级'
                    : plan.difficulty === 'intermediate'
                    ? '中级'
                    : '高级'}
                </span>
                <span className={`badge ${plan.isActive ? 'badge-active' : 'badge-inactive'}`}>
                  {plan.isActive ? '活跃' : '已停用'}
                </span>
              </div>
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
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-outline btn-sm" onClick={() => handleEdit(plan)}>
                编辑
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => handleToggleActive(plan.id)}>
                {plan.isActive ? '停用' : '启用'}
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(plan.id)}>
                删除
              </button>
            </div>
          </div>
        ))
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingPlan ? '编辑健身计划' : '新建健身计划'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">计划名称</label>
                <input
                  className="form-input"
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">描述</label>
                <textarea
                  className="form-textarea"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">每次时长(分钟)</label>
                  <input
                    className="form-input"
                    type="number"
                    min="1"
                    max="365"
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">每周次数</label>
                  <input
                    className="form-input"
                    type="number"
                    min="1"
                    max="7"
                    value={formData.frequencyPerWeek}
                    onChange={e =>
                      setFormData({ ...formData, frequencyPerWeek: parseInt(e.target.value) })
                    }
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">难度级别</label>
                <select
                  className="form-select"
                  value={formData.difficulty}
                  onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                >
                  <option value="beginner">初级</option>
                  <option value="intermediate">中级</option>
                  <option value="advanced">高级</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">训练项目</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    className="form-input"
                    type="text"
                    value={exerciseInput}
                    onChange={e => setExerciseInput(e.target.value)}
                    placeholder="输入训练项目"
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddExercise())}
                  />
                  <button type="button" className="btn btn-outline" onClick={handleAddExercise}>
                    添加
                  </button>
                </div>
                <div className="exercise-tags">
                  {formData.exercises.map((ex, i) => (
                    <span key={i} className="exercise-tag" style={{ cursor: 'pointer' }} onClick={() => handleRemoveExercise(i)}>
                      {ex} ×
                    </span>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  启用此计划
                </label>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  取消
                </button>
                <button type="submit" className="btn btn-primary">
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
