import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store';
import { LogOut, Calendar, User, Menu } from 'lucide-react';

export default function StaffMobileLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAppStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/staff/tasks/hosted', label: '托管任务', icon: Calendar },
    { path: '/staff/tasks/daily', label: '代肝任务', icon: Calendar },
    { path: '/staff/profile', label: '个人中心', icon: User },
  ];

  const currentItem = navItems.find((item) => item.path === location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 移动端顶部导航栏 */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-bold text-blue-600">代肝助手</h1>
            {currentItem && (
              <p className="text-xs text-gray-500">{currentItem.label}</p>
            )}
          </div>
          <div className="w-10"></div>
        </div>
      </header>

      {/* 侧边菜单 */}
      {isMenuOpen && (
        <>
          {/* 遮罩层 */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
          {/* 侧边栏 */}
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-50">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-blue-600">代肝管理系统</h2>
              <p className="text-sm text-gray-500 mt-1">员工工作台</p>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.path}>
                      <button
                        onClick={() => {
                          navigate(item.path);
                          setIsMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">员工</p>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>退出登录</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* 移动端内容区域 */}
      <main className="pb-20">
        <div className="p-4">
          <Outlet />
        </div>
      </main>

      {/* 移动端底部导航栏 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center px-2 py-2 rounded-lg ${
                  isActive ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
