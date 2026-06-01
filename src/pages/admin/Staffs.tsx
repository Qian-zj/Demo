import { useState } from 'react';
import { useAppStore } from '@/store';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function Staffs() {
  const { staffs, tasks, addStaff, updateStaff, deleteStaff } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    avatar: '',
    status: 'active' as const,
  });

  const hasAssignedTasks = (staffId: string) => {
    return tasks.some((task: any) => task.staffId === staffId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaff) {
      await updateStaff(editingStaff.id, formData);
    } else {
      await addStaff(formData);
    }
    setIsModalOpen(false);
    setEditingStaff(null);
    setFormData({
      name: '',
      username: '',
      password: '',
      avatar: '',
      status: 'active',
    });
  };

  const handleEdit = (staff: any) => {
    setEditingStaff(staff);
    setFormData(staff);
    setIsModalOpen(true);
  };

  const handleDelete = async (staffId: string) => {
    if (confirm('确定要删除该员工吗？')) {
      try {
        await deleteStaff(staffId);
      } catch (error) {
        alert('删除失败：该员工有负责的任务');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">员工管理</h1>
          <p className="text-gray-500 mt-1">管理所有员工信息</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span>新增员工</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">员工姓名</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户名</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {staffs.map((staff: any) => {
                const hasTasks = hasAssignedTasks(staff.id);
                return (
                  <tr key={staff.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{staff.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{staff.username}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        staff.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {staff.status === 'active' ? '在职中' : '已离职'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEdit(staff)}
                          className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>编辑</span>
                        </button>
                        <button
                          onClick={() => handleDelete(staff.id)}
                          disabled={hasTasks}
                          className={`flex items-center space-x-1 ${
                            hasTasks
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-red-600 hover:text-red-800'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>删除</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">{editingStaff ? '编辑员工' : '新增员工'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <label className="w-24 text-sm font-medium text-gray-700">姓名</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="w-24 text-sm font-medium text-gray-700">用户名</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="w-24 text-sm font-medium text-gray-700">密码</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="w-24 text-sm font-medium text-gray-700">状态</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="active">在职中</option>
                  <option value="inactive">已离职</option>
                </select>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingStaff ? '保存' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
