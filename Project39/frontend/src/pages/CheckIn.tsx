import { useState, useEffect } from 'react';
import { checkInApi, fitnessPlanApi } from '../api';

interface CompletedExercise {
  name: string;
  completedSets: number;
  completedReps: number;
}

interface CheckInRecord {
  id: number;
  planId: number;
  checkInDate: string;
  completedExercises: CompletedExercise[];
  notes: string;
  caloriesBurned: number;
  durationMinutes: number;
  plan?: { name: string };
}

interface FitnessPlan {
  id: number;
  name: string;
  exercises: { name: string; sets: number; reps: number }[];
}

export default function CheckIn() {
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>([]);
  const [plans, setPlans] = useState<FitnessPlan[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [formData, setFormData] = useState({
    planId: 0,
    checkInDate: new Date().toISOString().split('T')[0],
    completedExercises: [] as CompletedExercise[],
    notes: '',
    caloriesBurned: 0,
    durationMinutes: 0,
  });

  useEffect(() => {
    loadPlans();
    loadCheckIns();
  }, [selectedDate]);

  const loadPlans = async () => {
    try {
      const response = await fitnessPlanApi.getAll();
      setPlans(response.data);
      if (response.data.length > 0) {
        handlePlanChange(response.data[0].id, response.data[0].exercises);
      }
    } catch (error) {
      console.error('加载健身方案失败:', error);
    }
  };

  const loadCheckIns = async () => {
    try {
      const response = await checkInApi.getAll({ date: selectedDate });
      setCheckIns(response.data);
    } catch (error) {
      console.error('加载打卡记录失败:', error);
    }
  };

  const handlePlanChange = (planId: number, exercises?: any[]) => {
    const plan = plans.find(p => p.id === planId);
    const planExercises = exercises || plan?.exercises || [];
    const completedExercises = planExercises.map(ex => ({
      name: ex.name,
      completedSets: ex.sets,
      completedReps: ex.reps,
    }));
    setFormData({ ...formData, planId, completedExercises });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.planId) {
      alert('请选择健身方案');
      return;
    }
    setLoading(true);
    try {
      await checkInApi.create(formData);
      loadCheckIns();
      setShowModal(false);
    } catch (error) {
      console.error('打卡失败:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm('确定要删除这条打卡记录吗？')) {
      try {
        await checkInApi.delete(id);
        loadCheckIns();
      } catch (error) {
        console.error('删除失败:', error);
      }
    }
  };

  const updateExercise = (index: number, field: string, value: any) => {
    const newExercises = [...formData.completedExercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setFormData({ ...formData, completedExercises: newExercises });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800">每日打卡</h1>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          + 今日打卡
        </button>
      </div>

      <div className="space-y-4">
        {checkIns.map((checkIn) => (
          <div key={checkIn.id} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {checkIn.plan?.name || '未知方案'}
                </h3>
                <p className="text-sm text-gray-500">{checkIn.checkInDate}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">消耗卡路里</p>
                  <p className="text-xl font-bold text-orange-500">{checkIn.caloriesBurned} kcal</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">运动时长</p>
                  <p className="text-xl font-bold text-blue-500">{checkIn.durationMinutes} 分钟</p>
                </div>
                <button
                  onClick={() => handleDelete(checkIn.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  🗑️
                </button>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-medium text-gray-700 mb-2">完成动作:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {checkIn.completedExercises.map((ex, i) => (
                  <div key={i} className="bg-green-50 rounded-lg px-3 py-2">
                    <p className="text-sm font-medium text-green-800">{ex.name}</p>
                    <p className="text-xs text-green-600">
                      {ex.completedSets}组 × {ex.completedReps}次
                    </p>
                  </div>
                ))}
              </div>
              {checkIn.notes && (
                <p className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                  💬 {checkIn.notes}
                </p>
              )}
            </div>
          </div>
        ))}

        {checkIns.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <p className="text-gray-500">今日还没有打卡记录，点击右上角按钮开始打卡吧！</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">今日健身打卡</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">选择健身方案</label>
                  <select
                    value={formData.planId}
                    onChange={(e) => handlePlanChange(parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value={0}>请选择健身方案</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>{plan.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">打卡日期</label>
                  <input
                    type="date"
                    value={formData.checkInDate}
                    onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">完成动作</label>
                  <div className="space-y-2">
                    {formData.completedExercises.map((ex, i) => (
                      <div key={i} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                        <span className="flex-1 text-sm font-medium">{ex.name}</span>
                        <input
                          type="number"
                          value={ex.completedSets}
                          onChange={(e) => updateExercise(i, 'completedSets', parseInt(e.target.value))}
                          className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="0"
                        />
                        <span className="text-sm text-gray-500">组</span>
                        <input
                          type="number"
                          value={ex.completedReps}
                          onChange={(e) => updateExercise(i, 'completedReps', parseInt(e.target.value))}
                          className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="0"
                        />
                        <span className="text-sm text-gray-500">次</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">消耗卡路里 (kcal)</label>
                    <input
                      type="number"
                      value={formData.caloriesBurned}
                      onChange={(e) => setFormData({ ...formData, caloriesBurned: parseInt(e.target.value) || 0 })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">运动时长 (分钟)</label>
                    <input
                      type="number"
                      value={formData.durationMinutes}
                      onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 0 })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">备注 (可选)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="记录今天的感受..."
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? '提交中...' : '完成打卡 ✓'}
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
