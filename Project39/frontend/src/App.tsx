import { Routes, Route, Link, useLocation } from 'react-router-dom';
import FitnessPlans from './pages/FitnessPlans';
import CheckIn from './pages/CheckIn';
import Statistics from './pages/Statistics';

function App() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '健身方案', icon: '📋' },
    { path: '/check-in', label: '每日打卡', icon: '✅' },
    { path: '/statistics', label: '数据统计', icon: '📊' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">💪 健身计划管理</span>
            </div>
            <div className="flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-4 py-2 border-b-2 text-sm font-medium transition-colors ${
                    location.pathname === item.path || (item.path === '/' && location.pathname === '/')
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<FitnessPlans />} />
          <Route path="/check-in" element={<CheckIn />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
