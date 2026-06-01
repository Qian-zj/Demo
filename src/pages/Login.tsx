import { useState } from 'react';
import { useAppStore } from '@/store';
import { User, Lock } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'staff'>('admin');
  const [error, setError] = useState('');
  const { setUser, fetchBosses, fetchStaffs, fetchTasks } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (role === 'admin') {
      if (username === 'admin' && password === 'admin123') {
        setUser({ id: 'admin', name: '管理员', role: 'admin' });
        await Promise.all([fetchBosses(), fetchStaffs(), fetchTasks()]);
      } else {
        setError('用户名或密码错误');
      }
    } else {
      const res = await fetch('/api/staff');
      const staffs = await res.json();
      const staff = staffs.find((s: any) => s.username === username && s.password === password);
      if (staff) {
        setUser({ id: staff.id, name: staff.name, role: 'staff' });
        await Promise.all([fetchBosses(), fetchStaffs(), fetchTasks()]);
      } else {
        setError('用户名或密码错误');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">代肝管理系统</h1>
        <p className="text-gray-500 text-center mb-8">请登录您的账号</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                role === 'admin'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              管理员
            </button>
            <button
              type="button"
              onClick={() => setRole('staff')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                role === 'staff'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              员工
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">用户名</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={role === 'admin' ? 'admin' : 'zhangsan'}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={role === 'admin' ? 'admin123' : '123456'}
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            登录
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-500">
          管理员账号: admin / admin123
        </p>
      </div>
    </div>
  );
}
