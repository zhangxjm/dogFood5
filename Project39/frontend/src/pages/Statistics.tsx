import { useState, useEffect } from 'react';
import { statisticsApi } from '../api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Statistics() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStatistics();
  }, [selectedYear, selectedMonth]);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const response = await statisticsApi.getMonthly(selectedYear, selectedMonth);
      setStatistics(response.data);
    } catch (error) {
      console.error('加载统计数据失败:', error);
    }
    setLoading(false);
  };

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">加载中...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">月度数据统计</h1>
        <div className="flex space-x-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}年</option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {months.map((month) => (
              <option key={month} value={month}>{month}月</option>
            ))}
          </select>
        </div>
      </div>

      {statistics && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-sm text-gray-500">累计打卡次数</p>
              <p className="text-3xl font-bold text-blue-600">{statistics.summary?.totalCheckIns || 0}</p>
              <p className="text-sm text-gray-400 mt-1">次</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-sm text-gray-500">累计消耗卡路里</p>
              <p className="text-3xl font-bold text-orange-500">{statistics.summary?.totalCalories || 0}</p>
              <p className="text-sm text-gray-400 mt-1">kcal</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-sm text-gray-500">累计运动时长</p>
              <p className="text-3xl font-bold text-green-600">{statistics.summary?.totalDuration || 0}</p>
              <p className="text-sm text-gray-400 mt-1">分钟</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-sm text-gray-500">平均每次消耗</p>
              <p className="text-3xl font-bold text-purple-600">{statistics.summary?.averageCaloriesPerDay || 0}</p>
              <p className="text-sm text-gray-400 mt-1">kcal/次</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">每日卡路里消耗趋势</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={statistics.dailyStats || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="totalCalories" stroke="#f97316" name="卡路里 (kcal)" strokeWidth={2} />
                  <Line type="monotone" dataKey="totalDuration" stroke="#10b981" name="时长 (分钟)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">各健身方案使用统计</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statistics.planStats || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="planName" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="checkInCount" fill="#3b82f6" name="打卡次数" />
                  <Bar dataKey="totalCalories" fill="#f97316" name="卡路里 (kcal)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">打卡历史记录</h3>
            {statistics.checkIns && statistics.checkIns.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">日期</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">方案名称</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">消耗卡路里</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">运动时长</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">备注</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statistics.checkIns.map((checkIn: any) => (
                      <tr key={checkIn.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{checkIn.checkInDate}</td>
                        <td className="py-3 px-4">{checkIn.plan?.name || '-'}</td>
                        <td className="py-3 px-4">{checkIn.caloriesBurned} kcal</td>
                        <td className="py-3 px-4">{checkIn.durationMinutes} 分钟</td>
                        <td className="py-3 px-4 text-gray-500">{checkIn.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">本月暂无打卡记录</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
