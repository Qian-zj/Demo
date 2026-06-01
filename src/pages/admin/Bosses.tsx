import { useState } from 'react';
import { useAppStore } from '@/store';
import { Plus, Edit2, X } from 'lucide-react';

export default function Bosses() {
  const { bosses, addBoss, updateBoss } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBoss, setEditingBoss] = useState<any>(null);
  const [formData, setFormData] = useState({
    bossNo: '',
    gameAccount: '',
    gameId: '',
    gamePassword: '',
    game: '绝区零',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBoss) {
      await updateBoss(editingBoss.id, formData);
    } else {
      await addBoss(formData);
    }
    setIsModalOpen(false);
    setEditingBoss(null);
    setFormData({
      bossNo: '',
      gameAccount: '',
      gameId: '',
      gamePassword: '',
      game: '绝区零',
    });
  };

  const handleEdit = (boss: any) => {
    setEditingBoss(boss);
    setFormData(boss);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">老板管理</h1>
          <p className="text-gray-500 mt-1">管理所有老板信息</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span>新增老板</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">老板编号</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">游戏账号</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">游戏ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">游戏密码</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">游戏</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bosses.map((boss: any) => (
                <tr key={boss.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{boss.bossNo}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{boss.gameAccount}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{boss.gameId}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{boss.gamePassword}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{boss.game}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleEdit(boss)}
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>编辑</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">{editingBoss ? '编辑老板' : '新增老板'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <label className="w-24 text-sm font-medium text-gray-700">老板编号</label>
                <input
                  type="text"
                  value={formData.bossNo}
                  onChange={(e) => setFormData({ ...formData, bossNo: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="w-24 text-sm font-medium text-gray-700">游戏账号</label>
                <input
                  type="text"
                  value={formData.gameAccount}
                  onChange={(e) => setFormData({ ...formData, gameAccount: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="w-24 text-sm font-medium text-gray-700">游戏ID</label>
                <input
                  type="text"
                  value={formData.gameId}
                  onChange={(e) => setFormData({ ...formData, gameId: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="w-24 text-sm font-medium text-gray-700">游戏密码</label>
                <input
                  type="text"
                  value={formData.gamePassword}
                  onChange={(e) => setFormData({ ...formData, gamePassword: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="w-24 text-sm font-medium text-gray-700">游戏</label>
                <input
                  type="text"
                  value={formData.game}
                  onChange={(e) => setFormData({ ...formData, game: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
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
                  {editingBoss ? '保存' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
