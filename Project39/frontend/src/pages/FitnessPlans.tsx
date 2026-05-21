import { useState, useEffect } from 'react';
import { fitnessPlanApi } from '../api';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  duration?: number;
  restTime?: number;
}

interface FitnessPlan {
  id: number;
  name: string;
  description: string;
  exercises: Exercise[];
  isActive: boolean;
}

export default function FitnessPlans() {
  const [plans, setPlans] = useState<FitnessPlan[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<FitnessPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    exercises: [{ name: '', sets: 3, reps: 10 }],
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await fitnessPlanApi.getAll();
      setPlans(response.data);
    } catch (error) {
      console.error('加载健身方案失败:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingPlan) {
        await fitnessPlanApi.update(editingPlan.id, formData);
      } else {
        await fitnessPlanApi.create(formData);
      }
      loadPlans();
      closeModal();
    } catch (error) {
      console.error('保存失败:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm('确定要删除这个健身方案吗？')) {
      try {
        await fitnessPlanApi.delete(id);
        loadPlans();
      } catch (error) {
        console.error('删除失败:', error);
      }
    }
  };

  const handleEdit = (plan: FitnessPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      exercises: plan.exercises,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPlan(null);
    setFormData({
      name: '',
      description: '',
      exercises: [{ name: '', sets: 3, reps: 10 }],
    });
  };

  const addExercise = () => {
    setFormData({
      ...formData,
      exercises: [...formData.exercises, { name: '', sets: 3, reps: 10 }],
    });
  };

  const removeExercise = (index: number) => {
    setFormData({
      ...formData,
      exercises: formData.exercises.filter((_, i) => i !== index),
    });
  };

  const updateExercise = (index: number, field: string, value: any) => {
    const newExercises = [...formData.exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setFormData({ ...formData, exercises: newExercises });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">健身方案管理</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + 创建新方案
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{plan.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  plan.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {plan.isActive ? '激活' : '停用'}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">训练动作:</h4>
                <ul className="space-y-2">
                  {plan.exercises.map((ex, i) => (
                    <li key={i} className="text-sm text-gray-600 flex justify-between">
                      <span>{ex.name}</span>
                      <span>{ex.sets}组 × {ex.reps}次</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleEdit(plan)}
                  className="flex-1 bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                >
                  编辑
                </button>
                <button
                  onClick={() => handleDelete(plan.id)}
                  className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        ))}

        {plans.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            还没有健身方案，点击右上角按钮创建第一个方案吧！
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {editingPlan ? '编辑健身方案' : '创建新健身方案'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">方案名称</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">方案描述</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">训练动作</label>
                    <button
                      type="button"
                      onClick={addExercise}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      + 添加动作
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.exercises.map((ex, i) => (
                      <div key={i} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                        <input
                          type="text"
                          placeholder="动作名称"
                          value={ex.name}
                          onChange={(e) => updateExercise(i, 'name', e.target.value)}
                          className="flex-1 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        <input
                          type="number"
                          placeholder="组"
                          value={ex.sets}
                          onChange={(e) => updateExercise(i, 'sets', parseInt(e.target.value))}
                          className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="1"
                          required
                        />
                        <input
                          type="number"
                          placeholder="次"
                          value={ex.reps}
                          onChange={(e) => updateExercise(i, 'reps', parseInt(e.target.value))}
                          className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="1"
                          required
                        />
                        {formData.exercises.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExercise(i)}
                            className="text-red-500 hover:text-red-600 text-sm"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? '保存中...' : '保存'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
